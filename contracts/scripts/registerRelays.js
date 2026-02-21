const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Registering relay nodes...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Using account:", deployer.address);

  // Load deployment info
  const deploymentPath = `deployments/${hre.network.name}.json`;
  if (!fs.existsSync(deploymentPath)) {
    console.error("Deployment file not found. Please deploy contract first.");
    process.exit(1);
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
  const contractAddress = deployment.contractAddress;

  console.log("Contract address:", contractAddress);

  // Get contract instance
  const RoomLink = await hre.ethers.getContractFactory("RoomLink");
  const roomLink = RoomLink.attach(contractAddress);

  // Relay node endpoints (update these for production)
  const relayNodes = [
    { endpoint: "ws://localhost:3001", stake: "0.1" },
    { endpoint: "ws://localhost:3002", stake: "0.1" },
    { endpoint: "ws://localhost:3003", stake: "0.1" }
  ];

  console.log(`\nRegistering ${relayNodes.length} relay nodes...\n`);

  for (let i = 0; i < relayNodes.length; i++) {
    const node = relayNodes[i];
    
    try {
      console.log(`[${i + 1}/${relayNodes.length}] Registering: ${node.endpoint}`);
      
      const tx = await roomLink.registerRelayNode(node.endpoint, {
        value: hre.ethers.parseEther(node.stake)
      });

      console.log(`  Transaction hash: ${tx.hash}`);
      console.log(`  Waiting for confirmation...`);
      
      await tx.wait();
      
      console.log(`  ✅ Registered successfully\n`);
    } catch (error) {
      console.error(`  ❌ Failed to register: ${error.message}\n`);
    }
  }

  // Check total relay nodes
  const totalNodes = await roomLink.getActiveRelayNodeCount();
  console.log(`\n✅ Total active relay nodes: ${totalNodes}`);

  // Get relay node details
  console.log("\nRelay Node Details:");
  for (let i = 0; i < relayNodes.length; i++) {
    try {
      const nodeInfo = await roomLink.getRelayNode(deployer.address);
      if (nodeInfo.active) {
        console.log(`\nNode ${i + 1}:`);
        console.log(`  Address: ${nodeInfo.nodeAddress}`);
        console.log(`  Endpoint: ${nodeInfo.endpoint}`);
        console.log(`  Stake: ${hre.ethers.formatEther(nodeInfo.stake)} ETH`);
        console.log(`  Reputation: ${nodeInfo.reputation}`);
      }
    } catch (error) {
      // Node not found or not registered
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
