import { useState } from "react"

const SAMPLE_CONTRACT = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract VulnerableContract {
    mapping(address => uint256) public balances;
    
    function deposit() public payable {
        balances[msg.sender] += msg.value;
    }
    
    // Vulnerable to reentrancy attack!
    function withdraw() public {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance");
        
        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Transfer failed");
        
        balances[msg.sender] = 0;
    }
}`

const CodeEditor = ({ onSubmit, isLoading }) => {
    const [contractCode, setContractCode] = useState("")
    const [contractName, setContractName] = useState("")

    const handleSubmit = () => {
        if (!contractCode.trim()) {
            alert("Please paste your Solidity code first!")
            return
        }
        if (!contractName.trim()) {
            alert("Please enter a contract name!")
            return
        }
        onSubmit(contractCode, contractName)
    }

    const loadSample = () => {
        setContractCode(SAMPLE_CONTRACT)
        setContractName("VulnerableContract")
    }

    return (
        <div style={{
            backgroundColor: "#0c0c1e",
            border: "1px solid #1a1a3e",
            borderRadius: "16px",
            padding: "28px",
            boxShadow: "0 0 40px rgba(0,0,0,0.4)",
            position: "relative",
            overflow: "hidden"
        }}>
            {/* Top accent line */}
            <div style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                height: "2px",
                background: "linear-gradient(90deg, #00ff88, #00d4ff, transparent)"
            }} />

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
                        fontSize: "18px",
                        fontWeight: "700"
                    }}>
                        Paste Your Contract
                    </h2>
                    <p style={{
                        color: "#444466",
                        margin: 0,
                        fontSize: "13px",
                        fontFamily: "'Space Mono', monospace"
                    }}>
                        .sol file → vulnerability scan → blockchain proof
                    </p>
                </div>
                <button
                    onClick={loadSample}
                    style={{
                        backgroundColor: "transparent",
                        color: "#00ff88",
                        border: "1px solid #00ff8830",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        fontWeight: "600",
                        backgroundColor: "#00ff8808"
                    }}
                >
                    Load Sample ↗
                </button>
            </div>

            {/* Contract Name Input */}
            <div style={{ marginBottom: "12px" }}>
                <label style={{
                    display: "block",
                    color: "#8888aa",
                    fontSize: "12px",
                    fontFamily: "'Space Mono', monospace",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    marginBottom: "8px"
                }}>
                    Contract Name
                </label>
                <input
                    type="text"
                    placeholder="e.g. MyToken, VaultContract"
                    value={contractName}
                    onChange={(e) => setContractName(e.target.value)}
                    style={{
                        width: "100%",
                        backgroundColor: "#060612",
                        border: "1px solid #1a1a3e",
                        borderRadius: "10px",
                        padding: "12px 16px",
                        color: "#e8e8f0",
                        fontSize: "14px",
                        boxSizing: "border-box",
                        outline: "none",
                        fontFamily: "'Space Mono', monospace",
                        transition: "border-color 0.2s"
                    }}
                    onFocus={(e) => e.target.style.borderColor = "#00ff8850"}
                    onBlur={(e) => e.target.style.borderColor = "#1a1a3e"}
                />
            </div>

            {/* Code Label */}
            <label style={{
                display: "block",
                color: "#8888aa",
                fontSize: "12px",
                fontFamily: "'Space Mono', monospace",
                letterSpacing: "1px",
                textTransform: "uppercase",
                marginBottom: "8px"
            }}>
                Solidity Code
            </label>

            {/* Code Editor Area */}
            <div style={{
                position: "relative",
                backgroundColor: "#060612",
                border: "1px solid #1a1a3e",
                borderRadius: "10px",
                overflow: "hidden"
            }}>
                {/* Editor Header Bar */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "10px 14px",
                    borderBottom: "1px solid #1a1a3e",
                    backgroundColor: "#0a0a18"
                }}>
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ff3366" }} />
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#ffd700" }} />
                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#00ff88" }} />
                    <span style={{
                        color: "#444466",
                        fontSize: "11px",
                        fontFamily: "'Space Mono', monospace",
                        marginLeft: "8px"
                    }}>
                        contract.sol
                    </span>
                </div>

                <textarea
                    value={contractCode}
                    onChange={(e) => setContractCode(e.target.value)}
                    placeholder={"// Paste your Solidity code here...\n// pragma solidity ^0.8.0;\n\ncontract MyContract {\n    // ...\n}"}
                    style={{
                        width: "100%",
                        height: "300px",
                        backgroundColor: "transparent",
                        border: "none",
                        padding: "16px",
                        color: "#00ff88",
                        fontSize: "13px",
                        fontFamily: "'Space Mono', monospace",
                        resize: "vertical",
                        boxSizing: "border-box",
                        outline: "none",
                        lineHeight: "1.7"
                    }}
                />
            </div>

            {/* Stats Row */}
            {contractCode && (
                <div style={{
                    display: "flex",
                    gap: "20px",
                    marginTop: "12px",
                    padding: "10px 0"
                }}>
                    {[
                        { label: "Lines", value: contractCode.split("\n").length },
                        { label: "Characters", value: contractCode.length },
                        { label: "Status", value: "Ready to scan" }
                    ].map((stat) => (
                        <span key={stat.label} style={{
                            fontSize: "12px",
                            color: "#444466",
                            fontFamily: "'Space Mono', monospace"
                        }}>
                            {stat.label}:{" "}
                            <span style={{ color: "#00ff88" }}>{stat.value}</span>
                        </span>
                    ))}
                </div>
            )}

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                disabled={isLoading}
                style={{
                    width: "100%",
                    background: isLoading
                        ? "#1a1a3e"
                        : "linear-gradient(135deg, #00ff88, #00d4ff)",
                    color: isLoading ? "#444466" : "#060612",
                    border: "none",
                    padding: "16px",
                    borderRadius: "12px",
                    fontWeight: "800",
                    fontSize: "16px",
                    marginTop: "16px",
                    letterSpacing: "0.5px",
                    boxShadow: isLoading ? "none" : "0 0 30px #00ff8840",
                    fontFamily: "'Outfit', sans-serif"
                }}
            >
                {isLoading ? "⟳ Analyzing Contract..." : "⚡ Analyze Contract"}
            </button>
        </div>
    )
}

export default CodeEditor