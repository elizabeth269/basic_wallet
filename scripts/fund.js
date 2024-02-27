const { ethers, getNamedAccounts } = require("hardhat");

async function main() {
  const { deployer } = await getNamedAccounts();
  const etherWallet = await ethers.getContract("EtherWallet", deployer);
  console.log(`Got contract FundMe at ${etherWallet.address}`);
  console.log("Funding contract...");
  const transactionResponse = await etherWallet.fund();
  await transactionResponse.wait();
  console.log("i was able to fund");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
