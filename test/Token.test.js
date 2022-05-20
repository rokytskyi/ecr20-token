const Token = artifacts.require("Token");

var chai = require("./setupchai.js");
const BN = web3.utils.BN;
const expect = chai.expect;

require("dotenv").config({path: "../.env"});

contract("Token Test", async (accounts) => {
    const [deployerAccount, recipientAccount, anotherAccount] = accounts;

    beforeEach(async () => {
        this.instance = await Token.new(process.env.INITIAL_TOKENS)
    })

    it("all tokens should be in my account", async () => {
        let totalSupply = await this.instance.totalSupply();
    
        await expect(this.instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply)
    })

    it("is possible to send tokens between accounts", async () => {
        const sendTokens = 1;

        let totalSupply = await this.instance.totalSupply();

        await expect(this.instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
        await expect(this.instance.transfer(recipientAccount, sendTokens)).to.eventually.be.fulfilled;
        await expect(this.instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
        await expect(this.instance.balanceOf(recipientAccount)).to.eventually.be.a.bignumber.equal(new BN(sendTokens));
    })

    it("is not possible to send more tokens than available in total", async () => {
        let balance = await this.instance.balanceOf(deployerAccount);

        await expect(this.instance.transfer(recipientAccount, new BN(balance + 1))).to.eventually.be.rejected;
    })
})