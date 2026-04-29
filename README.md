## What is ChainGuard?

ChainGuard is a full-stack decentralized application that helps developers secure their Solidity smart contracts before deployment.

-  **Instant Security Scan** — Paste any Solidity contract and get a full vulnerability report in seconds using Slither — the same tool used by professional audit firms like Trail of Bits
-  **Severity Classification** — Every vulnerability is classified as Critical, High, Medium, Low or Info with detailed descriptions
-  **Blockchain Proof** — Every audit report is hashed and stored permanently on Ethereum Sepolia — tamper-proof and verifiable by anyone
-  **MetaMask Integration** — Connect your wallet and store audit proofs on-chain with one click
-  **100% Free** — No paid APIs, no rate limits. Slither is open source, hosting is free tier

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Ethers.js, MetaMask |
| Backend | Node.js, Express.js, MongoDB |
| Security | Slither (open source auditor) |
| Blockchain | Solidity, Hardhat, Ethereum Sepolia |

---

## Smart Contract
🔍 [View on Etherscan](https://sepolia.etherscan.io/address/0x2cf97c73d3373D017e2b810a2053ac1801246Dfc)

---

## Screenshots

### Home Page
<img width="935" height="493" alt="image" src="https://github.com/user-attachments/assets/7dcda7d5-e228-45d0-ad7f-8eb352c99350" />


### Vulnerability Report
![Results](./assets/results.png)

### Audit History
![History](./assets/history.png)

---

## Run Locally

```bash
# Install Slither
pip install slither-analyzer

# Backend
cd backend && npm install
# Add MONGO_URI to .env
node server.js

# Frontend
cd frontend && npm install
npm start
```


