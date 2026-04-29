import { Link, useLocation } from "react-router-dom"
import { useWallet } from "../context/WalletContext"
import { formatAddress } from "../utils/helpers"

const Navbar = () => {
    const { walletAddress, isConnected, isLoading, connectWallet, disconnectWallet } = useWallet()
    const location = useLocation()

    return (
        <nav style={{
            backgroundColor: "rgba(6, 6, 18, 0.95)",
            borderBottom: "1px solid #1a1a3e",
            padding: "0 48px",
            height: "68px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 100,
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)"
        }}>
            {/* Logo */}
            <Link to="/" style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                        width: "36px",
                        height: "36px",
                        background: "linear-gradient(135deg, #00ff88, #00d4ff)",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                        boxShadow: "0 0 20px #00ff8840"
                    }}>
                        🛡️
                    </div>
                    <div>
                        <span style={{
                            fontFamily: "'Space Mono', monospace",
                            color: "#e8e8f0",
                            fontSize: "18px",
                            fontWeight: "700",
                            letterSpacing: "-0.5px"
                        }}>
                            Chain<span style={{
                                background: "linear-gradient(90deg, #00ff88, #00d4ff)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent"
                            }}>Guard</span>
                        </span>
                        <div style={{
                            fontSize: "10px",
                            color: "#444466",
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                            fontFamily: "'Space Mono', monospace"
                        }}>
                            Security Auditor
                        </div>
                    </div>
                </div>
            </Link>

            {/* Nav Links */}
            <div style={{ display: "flex", gap: "4px" }}>
                {[
                    { path: "/", label: "Audit" },
                    { path: "/history", label: "History" }
                ].map((item) => (
                    <Link key={item.path} to={item.path} style={{
                        textDecoration: "none",
                        padding: "8px 20px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: "500",
                        color: location.pathname === item.path ? "#00ff88" : "#8888aa",
                        backgroundColor: location.pathname === item.path ? "#00ff8810" : "transparent",
                        border: location.pathname === item.path ? "1px solid #00ff8830" : "1px solid transparent",
                        transition: "all 0.2s ease"
                    }}>
                        {item.label}
                    </Link>
                ))}
            </div>

            {/* Wallet */}
            <div>
                {isConnected ? (
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            backgroundColor: "#00ff8810",
                            border: "1px solid #00ff8830",
                            padding: "8px 16px",
                            borderRadius: "10px"
                        }}>
                            <div style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                backgroundColor: "#00ff88",
                                boxShadow: "0 0 8px #00ff88",
                                animation: "pulse 2s infinite"
                            }} />
                            <span style={{
                                fontFamily: "'Space Mono', monospace",
                                color: "#00ff88",
                                fontSize: "13px"
                            }}>
                                {formatAddress(walletAddress)}
                            </span>
                        </div>
                        <button
                            onClick={disconnectWallet}
                            style={{
                                backgroundColor: "transparent",
                                color: "#444466",
                                border: "1px solid #1a1a3e",
                                padding: "8px 14px",
                                borderRadius: "10px",
                                fontSize: "13px"
                            }}
                        >
                            Disconnect
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={connectWallet}
                        disabled={isLoading}
                        style={{
                            background: "linear-gradient(135deg, #00ff88, #00d4ff)",
                            color: "#060612",
                            border: "none",
                            padding: "10px 24px",
                            borderRadius: "10px",
                            fontWeight: "700",
                            fontSize: "14px",
                            letterSpacing: "0.3px",
                            boxShadow: "0 0 20px #00ff8840"
                        }}
                    >
                        {isLoading ? "Connecting..." : "🦊 Connect Wallet"}
                    </button>
                )}
            </div>
        </nav>
    )
}

export default Navbar