import { useState, useEffect } from "react"
import { useWallet } from "../context/WalletContext"
import { getAuditHistory } from "../utils/api"
import { formatDate, getTotalIssues, formatTxHash } from "../utils/helpers"

const History = () => {
    const { walletAddress } = useWallet()
    const [audits, setAudits] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchHistory()
    }, [])

    const fetchHistory = async () => {
        try {
            setIsLoading(true)
            const result = await getAuditHistory(walletAddress)
            setAudits(result.data)
        } catch (err) {
            console.error("Failed to fetch history:", err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "40px 20px"
        }}>
            <h1 style={{
                color: "#ffffff",
                marginBottom: "8px"
            }}>
                📋 Audit History
            </h1>
            <p style={{
                color: "#888888",
                marginBottom: "32px"
            }}>
                All past smart contract audits
            </p>

            {isLoading ? (
                <div style={{ textAlign: "center", color: "#888888", padding: "60px" }}>
                    Loading audits...
                </div>
            ) : audits.length === 0 ? (
                <div style={{
                    backgroundColor: "#1a1a2e",
                    border: "1px solid #2d2d44",
                    borderRadius: "10px",
                    padding: "60px",
                    textAlign: "center"
                }}>
                    <p style={{ color: "#888888", fontSize: "16px" }}>
                        No audits yet. Go audit a contract!
                    </p>
                </div>
            ) : (
                <div>
                    {audits.map((audit) => {
                        const total = getTotalIssues(audit.severity)
                        return (
                            <div key={audit.auditId} style={{
                                backgroundColor: "#1a1a2e",
                                border: "1px solid #2d2d44",
                                borderRadius: "10px",
                                padding: "20px",
                                marginBottom: "12px"
                            }}>
                                {/* Top Row */}
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "12px"
                                }}>
                                    <h3 style={{
                                        color: "#ffffff",
                                        margin: 0,
                                        fontSize: "16px"
                                    }}>
                                        {audit.contractName}
                                    </h3>
                                    <span style={{
                                        backgroundColor: total === 0 ? "#00cc4420" : "#ff444420",
                                        color: total === 0 ? "#00cc44" : "#ff4444",
                                        padding: "4px 12px",
                                        borderRadius: "20px",
                                        fontSize: "13px"
                                    }}>
                                        {total === 0 ? "✅ Clean" : `⚠️ ${total} Issues`}
                                    </span>
                                </div>

                                {/* Severity Row */}
                                <div style={{
                                    display: "flex",
                                    gap: "16px",
                                    marginBottom: "12px"
                                }}>
                                    {["critical", "high", "medium", "low", "info"].map((s) => (
                                        <span key={s} style={{
                                            fontSize: "12px",
                                            color: "#888888"
                                        }}>
                                            {s.charAt(0).toUpperCase() + s.slice(1)}:
                                            <strong style={{ color: "#ffffff", marginLeft: "4px" }}>
                                                {audit.severity?.[s] || 0}
                                            </strong>
                                        </span>
                                    ))}
                                </div>

                                {/* Bottom Row */}
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: "12px",
                                    color: "#666666"
                                }}>
                                    <span>{formatDate(audit.createdAt)}</span>
                                    <span>
                                        {audit.isStoredOnChain ? (
                                            <span style={{ color: "#6c63ff" }}>
                                                ⛓️ On-Chain: {formatTxHash(audit.blockchainTxHash)}
                                            </span>
                                        ) : (
                                            <span>Not stored on chain</span>
                                        )}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default History