const { ethers, run, network } = require("hardhat");

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying contract...");
  const simpleStorage = await SimpleStorageFactory.deploy();
  console.log(
    `Deployed contract to address: ${await simpleStorage.getAddress()}`
  );
  if (network.config.chainId === 11155111 && process.env.ETHERSCAN_API_KEY) {
    await simpleStorage.deploymentTransaction().wait(2);
    await verify(await simpleStorage.getAddress(), []);
  }
  const oldValue = await simpleStorage.retrieve();
  console.log(`The old value is ${oldValue}`);

  const tx = await simpleStorage.store(10);
  await tx.wait(1);

  const updatedValue = await simpleStorage.retrieve();
  console.log(`The new value is ${updatedValue}`);
}

async function verify(contractAddress, args) {
  console.log("Verifying contract...");
  try {
    run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("Already verified");
    } else {
      console.log(error);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
