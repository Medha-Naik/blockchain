const hre = require("hardhat");

async function main() {
  console.log("Deploying RoomLink contract...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  // Deploy RoomLink contract
  const RoomLink = await hre.ethers.getContractFactory("RoomLink");
  const roomLink = await RoomLink.deploy();

  await roomLink.waitForDeployment();

  const address = await roomLink.getAddress();
  console.log("RoomLink deployed to:", address);

  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: address,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber()
  };

  fs.writeFileSync(
    `deployments/${hre.network.name}.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("\nDeployment info saved to deployments/" + hre.network.name + ".json");
  
  // Wait for block confirmations before verification
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\nWaiting for block confirmations...");
    await roomLink.deploymentTransaction().wait(5);
    
    console.log("\nVerifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: address,
        constructorArguments: [],
      });
      console.log("Contract verified successfully");
    } catch (error) {
      console.log("Verification failed:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
