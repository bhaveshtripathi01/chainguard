import { useState } from "react"
import CodeEditor from "../components/CodeEditor"
import AuditResults from "../components/AuditResults"
import { useWallet } from "../context/WalletContext"
import { submitAudit, updateBlockchainInfo } from "../utils/api"

const Home = () => {
    const { walletAddress } = useWallet()
    const [auditData, setAuditData] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isStoring, setIsStoring] = useState(false)
    const [error, setError] = useState("")
    const [successMsg, setSuccessMsg] = useState("")

    const handleAudit = async (contractCode, contractName) => {
        try {
            setIsLoading(true)
            setError("")
            setAuditData(null)
            setSuccessMsg("")
            const result = await submitAudit(contractCode, contractName, walletAddress)
            setAuditData(result.data)
        } catch (err) {
            setError("Audit failed. Make sure backend is running.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleStoreOnChain = async (auditId, blockchainHash) => {
        try {
            setIsStoring(true)
            setError("")

            if (!window.ethereum) {
                setError("MetaMask not found. Please install MetaMask.")
                return
            }

            const { ethers } = await import("ethers")

            const CONTRACT_ADDRESS = "0x2cf97c73d3373D017e2b810a2053ac1801246Dfc"
            const CONTRACT_ABI = [
                "function storeAudit(string memory auditId, string memory auditHash, string memory contractName) public",
                "function getAudit(string memory auditId) public view returns (tuple(string auditHash, address auditor, uint256 timestamp, string contractName))",
                "function getTotalAudits() public view returns (uint256)"
            ]

            const provider = new ethers.BrowserProvider(window.ethereum)
            const signer = await provider.getSigner()
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)

            console.log("Storing audit on blockchain...")
            const tx = await contract.storeAudit(
                auditId,
                blockchainHash,
                auditData.contractName
            )

            console.log("Transaction sent:", tx.hash)
            await tx.wait()
            console.log("Transaction confirmed!")

            await updateBlockchainInfo(auditId, tx.hash, walletAddress)

            setSuccessMsg(`✅ Stored on blockchain! TX: ${tx.hash.slice(0, 20)}...`)
            setAuditData(prev => ({
                ...prev,
                isStoredOnChain: true,
                blockchainTxHash: tx.hash
            }))

        } catch (err) {
            if (err.code === 4001) {
                setError("Transaction rejected by user.")
            } else {
                setError(`Blockchain error: ${err.message}`)
            }
        } finally {
            setIsStoring(false)
        }
    }

    return (
        <div style={{
            maxWidth: "960px",
            margin: "0 auto",
            padding: "60px 24px",
            position: "relative",
            zIndex: 1
        }}>
            {/* Hero Section */}
            <div style={{
                textAlign: "center",
                marginBottom: "56px",
                animation: "fadeInUp 0.6s ease forwards"
            }}>
                <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: "#00ff8810",
                    border: "1px solid #00ff8830",
                    padding: "6px 16px",
                    borderRadius: "20px",
                    marginBottom: "24px"
                }}>
                    <div style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: "#00ff88",
                        boxShadow: "0 0 8px #00ff88"
                    }} />
                    <span style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: "11px",
                        color: "#00ff88",
                        letterSpacing: "1px",
                        textTransform: "uppercase"
                    }}>
                        Powered by Slither — Industry Standard
                    </span>
                </div>

                <h1 style={{
                    fontSize: "56px",
                    fontWeight: "800",
                    lineHeight: "1.1",
                    margin: "0 0 20px 0",
                    letterSpacing: "-1px"
                }}>
                    <span style={{ color: "#e8e8f0" }}>Smart Contract</span>
                    <br />
                    <span style={{
                        background: "linear-gradient(90deg, #00ff88, #00d4ff, #7c3aed)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}>
                        Security Auditor
                    </span>
                </h1>

                <p style={{
                    color: "#8888aa",
                    fontSize: "18px",
                    maxWidth: "500px",
                    margin: "0 auto",
                    lineHeight: "1.6"
                }}>
                    Paste your Solidity code → Get instant vulnerability report → Store proof on blockchain forever
                </p>
            </div>

            {/* Stats Bar */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "16px",
                marginBottom: "40px"
            }}>
                {[
                    { label: "Vulnerability Types", value: "90+", icon: "🔍", color: "#00ff88" },
                    { label: "Powered By", value: "Slither", icon: "⚡", color: "#00d4ff" },
                    { label: "Storage", value: "On-Chain", icon: "⛓️", color: "#7c3aed" }
                ].map((stat) => (
                    <div key={stat.label} style={{
                        backgroundColor: "#0c0c1e",
                        border: "1px solid #1a1a3e",
                        borderRadius: "14px",
                        padding: "24px",
                        textAlign: "center",
                        position: "relative",
                        overflow: "hidden"
                    }}>
                        <div style={{
                            position: "absolute",
                            top: 0, left: 0, right: 0,
                            height: "2px",
                            backgroundColor: stat.color,
                            opacity: 0.5
                        }} />
                        <div style={{ fontSize: "28px", marginBottom: "10px" }}>
                            {stat.icon}
                        </div>
                        <div style={{
                            color: stat.color,
                            fontSize: "22px",
                            fontWeight: "800",
                            fontFamily: "'Space Mono', monospace",
                            marginBottom: "6px"
                        }}>
                            {stat.value}
                        </div>
                        <div style={{
                            color: "#444466",
                            fontSize: "12px",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            fontWeight: "600"
                        }}>
                            {stat.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Error Message */}
            {error && (
                <div style={{
                    backgroundColor: "#ff336610",
                    border: "1px solid #ff336630",
                    borderRadius: "10px",
                    padding: "14px 18px",
                    marginBottom: "20px",
                    color: "#ff3366",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                }}>
                    <span>❌</span> {error}
                </div>
            )}

            {/* Success Message */}
            {successMsg && (
                <div style={{
                    backgroundColor: "#00ff8810",
                    border: "1px solid #00ff8830",
                    borderRadius: "10px",
                    padding: "14px 18px",
                    marginBottom: "20px",
                    color: "#00ff88",
                    fontSize: "14px",
                    fontFamily: "'Space Mono', monospace",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                }}>
                    {successMsg}
                </div>
            )}

            {/* Code Editor */}
            <CodeEditor
                onSubmit={handleAudit}
                isLoading={isLoading}
            />

            {/* Audit Results */}
            {auditData && (
                <AuditResults
                    auditData={auditData}
                    onStoreOnChain={handleStoreOnChain}
                    isStoring={isStoring}
                />
            )}
        </div>
    )
}

export default Home