require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    localhost: {
      url: process.env.NETWORK_URL, // Local Hardhat network
      accounts: [process.env.NETWORK_ACCOUNT_PRIVATE_KEY],
    },
  },
};
