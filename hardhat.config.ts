import { task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import * as dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000000";
const RPC_URL = process.env.RPC_URL || "http://localhost:8545";

const config = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    localhost: {
      url: "http://localhost:8545",
    },
    testnet: {
      url: RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  namedAccounts: {
    deployer: 0,
  },
};

// Deployment task
task("deploy", "Deploy PrivateCreditScore contract")
  .setAction(async (_, hre) => {
    const { deployments, getNamedSigner } = hre;
    const { deploy } = deployments;

    const deployer = await getNamedSigner("deployer");

    console.log("Deploying PrivateCreditScore with account:", deployer.address);

    const creditScore = await deploy("PrivateCreditScore", {
      from: deployer.address,
      log: true,
    });

    console.log("PrivateCreditScore deployed to:", creditScore.address);
  });

// Verify task
task("verify-contract", "Verify contract on block explorer")
  .addParam("address", "Contract address")
  .setAction(async (args, hre) => {
    console.log("Verifying contract at:", args.address);
    // Verification logic would go here
  });

export default config;
