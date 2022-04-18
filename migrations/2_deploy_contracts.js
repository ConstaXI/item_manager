var ItemManager = artifacts.require("./ItemManager.sol");

export default function(deployer) {
  deployer.deploy(ItemManager);
};
