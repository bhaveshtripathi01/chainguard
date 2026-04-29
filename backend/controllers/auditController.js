const { v4: uuidv4 } = require("uuid")
const fs = require("fs")
const path = require("path")
const { exec } = require("child_process")
const Audit = require("../models/Audit")

// ─────────────────────────────────────────
// HELPER: Run Slither on Solidity code
// ─────────────────────────────────────────
const runSlither = (filePath) => {
    return new Promise((resolve) => {
        const outputPath = filePath.replace(".sol", "_output.json")

        const command = `slither "${filePath}" --json "${outputPath}"`

        exec(command, (error, stdout, stderr) => {
            try {
                // Read the JSON output file Slither creates
                if (fs.existsSync(outputPath)) {
                    const raw = fs.readFileSync(outputPath, "utf8")
                    const parsed = JSON.parse(raw)

                    // Clean up temp files
                    fs.unlinkSync(filePath)
                    fs.unlinkSync(outputPath)

                    resolve(parsed)
                } else {
                    // Clean up temp file
                    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
                    resolve({ success: false, results: { detectors: [] } })
                }
            } catch (err) {
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
                resolve({ success: false, results: { detectors: [] } })
            }
        })
    })
}

// ─────────────────────────────────────────
// HELPER: Parse Slither results
// ─────────────────────────────────────────
const parseSlitherResults = (slitherOutput) => {
    const vulnerabilities = []
    const severityCount = {
        critical: 0,
        high: 0,
        medium: 0,
        low: 0,
        info: 0
    }

    try {
        const detectors = slitherOutput?.results?.detectors || []

        detectors.forEach((detector) => {
            const impact = detector.impact?.toLowerCase() || "info"
            const severity = ["high", "medium", "low", "info"].includes(impact)
                ? impact
                : "info"

            // Map "high" impact to critical if confidence is high
            const finalSeverity =
                severity === "high" && detector.confidence === "High"
                    ? "critical"
                    : severity

            vulnerabilities.push({
                id: uuidv4(),
                name: detector.check || "Unknown",
                description: detector.description || "No description",
                severity: finalSeverity,
                confidence: detector.confidence || "Unknown",
                locations: detector.elements?.map((el) => ({
                    contract: el.type_specific_fields?.parent?.name || "",
                    function: el.name || "",
                    line: el.source_mapping?.lines?.[0] || 0
                })) || []
            })

            // Count by severity
            if (severityCount[finalSeverity] !== undefined) {
                severityCount[finalSeverity]++
            }
        })
    } catch (err) {
        console.error("Error parsing Slither results:", err)
    }

    return { vulnerabilities, severityCount }
}

// ─────────────────────────────────────────
// HELPER: Generate audit hash
// ─────────────────────────────────────────
const generateAuditHash = (auditId, vulnerabilities, contractCode) => {
    const crypto = require("crypto")
    const data = JSON.stringify({ auditId, vulnerabilities, contractCode })
    return "0x" + crypto.createHash("sha256").update(data).digest("hex")
}

// ─────────────────────────────────────────
// CONTROLLER 1: Create Audit
// POST /api/audit
// ─────────────────────────────────────────
const createAudit = async (req, res) => {
    try {
        const { contractCode, contractName, walletAddress } = req.body

        // Validate input
        if (!contractCode || !contractName) {
            return res.status(400).json({
                success: false,
                message: "Contract code and name are required"
            })
        }

        // Generate unique audit ID
        const auditId = uuidv4()

        // Save Solidity code to temp file for Slither to analyze
        const tempDir = path.join(__dirname, "../temp")
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir)

        const tempFilePath = path.join(tempDir, `${auditId}.sol`)
        fs.writeFileSync(tempFilePath, contractCode)

        console.log("🔍 Running Slither analysis...")

        // Run Slither
        const slitherOutput = await runSlither(tempFilePath)

        // Parse results
        const { vulnerabilities, severityCount } = parseSlitherResults(slitherOutput)

        // Generate audit hash
        const blockchainHash = generateAuditHash(auditId, vulnerabilities, contractCode)

        // Save to MongoDB
        const audit = new Audit({
            auditId,
            walletAddress: walletAddress || "not connected",
            contractName,
            contractCode,
            vulnerabilities,
            severity: severityCount,
            blockchainHash
        })

        await audit.save()

        console.log(`✅ Audit completed: ${auditId}`)

        res.status(201).json({
            success: true,
            message: "Audit completed successfully",
            data: {
                auditId,
                contractName,
                vulnerabilities,
                severity: severityCount,
                blockchainHash,
                totalIssues: vulnerabilities.length
            }
        })
    } catch (error) {
        console.error("❌ Audit error:", error)
        res.status(500).json({
            success: false,
            message: "Audit failed",
            error: error.message
        })
    }
}

// ─────────────────────────────────────────
// CONTROLLER 2: Get Audit History
// GET /api/audit/history
// ─────────────────────────────────────────
const getAuditHistory = async (req, res) => {
    try {
        const { walletAddress } = req.query

        const filter = walletAddress ? { walletAddress } : {}

        const audits = await Audit.find(filter)
            .select("-contractCode")
            .sort({ createdAt: -1 })
            .limit(20)

        res.json({
            success: true,
            count: audits.length,
            data: audits
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// ─────────────────────────────────────────
// CONTROLLER 3: Get Audit By ID
// GET /api/audit/:id
// ─────────────────────────────────────────
const getAuditById = async (req, res) => {
    try {
        const audit = await Audit.findOne({ auditId: req.params.id })

        if (!audit) {
            return res.status(404).json({
                success: false,
                message: "Audit not found"
            })
        }

        res.json({
            success: true,
            data: audit
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// ─────────────────────────────────────────
// CONTROLLER 4: Update Blockchain Info
// PUT /api/audit/:id/blockchain
// ─────────────────────────────────────────
const updateBlockchainInfo = async (req, res) => {
    try {
        const { txHash, walletAddress } = req.body

        const audit = await Audit.findOneAndUpdate(
            { auditId: req.params.id },
            {
                blockchainTxHash: txHash,
                walletAddress: walletAddress,
                isStoredOnChain: true
            },
            { new: true }
        )

        if (!audit) {
            return res.status(404).json({
                success: false,
                message: "Audit not found"
            })
        }

        res.json({
            success: true,
            message: "Blockchain info updated",
            data: audit
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    createAudit,
    getAuditHistory,
    getAuditById,
    updateBlockchainInfo
}