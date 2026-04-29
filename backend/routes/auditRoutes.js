const express = require("express")
const router = express.Router()
const {
    createAudit,
    getAuditHistory,
    getAuditById,
    updateBlockchainInfo
} = require("../controllers/auditController")

// POST /api/audit
// → accept Solidity code, run Slither, return results
router.post("/", createAudit)

// GET /api/audit/history
// → get all past audits
router.get("/history", getAuditHistory)

// GET /api/audit/:id
// → get one specific audit
router.get("/:id", getAuditById)

// PUT /api/audit/:id/blockchain
// → update audit with blockchain transaction info
router.put("/:id/blockchain", updateBlockchainInfo)

module.exports = router