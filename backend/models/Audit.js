const mongoose = require("mongoose")

const AuditSchema = new mongoose.Schema({
    auditId: {
        type: String,
        required: true,
        unique: true
    },
    walletAddress: {
        type: String,
        default: "not connected"
    },
    contractName: {
        type: String,
        required: true
    },
    contractCode: {
        type: String,
        required: true
    },
    vulnerabilities: {
        type: Array,
        default: []
    },
    severity: {
        critical: { type: Number, default: 0 },
        high:     { type: Number, default: 0 },
        medium:   { type: Number, default: 0 },
        low:      { type: Number, default: 0 },
        info:     { type: Number, default: 0 }
    },
    blockchainTxHash: {
        type: String,
        default: null
    },
    blockchainHash: {
        type: String,
        default: null
    },
    isStoredOnChain: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true  // adds createdAt and updatedAt automatically
})

module.exports = mongoose.model("Audit", AuditSchema)