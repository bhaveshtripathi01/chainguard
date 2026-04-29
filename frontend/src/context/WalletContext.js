import { createContext, useContext, useState, useEffect } from "react"

const WalletContext = createContext()

export const WalletProvider = ({ children }) => {
    const [walletAddress, setWalletAddress] = useState("")
    const [isConnected, setIsConnected] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")

    // Check if wallet already connected when app loads
    useEffect(() => {
        checkIfWalletConnected()
    }, [])

    const checkIfWalletConnected = async () => {
        try {
            if (!window.ethereum) return

            const accounts = await window.ethereum.request({
                method: "eth_accounts"
            })

            if (accounts.length > 0) {
                setWalletAddress(accounts[0])
                setIsConnected(true)
            }
        } catch (error) {
            console.error("Error checking wallet:", error)
        }
    }

    const connectWallet = async () => {
        try {
            setIsLoading(true)
            setError("")

            // Check if MetaMask is installed
            if (!window.ethereum) {
                setError("MetaMask not found. Please install MetaMask.")
                return
            }

            // Request wallet connection
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts"
            })

            setWalletAddress(accounts[0])
            setIsConnected(true)

        } catch (error) {
            if (error.code === 4001) {
                setError("Connection rejected. Please try again.")
            } else {
                setError("Failed to connect wallet.")
            }
        } finally {
            setIsLoading(false)
        }
    }

    const disconnectWallet = () => {
        setWalletAddress("")
        setIsConnected(false)
    }

    return (
        <WalletContext.Provider value={{
            walletAddress,
            isConnected,
            isLoading,
            error,
            connectWallet,
            disconnectWallet
        }}>
            {children}
        </WalletContext.Provider>
    )
}

export const useWallet = () => useContext(WalletContext)