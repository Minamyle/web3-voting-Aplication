const hre = require("hardhat");

async function main() {
  console.log("Deploying Voting contract...");

  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.deploy();

  await voting.deployed();

  console.log("Voting contract deployed to:", voting.address);

  // Save the contract address to a file
  const fs = require("fs");
  const contractInfo = {
    address: voting.address,
    network: hre.network.name,
    deployer: (await hre.ethers.getSigners())[0].address,
    deployedAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    "contract-address.json",
    JSON.stringify(contractInfo, null, 2)
  );

  console.log("Contract address saved to contract-address.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
