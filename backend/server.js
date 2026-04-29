const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const dotenv = require("dotenv")
const connectDB = require("./config/database")

// Load environment variables
dotenv.config()

// Connect to MongoDB
connectDB()

// Initialize express app
const app = express()

// Middlewares
app.use(helmet())           // security headers
app.use(cors())             // allow React to call this API
app.use(morgan("dev"))      // log every request
app.use(express.json())     // parse JSON body

// Routes
const auditRoutes = require("./routes/auditRoutes")
app.use("/api/audit", auditRoutes)

// Health check route
app.get("/", (req, res) => {
    res.json({
        message: "✅ ChainGuard API is running",
        version: "1.0.0"
    })
})

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
})