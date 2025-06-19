const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), "ether");
};

describe("Tiket", () => {
  let tikets;
  let deployer, user, user2;

  beforeEach(async () => {
    [deployer, user, user2] = await ethers.getSigners();

    const Tiket = await ethers.getContractFactory("Tiket");
    tikets = await Tiket.deploy(deployer);
    await tikets.waitForDeployment();

    await tikets.connect(deployer).addTicket("VIP", tokens(1), 2, "ipfs://vip");
  });

  it("should add tiket type correctly", async () => {
    const ticket = await tikets.ticketTypes(0);

    expect(ticket.name).to.equal("VIP");
    expect(ticket.price).to.equal(tokens(1));
    expect(ticket.total).to.equal(2);
    expect(ticket.sold).to.equal(0);
    expect(ticket.uri).to.equal("ipfs://vip");

    const count = await tikets.ticketTypeCounter();
    expect(count).to.equal(1);
  });

  it("should allow user to buy tiket", async () => {
    await tikets.connect(user).buyTiket(0, { value: tokens(1) });

    const myTikets = await tikets.connect(user).getMyTickets();
    expect(myTikets.length).to.equal(1);

    const nft = await tikets.ticketNft(0);
    expect(nft.owner).to.equal(user.address);
    expect(nft.typeId).to.equal(0);

    const updated = await tikets.ticketTypes(0);
    expect(updated.sold).to.equal(1);
  });

  it("should not allow buy if tickets sold out", async () => {
    await tikets.connect(user).buyTiket(0, { value: tokens(1) });
    await tikets.connect(user2).buyTiket(0, { value: tokens(1) });

    expect(
      tikets.connect(user).buyTiket(0, { value: tokens(1) })
    ).to.be.revertedWith("Tickets sold out");
  });

  it("should fail if payment is not enough", async () => {
    expect(
      tikets.connect(user).buyTiket(0, { value: tokens(0.5) })
    ).to.be.revertedWith("Less money");
  });

  it("should fail if tickets type don't exist", async () => {
    expect(tikets.connect(user).buyTiket(90), {
      value: tokens(1),
    }).to.be.revertedWith("Ticket not found");
  });

  it("should return user owned tikets", async () => {
    await tikets.connect(user).buyTiket(0, { value: tokens(1) });

    const userTickets = await tikets.connect(user).getMyTickets();
    expect(userTickets.length).to.equal(1);
    expect(userTickets[0]).to.equal(0);
  });

  it("should return all tickets", async () => {
    await tikets.addTicket("VIP", tokens(1), 2, "ipfs://vip");

    const results = await tikets.getAllTickets();

    expect(results.length).to.equal(2);

    const ticket = results[0];
    expect(ticket.name).to.equal("VIP");
    expect(ticket.price).to.equal(tokens(1));
    expect(ticket.total).to.equal(2);
    expect(ticket.sold).to.equal(0);
    expect(ticket.uri).to.equal("ipfs://vip");
  });

  it("should allow owner to withdraw", async () => {
    await tikets.connect(user).buyTiket(0, { value: tokens(1) });

    const before = await ethers.provider.getBalance(deployer.address);

    const tx = await tikets.connect(deployer).withdraw();
    const receipt = await tx.wait();

    const gasUsed = receipt.gasUsed;
    const txDetails = await ethers.provider.getTransaction(tx.hash);
    const gasPrice = txDetails.gasPrice;

    const gasCost = gasUsed * gasPrice;

    const after = await ethers.provider.getBalance(deployer.address);
    expect(after).to.equal(before + tokens(1) - gasCost);
  });

  it("should not allow non-owner to withdraw", async () => {
    await expect(tikets.connect(user).withdraw()).to.be.revertedWith(
      "Only Owner"
    );
  });
});
