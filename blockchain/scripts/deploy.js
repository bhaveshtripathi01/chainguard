const { ethers } = require("hardhat")

async function main() {
    console.log("Deploying AuditStorage contract...")

    // Get the contract factory
    // Think of this like importing your contract as a class
    const AuditStorage = await ethers.getContractFactory("AuditStorage")

    // Deploy the contract
    // This sends a transaction to blockchain
    const auditStorage = await AuditStorage.deploy()

    // Wait for deployment to finish
    await auditStorage.waitForDeployment()

    // Get the address where contract is deployed
    const address = await auditStorage.getAddress()

    console.log("✅ AuditStorage deployed to:", address)
    console.log("📝 Save this address — you will need it later!")
}

main().catch((error) => {
    console.error(error)
    process.exit(1)
})