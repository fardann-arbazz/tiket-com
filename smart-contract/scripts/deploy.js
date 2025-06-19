const hre = require("hardhat")

const tokens = (n) => {
    return hre.ethers.parseUnits(n.toString(), 'ether')
}

const main = async () => {
    const [deployer] = await ethers.getSigners()

    const Tickets = await ethers.getContractFactory("Tiket")
    const tikets = await Tickets.deploy(deployer)

    const tx = await tikets.connect(deployer).addTicket("BASIC", tokens(0.005), 200, "ipfs://bafkreiftgzxj3bbo624jtvyqtppcq7vg4twtdpku7vq2e5zk7v4wur55yq");
    await tx.wait()

    console.log(`Deployed Tiket Contract at: ${tikets.target}`);
    console.log(`ticket added successfully`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1
})