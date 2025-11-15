const hre = require("hardhat");

async function main() {
  console.log("Deploying RISS Contracts...");

  // Deploy RISSReputation
  const RISSReputation = await hre.ethers.getContractFactory("RISSReputation");
  const rissReputation = await RISSReputation.deploy();
  await rissReputation.waitForDeployment();
  const rissReputationAddress = await rissReputation.getAddress();
  console.log("RISSReputation deployed to:", rissReputationAddress);

  // Deploy KRNLIntegration (requires KRNL task contract address)
  // For now, we'll use a placeholder address
  const krnlTaskContractAddress = process.env.KRNL_TASK_CONTRACT || "0x0000000000000000000000000000000000000000";
  
  const KRNLIntegration = await hre.ethers.getContractFactory("KRNLIntegration");
  const krnlIntegration = await KRNLIntegration.deploy(
    rissReputationAddress,
    krnlTaskContractAddress
  );
  await krnlIntegration.waitForDeployment();
  const krnlIntegrationAddress = await krnlIntegration.getAddress();
  console.log("KRNLIntegration deployed to:", krnlIntegrationAddress);

  // Authorize KRNLIntegration in RISSReputation
  const addKrnlTx = await rissReputation.addKrnlContract(krnlIntegrationAddress);
  await addKrnlTx.wait();
  console.log("KRNLIntegration authorized in RISSReputation");

  console.log("\n=== Deployment Summary ===");
  console.log("RISSReputation:", rissReputationAddress);
  console.log("KRNLIntegration:", krnlIntegrationAddress);
  console.log("\nSave these addresses for your frontend/backend integration!");

  // Verify contracts on Etherscan (if on testnet/mainnet)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\nWaiting for block confirmations...");
    await new Promise((resolve) => setTimeout(resolve, 30000));

    try {
      await hre.run("verify:verify", {
        address: rissReputationAddress,
        constructorArguments: [],
      });
      console.log("RISSReputation verified on Etherscan");
    } catch (error) {
      console.log("Error verifying RISSReputation:", error.message);
    }

    try {
      await hre.run("verify:verify", {
        address: krnlIntegrationAddress,
        constructorArguments: [rissReputationAddress, krnlTaskContractAddress],
      });
      console.log("KRNLIntegration verified on Etherscan");
    } catch (error) {
      console.log("Error verifying KRNLIntegration:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

