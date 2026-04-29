import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { WalletProvider } from "./context/WalletContext"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import History from "./pages/History"

function App() {
    return (
        <WalletProvider>
            <Router>
                <div style={{
                    minHeight: "100vh",
                    backgroundColor: "#0d0d1a",
                    fontFamily: "'Segoe UI', sans-serif"
                }}>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/history" element={<History />} />
                    </Routes>
                </div>
            </Router>
        </WalletProvider>
    )
}

export default App