import axios from "axios"

const API_BASE_URL = "http://localhost:5000/api"

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
})

// Submit Solidity code for audit
export const submitAudit = async (contractCode, contractName, walletAddress) => {
    const response = await api.post("/audit", {
        contractCode,
        contractName,
        walletAddress
    })
    return response.data
}

// Get audit history
export const getAuditHistory = async (walletAddress) => {
    const response = await api.get("/audit/history", {
        params: { walletAddress }
    })
    return response.data
}

// Get single audit by ID
export const getAuditById = async (auditId) => {
    const response = await api.get(`/audit/${auditId}`)
    return response.data
}

// Update blockchain info after storing on chain
export const updateBlockchainInfo = async (auditId, txHash, walletAddress) => {
    const response = await api.put(`/audit/${auditId}/blockchain`, {
        txHash,
        walletAddress
    })
    return response.data
}