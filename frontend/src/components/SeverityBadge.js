import { getSeverityColor, getSeverityBgColor } from "../utils/helpers"

const SeverityBadge = ({ severity }) => {
    const color = getSeverityColor(severity)
    const bgColor = getSeverityBgColor(severity)

    return (
        <span style={{
            color: color,
            backgroundColor: bgColor,
            padding: "2px 10px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: "bold",
            textTransform: "uppercase",
            border: `1px solid ${color}`
        }}>
            {severity}
        </span>
    )
}

export default SeverityBadge