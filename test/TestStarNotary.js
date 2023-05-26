const StarNotary = artifacts.require("StarNotary");

let accounts, owner;

contract("StarNotary", accs => {
  accounts = accs;
  owner = accounts[0];
});

it("can create a star", async () => {
  const tokenId = 1;
  const instance = await StarNotary.deployed();
  const starName = "Awesome Star!";
  await instance.createStar(starName, tokenId, { from: owner });
  assert.equal(await instance.tokenIdToStarInfo.call(tokenId), starName);
});

it("lets user1 put up their star for sale", async () => {
  const tokenId = 2;
  const instance = await StarNotary.deployed();
  const user1 = accounts[0];
  const starPrice = web3.utils.toWei("0.01", "ether");
  const starName = "Awesome Star 2!";
  await instance.createStar(starName, tokenId, { from: user1 });
  await instance.putStarUpForSale(tokenId, starPrice, { from: user1 });
  assert.equal(await instance.starsForSale.call(tokenId), starPrice);
});

it("lets user1 get the funds after the sale", async () => {
  const BN = web3.utils.BN;
  const instance = await StarNotary.deployed();
  const user1 = accounts[0];
  const user2 = accounts[1];
  const starId = 3;
  const starPrice = new BN(web3.utils.toWei(".01", "ether"));
  const balance = new BN(web3.utils.toWei(".05", "ether"));
  await instance.createStar("awesome star", starId, { from: user1 });
  await instance.putStarUpForSale(starId, starPrice, { from: user1 });
  await instance.approve(user2, starId, {
    from: user1,
  });
  const balanceOfUser1BeforeTransaction = new BN(
    await web3.eth.getBalance(user1)
  );
  await instance.buyStar(starId, {
    from: user2,
    value: balance,
  });
  const balanceOfUser1AfterTransaction = new BN(
    await web3.eth.getBalance(user1)
  );

  const value1 = balanceOfUser1BeforeTransaction.add(starPrice);
  const value2 = balanceOfUser1AfterTransaction;
  assert.equal(value1.toString(), value2.toString());
});

it("lets user2 buy a star, if it is put up for sale", async () => {
  const instance = await StarNotary.deployed();
  const user1 = accounts[0];
  const user2 = accounts[1];
  const starId = 4;
  const starPrice = web3.utils.toWei(".01", "ether");
  const balance = web3.utils.toWei(".05", "ether");
  await instance.createStar("awesome star", starId, { from: user1 });
  await instance.putStarUpForSale(starId, starPrice, { from: user1 });
  await instance.approve(user2, starId, {
    from: user1,
  });
  await instance.buyStar(starId, { from: user2, value: balance });
  assert.equal(await instance.ownerOf.call(starId), user2);
});

it("lets user2 buy a star and decreases its balance in ether", async () => {
  const instance = await StarNotary.deployed();
  const user1 = accounts[0];
  const user2 = accounts[1];
  const starId = 5;
  const starPrice = web3.utils.toWei(".01", "ether");
  const balance = web3.utils.toWei(".05", "ether");
  await instance.createStar("awesome star", starId, { from: user1 });
  await instance.putStarUpForSale(starId, starPrice, { from: user1 });
  // User2 needs to approve the transfer of its asset, since we're not using its account.
  await instance.approve(user2, starId, {
    from: user1,
  });
  const BN = web3.utils.BN;
  const gasPrice = new BN(web3.utils.toWei("1", "gwei"));
  const balanceOfUser2BeforeTransaction = new BN(
    await web3.eth.getBalance(user2)
  );
  const receipt = await instance.buyStar(starId, {
    from: user2,
    value: balance,
    gasPrice: gasPrice,
  });

  const gasUsed = web3.utils.toBN(receipt.receipt.gasUsed);
  const balanceAfterUser2BuysStar = new BN(await web3.eth.getBalance(user2));

  let value = balanceOfUser2BeforeTransaction
    .sub(balanceAfterUser2BuysStar)
    .sub(gasPrice.mul(gasUsed));
  assert.equal(value, starPrice);
});

// Implement Task 2 Add supporting unit tests

it("can add the star name and star symbol properly", async () => {
  // 1. create a Star with different tokenId
  const _name = "Star High Token";
  const _symbol = "SHT";
  const tokenId = 6;
  const instance = await StarNotary.deployed();
  const starName = "Awesome Star!";
  await instance.createStar(starName, tokenId, { from: owner });

  //2. Call the name and symbol properties in your Smart Contract and compare with the name and symbol provided
  const tokenName = await instance.name();
  const tokenSymbol = await instance.symbol();
  assert.equal(_name, tokenName);
  assert.equal(_symbol, tokenSymbol);
});

it("lets 2 users exchange stars", async () => {
  // 1. create 2 Stars with different tokenId
  const instance = await StarNotary.deployed();
  const user1 = accounts[0];
  const user2 = accounts[1];
  const starId1 = 7;
  const starId2 = 8;
  const starPrice = web3.utils.toWei(".01", "ether");

  await instance.createStar("Star 1", starId1, { from: user1 });
  await instance.putStarUpForSale(starId1, starPrice, { from: user1 });

  await instance.createStar("Star 2", starId2, { from: user2 });
  await instance.putStarUpForSale(starId2, starPrice, { from: user2 });

  // It doesn't make sense to exchange stars when only one party agrees to it.
  // User2 yould need to agree and approve, either before or during the tx.
  await instance.approve(user1, starId2, {
    from: user2,
  });
  // 2. Call the exchangeStars functions implemented in the Smart Contract
  await instance.exchangeStars(starId1, starId2);

  // 3. Verify that the owners changed
  const newOwner1 = await instance.ownerOf(starId1);
  const newOwner2 = await instance.ownerOf(starId2);
  assert.equal(user1, newOwner2);
  assert.equal(user2, newOwner1);
});

it("lets a user transfer a star", async () => {
  // 1. create a Star with different tokenId
  const instance = await StarNotary.deployed();
  const user1 = accounts[0];
  const user2 = accounts[1];
  const starId = 9;
  const starPrice = web3.utils.toWei(".01", "ether");

  await instance.createStar("Transferable Star", starId, { from: user1 });
  await instance.putStarUpForSale(starId, starPrice, { from: user1 });
  // 2. use the transferStar function implemented in the Smart Contract
  await instance.transferStar(user2, starId);
  // 3. Verify the star owner changed.
  const newOwner = await instance.ownerOf(starId);
  assert.equal(user2, newOwner);
});

it("lookUptokenIdToStarInfo test", async () => {
  // 1. create a Star with different tokenId
  const instance = await StarNotary.deployed();
  const user1 = accounts[0];
  const starName = "Unique Star";
  const starId = 10;

  await instance.createStar(starName, starId, { from: user1 });

  // 2. Call your method lookUptokenIdToStarInfo
  const savedName = await instance.lookUptokenIdToStarInfo(starId);

  // 3. Verify if you Star name is the same
  assert.equal(savedName, starName);
});
