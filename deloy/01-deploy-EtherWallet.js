const { network } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");
require("dotenv").config();

//sepolia 11155111
module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const { chainId } = network.config.chainId;

  let ethUsdPricefeedAddress;
  if (chainId == 31337) {
    const ethUsdAggregator = await deployments.get("MockV3Aggregator");
    ethUsdPricefeedAddress = ethUsdAggregator.address;
  } else {
    ethUsdPricefeedAddress = networkConfig[chainId]["ethUsdPriceFeed"];
  }
  log("----------------------------------------------");

  log("Deploying EtherWallet and waiting for Confirmations...");

  const etherWallet = await deploy("EtherWallet", {
    from: deployer,
    args: [ethUsdPricefeedAddress],
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });
  log(`EtherWallet is deployed at ${etherWallet.address}`);

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(etherWallet.address, [ethUsdPriceFeedAddress]);
  }
};

module.exports.tags = ["all", "etherWallet"];
