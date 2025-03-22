async function main() {
  const Elections = await hre.ethers.deployContract("Elections");
  const elections = await Elections.waitForDeployment();
  console.log("Elections Contract deployed!");

  console.log(`Elections deployed to: ${elections.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
