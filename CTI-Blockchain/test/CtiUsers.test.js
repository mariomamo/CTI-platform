const CtiUsers = artifacts.require("CtiUsers.sol");
const CtiToken = artifacts.require("CtiToken.sol");
const CtiOracle = artifacts.require("CtiOracle.sol");
const BN = require('bn.js');

const {assert} = require('chai');

contract("CtiUsers", (accounts) => {

  let ctiUsers;
  let ctiToken;
  let ctiOracle;
  const regularSubscriptionCost = new BN("50");
  const plusSubscriptionCost = new BN("100");
  const conversionNumber = new BN("1000000000000000000")
  const oneDay = 60 * 60 * 24;
  const oneYear = 365 * oneDay;

  beforeEach(async () => {
    ctiUsers = await CtiUsers.deployed();
    ctiToken = await CtiToken.deployed();
    ctiOracle = await CtiOracle.deployed();
    ctiOracle.setOneDollarInCti(conversionNumber)
  })

  it("register regular user with CTI tokens should not throw exception",
      async () => {
        // GIVEN
        const address = accounts[0];
        const from = {from: address};
        let isTestSucceeded = true;
        await mintAndApproveCtiTokens(address, ctiUsers.address,
            regularSubscriptionCost.mul(conversionNumber));

        // WHEN
        await ctiUsers.register(accounts[0], 0, from)
            .catch(() => isTestSucceeded = false);

        // THEN
        assert(isTestSucceeded, "Register regular user with CTI tokens failed");
      })

  it("register user and update its stats",
      async () => {
        // GIVEN
        const address = accounts[0];
        const from = {from: address};
        let subscriptionDurationInDays = 365;
        const ctiUsers = await CtiUsers.new(ctiOracle.address, ctiToken.address,
            accounts[0],
            regularSubscriptionCost,
            subscriptionDurationInDays, plusSubscriptionCost,
            subscriptionDurationInDays);

        await mintAndApproveCtiTokens(address, ctiUsers.address,
            regularSubscriptionCost.mul(conversionNumber));
        await ctiUsers.addAllowedContract(accounts[0], from);
        await ctiUsers.register(accounts[0], 0, from);

        // WHEN
        await ctiUsers.updateUserStats(accounts[0], 0);

        // THEN
        const userInfo = await ctiUsers.getUserInfo(accounts[0], from);

        assert.equal(userInfo.publishedCti, 1);
        assert.equal(userInfo.validCti, 1);
      })

  it("register plus user with CTI tokens should not throw exception",
      async () => {
        // GIVEN
        const address = accounts[0];
        const from = {from: address};
        let isTestSucceeded = true;
        await mintAndApproveCtiTokens(address, ctiUsers.address,
            plusSubscriptionCost.mul(conversionNumber));

        // WHEN
        await ctiUsers.register(accounts[0], 1, from)
            .catch(() => isTestSucceeded = false);

        // THEN
        assert(isTestSucceeded, "Register plus user with CTI tokens failed");
      })

  it("register user from regular to plus with CTI tokens should not throw exception",
      async () => {
        // GIVEN
        const address = accounts[0];
        const from = {from: address};
        let isTestSucceeded = true;
        const startSubscription = Math.floor(new Date().getTime() / 1000);
        const expectedEndSubscription = (startSubscription + oneYear);
        await mintAndApproveCtiTokens(address, ctiUsers.address,
            plusSubscriptionCost.add(regularSubscriptionCost).mul(
                conversionNumber));
        await ctiUsers.register(accounts[0], 0, from)
            .catch(() => isTestSucceeded = false);

        // WHEN
        await ctiUsers.register(accounts[0], 1, from)
        .catch(() => isTestSucceeded = false);

        // THEN
        const userInfo = await ctiUsers.getUserInfo(accounts[0], from);
        const errorTolleranceInMillisec = 100;
        let endSubscriptionError = userInfo.endSubscription
            - expectedEndSubscription;
        assert(isTestSucceeded, "Register plus user with CTI tokens failed");
        assert.equal(userInfo.tier, 1)
        assert.equal(userInfo.isRegistered, true);
        assert(endSubscriptionError <= errorTolleranceInMillisec,
            "Invalid expected end subscription");
  })

  it("register user without CTI tokens should throw exception and not register the user",
      async () => {
        // GIVEN
        const address = accounts[1];
        const from = {from: address};
        let isTestSucceeded = false;

        // WHEN
        await ctiUsers.register(accounts[1], 1, from).catch(
            () => isTestSucceeded = true);

        // THEN
        assert(isTestSucceeded,
            "ctiUsers.register without CTI tokens should throw exception");
        await ctiUsers.getUserInfo(accounts[1])
            .then(() => isTestSucceeded = false)
            .catch(() => isTestSucceeded = true);
        assert(isTestSucceeded,
            "ctiUsers.getUserInfo should throw an exception");
      })

  it("register already existing user should extend subscription", async () => {
    // GIVEN
    const address = accounts[2];
    const from = {from: address};
    const startSubscription = Math.floor(new Date().getTime() / 1000);
    const expectedEndSubscription = (startSubscription + (2 * oneYear));
    await mintAndApproveCtiTokens(address, ctiUsers.address,
        regularSubscriptionCost.mul(new BN("2").mul(conversionNumber)));
    // First registration
    await ctiUsers.register(accounts[2], 0, from);

    // WHEN
    // Second registration
    await ctiUsers.register(accounts[2], 0, from);
    const userInfo = await ctiUsers.getUserInfo(accounts[2], from);

    // THEN
    const errorTolleranceInMillisec = 100;
    let endSubscriptionError = userInfo.endSubscription
        - expectedEndSubscription;
    assert(endSubscriptionError <= errorTolleranceInMillisec,
        "Invalid expected end subscription");
    assert.equal(userInfo.isRegistered, true);
  })

  it("call isSubscriptionActive of a subscripted user should return true",
      async () => {
        // GIVEN
        const address = accounts[3];
        const from = {from: address};
        await mintAndApproveCtiTokens(address, ctiUsers.address,
            regularSubscriptionCost.mul(conversionNumber));
        await ctiUsers.register(accounts[3], 0, from);

        // WHEN
        const isUserSubscripted = await ctiUsers.isSubscriptionActive(
            accounts[3]);

        // THEN
        assert(isUserSubscripted,
            "This user subscription is active. True must be returned.")
      })

  it("call isSubscriptionActive of a subscripted but expired user should return false",
      async () => {
        // GIVEN
        let subscriptionDurationInDays = 0;
        const ctiUsers = await CtiUsers.new(ctiOracle.address, ctiToken.address,
            accounts[0],
            regularSubscriptionCost,
            subscriptionDurationInDays, plusSubscriptionCost,
            subscriptionDurationInDays);
        const address = accounts[4];
        const from = {from: address};
        await mintAndApproveCtiTokens(address, ctiUsers.address,
            regularSubscriptionCost.mul(conversionNumber));
        await ctiUsers.register(accounts[4], 0, from);
        // WHEN
        const isUserSubscripted = await ctiUsers.isSubscriptionActive(
            accounts[4]);

        // THEN
        assert(!isUserSubscripted,
            "This user subscription is expired. False must be returned.")
      })

  it("call isSubscriptionActive of a non existing user should return false",
      async () => {
        const address = accounts[5];
        const from = {from: address};
        const isUserSubscripted = await ctiUsers.methods['isSubscriptionActive()'](
            from);
        assert(!isUserSubscripted,
            "This user is not registered. False must be returned.")
      })

  it("get info of a registered user should not throw exception", async () => {
    // GIVEN
    const address = accounts[7];
    const from = {from: address};
    const startSubscription = Math.floor(new Date().getTime() / 1000);
    const expectedEndSubscription = (startSubscription + oneYear);
    await mintAndApproveCtiTokens(address, ctiUsers.address,
        regularSubscriptionCost.mul(conversionNumber));
    await ctiUsers.register(accounts[7], 0, from);

    // WHEN
    const userInfo = await ctiUsers.getUserInfo(accounts[7], from);

    // THEN
    const errorTolleranceInMillisec = 100;
    let endSubscriptionError = userInfo.endSubscription
        - expectedEndSubscription;
    assert(endSubscriptionError <= errorTolleranceInMillisec,
        "Invalid expected end subscription");
    assert.equal(userInfo.isRegistered, true);
  })

  it("get info of a specific registered user should not throw exception",
      async () => {
        // GIVEN
        const registeredAddress = accounts[9];
        const fromRegisteredAddress = {from: registeredAddress};
        const fromRequesterAddress = {from: accounts[6]};
        const startSubscription = Math.floor(new Date().getTime() / 1000);
        const expectedEndSubscription = (startSubscription + oneYear);
        await mintAndApproveCtiTokens(registeredAddress, ctiUsers.address,
            regularSubscriptionCost.mul(conversionNumber));
        await ctiUsers.register(accounts[9], 0, fromRegisteredAddress);

        // WHEN
        const userInfo = await ctiUsers.getUserInfo(registeredAddress,
            fromRequesterAddress);
        // THEN
        const errorTolleranceInMillisec = 100;
        let endSubscriptionError = userInfo.endSubscription
            - expectedEndSubscription;
        assert(endSubscriptionError <= errorTolleranceInMillisec,
            "Invalid expected end subscription");
        assert.equal(userInfo.isRegistered, true);
      })

  it("get info of a non registered user should throw exception", async () => {
    // GIVEN
    const address = accounts[8];
    let isTestSucceeded = false;

    // WHEN
    await ctiUsers.getUserInfo(accounts[8])
        .catch(() => isTestSucceeded = true);

    // THEN
    assert(isTestSucceeded, "ctiUsers.getUserInfo should throw an exception");
  })

  const mintAndApproveCtiTokens = async (mintTo, approveTo, amount) => {
    let mintTokenResult = await ctiToken.mintCtiToken(mintTo, amount);
    assert(mintTokenResult, "Failed to mint tokens");
    let approveResult = await ctiToken.approve(approveTo, amount,
        {from: mintTo});
    assert(approveResult, "Failed to approve tokens");
  }
});