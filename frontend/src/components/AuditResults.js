import VulnerabilityCard from "./VulnerabilityCard"
import { getTotalIssues } from "../utils/helpers"

const AuditResults = ({ auditData, onStoreOnChain, isStoring }) => {
    if (!auditData) return null

    const { vulnerabilities, severity, contractName, blockchainHash, auditId } = auditData
    const total = getTotalIssues(severity)

    return (
        <div style={{
            marginTop: "32px",
            animation: "fadeInUp 0.5s ease forwards"
        }}>
            {/* Header */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px"
            }}>
                <div>
                    <h2 style={{
                        color: "#e8e8f0",
                        margin: "0 0 4px 0",
                        fontSize: "22px",
                        fontWeight: "700"
                    }}>
                        Audit Results
                    </h2>
                    <p style={{
                        color: "#444466",
                        margin: 0,
                        fontSize: "13px",
                        fontFamily: "'Space Mono', monospace"
                    }}>
                        {contractName}
                    </p>
                </div>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: total === 0 ? "#00ff8810" : "#ff336610",
                    border: `1px solid ${total === 0 ? "#00ff8830" : "#ff336630"}`,
                    padding: "10px 20px",
                    borderRadius: "12px"
                }}>
                    <span style={{ fontSize: "18px" }}>
                        {total === 0 ? "✅" : "⚠️"}
                    </span>
                    <span style={{
                        color: total === 0 ? "#00ff88" : "#ff3366",
                        fontWeight: "700",
                        fontSize: "15px"
                    }}>
                        {total === 0 ? "No Issues Found" : `${total} Issues Found`}
                    </span>
                </div>
            </div>

            {/* Severity Cards */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(5, 1fr)",
                gap: "12px",
                marginBottom: "24px"
            }}>
                {[
                    { label: "Critical", key: "critical", color: "#ff3366", icon: "🔴" },
                    { label: "High",     key: "high",     color: "#ff8c00", icon: "🟠" },
                    { label: "Medium",   key: "medium",   color: "#ffd700", icon: "🟡" },
                    { label: "Low",      key: "low",      color: "#00ff88", icon: "🟢" },
                    { label: "Info",     key: "info",     color: "#00d4ff", icon: "🔵" }
                ].map((item) => (
                    <div key={item.key} style={{
                        backgroundColor: "#0c0c1e",
                        border: `1px solid ${item.color}25`,
                        borderRadius: "12px",
                        padding: "16px 12px",
                        textAlign: "center",
                        position: "relative",
                        overflow: "hidden",
                        transition: "transform 0.2s"
                    }}>
                        <div style={{
                            position: "absolute",
                            top: 0, left: 0, right: 0,
                            height: "2px",
                            backgroundColor: item.color,
                            opacity: severity?.[item.key] > 0 ? 1 : 0.2
                        }} />
                        <div style={{
                            fontSize: "28px",
                            fontWeight: "800",
                            color: severity?.[item.key] > 0 ? item.color : "#1a1a3e",
                            fontFamily: "'Space Mono', monospace",
                            marginBottom: "4px"
                        }}>
                            {severity?.[item.key] || 0}
                        </div>
                        <div style={{
                            fontSize: "11px",
                            color: "#444466",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            fontWeight: "600"
                        }}>
                            {item.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Store on Blockchain */}
            <div style={{
                backgroundColor: "#0c0c1e",
                border: "1px solid #1a1a3e",
                borderRadius: "16px",
                padding: "20px 24px",
                marginBottom: "24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "relative",
                overflow: "hidden"
            }}>
                <div style={{
                    position: "absolute",
                    top: 0, left: 0, right: 0,
                    height: "2px",
                    background: "linear-gradient(90deg, #7c3aed, #00d4ff, transparent)"
                }} />
                <div>
                    <p style={{
                        color: "#e8e8f0",
                        margin: "0 0 6px 0",
                        fontWeight: "700",
                        fontSize: "15px"
                    }}>
                        ⛓️ Store Audit on Blockchain
                    </p>
                    <p style={{
                        color: "#444466",
                        margin: 0,
                        fontSize: "12px",
                        fontFamily: "'Space Mono', monospace"
                    }}>
                        Hash: {blockchainHash?.slice(0, 24)}...
                    </p>
                </div>
                <button
                    onClick={() => onStoreOnChain(auditId, blockchainHash)}
                    disabled={isStoring}
                    style={{
                        background: isStoring
                            ? "#1a1a3e"
                            : "linear-gradient(135deg, #7c3aed, #00d4ff)",
                        color: isStoring ? "#444466" : "#ffffff",
                        border: "none",
                        padding: "12px 28px",
                        borderRadius: "10px",
                        fontWeight: "700",
                        fontSize: "14px",
                        boxShadow: isStoring ? "none" : "0 0 20px #7c3aed40",
                        whiteSpace: "nowrap",
                        fontFamily: "'Outfit', sans-serif"
                    }}
                >
                    {isStoring ? "⟳ Storing..." : "Store on Chain →"}
                </button>
            </div>

            {/* Vulnerabilities */}
            {vulnerabilities.length === 0 ? (
                <div style={{
                    backgroundColor: "#0c0c1e",
                    border: "1px solid #00ff8820",
                    borderRadius: "16px",
                    padding: "48px",
                    textAlign: "center"
                }}>
                    <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
                    <p style={{
                        color: "#00ff88",
                        fontSize: "20px",
                        fontWeight: "700",
                        margin: "0 0 8px 0"
                    }}>
                        No vulnerabilities detected!
                    </p>
                    <p style={{ color: "#444466", margin: 0, fontSize: "14px" }}>
                        This contract passed all Slither security checks.
                    </p>
                </div>
            ) : (
                <div>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginBottom: "16px"
                    }}>
                        <h3 style={{
                            color: "#e8e8f0",
                            margin: 0,
                            fontSize: "16px",
                            fontWeight: "700"
                        }}>
                            Vulnerabilities Found
                        </h3>
                        <div style={{
                            height: "1px",
                            flex: 1,
                            background: "linear-gradient(90deg, #1a1a3e, transparent)"
                        }} />
                        <span style={{
                            backgroundColor: "#ff336610",
                            color: "#ff3366",
                            border: "1px solid #ff336630",
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "700",
                            fontFamily: "'Space Mono', monospace"
                        }}>
                            {vulnerabilities.length} total
                        </span>
                    </div>
                    {vulnerabilities.map((vuln) => (
                        <VulnerabilityCard key={vuln.id} vulnerability={vuln} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default AuditResults