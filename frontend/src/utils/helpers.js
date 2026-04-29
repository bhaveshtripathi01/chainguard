// Format wallet address for display
// 0x1234567890abcdef → 0x1234...cdef
export const formatAddress = (address) => {
    if (!address) return ""
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Format date for display
export const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    })
}

// Get severity color
export const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
        case "critical": return "#ff4444"
        case "high":     return "#ff8800"
        case "medium":   return "#ffcc00"
        case "low":      return "#00cc44"
        case "info":     return "#0088ff"
        default:         return "#888888"
    }
}

// Get severity background color
export const getSeverityBgColor = (severity) => {
    switch (severity?.toLowerCase()) {
        case "critical": return "#ff444420"
        case "high":     return "#ff880020"
        case "medium":   return "#ffcc0020"
        case "low":      return "#00cc4420"
        case "info":     return "#0088ff20"
        default:         return "#88888820"
    }
}

// Calculate total issues
export const getTotalIssues = (severity) => {
    if (!severity) return 0
    return (
        (severity.critical || 0) +
        (severity.high || 0) +
        (severity.medium || 0) +
        (severity.low || 0) +
        (severity.info || 0)
    )
}

// Shorten transaction hash for display
export const formatTxHash = (hash) => {
    if (!hash) return ""
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`
}