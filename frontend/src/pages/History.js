import { useState, useEffect, useCallback } from "react"
import { useWallet } from "../context/WalletContext"
import { getAuditHistory } from "../utils/api"
import { formatDate, getTotalIssues, formatTxHash } from "../utils/helpers"

const History = () => {
    const { walletAddress } = useWallet()
    const [audits, setAudits] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchHistory = useCallback(async () => {
        try {
            setIsLoading(true)
            const result = await getAuditHistory(walletAddress)
            setAudits(result.data)
        } catch (err) {
            console.error("Failed to fetch history:", err)
        } finally {
            setIsLoading(false)
        }
    }, [walletAddress])

    useEffect(() => {
        fetchHistory()
    }, [fetchHistory])

    return (
        <div style={{
            maxWidth: "900px",
            margin: "0 auto",
            padding: "40px 20px"
        }}>
            <h1 style={{
                color: "#e8e8f0",
                marginBottom: "8px"
            }}>
                📋 Audit History
            </h1>
            <p style={{
                color: "#8888aa",
                marginBottom: "32px",
                fontFamily: "'Space Mono', monospace",
                fontSize: "13px"
            }}>
                All past smart contract audits
            </p>

            {isLoading ? (
                <div style={{ textAlign: "center", color: "#8888aa", padding: "60px" }}>
                    Loading audits...
                </div>
            ) : audits.length === 0 ? (
                <div style={{
                    backgroundColor: "#0c0c1e",
                    border: "1px solid #1a1a3e",
                    borderRadius: "10px",
                    padding: "60px",
                    textAlign: "center"
                }}>
                    <p style={{ color: "#8888aa", fontSize: "16px" }}>
                        No audits yet. Go audit a contract!
                    </p>
                </div>
            ) : (
                <div>
                    {audits.map((audit) => {
                        const total = getTotalIssues(audit.severity)
                        return (
                            <div key={audit.auditId} style={{
                                backgroundColor: "#0c0c1e",
                                border: "1px solid #1a1a3e",
                                borderRadius: "12px",
                                padding: "20px",
                                marginBottom: "12px",
                                position: "relative",
                                overflow: "hidden"
                            }}>
                                <div style={{
                                    position: "absolute",
                                    left: 0, top: 0, bottom: 0,
                                    width: "3px",
                                    backgroundColor: total === 0 ? "#00ff88" : "#ff3366"
                                }} />

                                {/* Top Row */}
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "12px",
                                    paddingLeft: "8px"
                                }}>
                                    <h3 style={{
                                        color: "#e8e8f0",
                                        margin: 0,
                                        fontSize: "15px",
                                        fontWeight: "700",
                                        fontFamily: "'Space Mono', monospace"
                                    }}>
                                        {audit.contractName}
                                    </h3>
                                    <span style={{
                                        backgroundColor: total === 0 ? "#00ff8810" : "#ff336610",
                                        color: total === 0 ? "#00ff88" : "#ff3366",
                                        border: `1px solid ${total === 0 ? "#00ff8830" : "#ff336630"}`,
                                        padding: "4px 12px",
                                        borderRadius: "20px",
                                        fontSize: "12px",
                                        fontWeight: "700"
                                    }}>
                                        {total === 0 ? "✅ Clean" : `⚠️ ${total} Issues`}
                                    </span>
                                </div>

                                {/* Severity Row */}
                                <div style={{
                                    display: "flex",
                                    gap: "16px",
                                    marginBottom: "12px",
                                    paddingLeft: "8px"
                                }}>
                                    {["critical", "high", "medium", "low", "info"].map((s) => (
                                        <span key={s} style={{
                                            fontSize: "12px",
                                            color: "#444466",
                                            fontFamily: "'Space Mono', monospace"
                                        }}>
                                            {s.charAt(0).toUpperCase() + s.slice(1)}:
                                            <strong style={{
                                                color: "#8888aa",
                                                marginLeft: "4px"
                                            }}>
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
                                    color: "#444466",
                                    paddingLeft: "8px",
                                    fontFamily: "'Space Mono', monospace"
                                }}>
                                    <span>{formatDate(audit.createdAt)}</span>
                                    <span>
                                        {audit.isStoredOnChain ? (
                                            <span style={{ color: "#7c3aed" }}>
                                                ⛓️ {formatTxHash(audit.blockchainTxHash)}
                                            </span>
                                        ) : (
                                            <span>Not on chain</span>
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