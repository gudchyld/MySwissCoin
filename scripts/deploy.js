const hre = require("hardhat");

async function main() {
  const contract = await hre.ethers.deployContract("MySwissCoin");

  await contract.waitForDeployment();

  console.log(`MySwissCoin contract deployed to ${contract.target}`);
}

//DEFAULT BY HARDHAT:
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
