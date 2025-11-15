const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RISSReputation", function () {
  let rissReputation;
  let owner;
  let user1;
  let user2;
  let verifier;

  beforeEach(async function () {
    [owner, user1, user2, verifier] = await ethers.getSigners();

    const RISSReputation = await ethers.getContractFactory("RISSReputation");
    rissReputation = await RISSReputation.deploy();
    await rissReputation.waitForDeployment();

    // Add verifier
    await rissReputation.addVerifier(verifier.address);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await rissReputation.owner()).to.equal(owner.address);
    });

    it("Should have owner as verifier", async function () {
      expect(await rissReputation.verifiers(owner.address)).to.be.true;
    });
  });

  describe("Activity Proofs", function () {
    it("Should allow users to submit activity proofs", async function () {
      await expect(
        rissReputation.connect(user1).submitActivityProof(
          "proof_1",
          "github_commit",
          "Fixed bug",
          "GitHub",
          10
        )
      ).to.emit(rissReputation, "ActivityAdded");
    });

    it("Should reject activity proofs with score impact > 100", async function () {
      await expect(
        rissReputation.connect(user1).submitActivityProof(
          "proof_1",
          "github_commit",
          "Fixed bug",
          "GitHub",
          101
        )
      ).to.be.revertedWith("RISS: Score impact too high");
    });

    it("Should allow verifiers to verify activities", async function () {
      await rissReputation.connect(user1).submitActivityProof(
        "proof_1",
        "github_commit",
        "Fixed bug",
        "GitHub",
        10
      );

      await expect(
        rissReputation.connect(verifier).verifyActivity(user1.address, 0)
      ).to.emit(rissReputation, "ActivityVerified");
    });

    it("Should update reputation after verification", async function () {
      await rissReputation.connect(user1).submitActivityProof(
        "proof_1",
        "github_commit",
        "Fixed bug",
        "GitHub",
        10
      );

      await rissReputation.connect(verifier).verifyActivity(user1.address, 0);

      const score = await rissReputation.getReputationScore(user1.address);
      expect(score.contribution).to.be.gt(0);
    });
  });

  describe("Verification Requests", function () {
    it("Should allow users to submit verification requests", async function () {
      await expect(
        rissReputation.connect(user1).submitVerificationRequest(
          "req_1",
          "identity",
          ["proof_1", "proof_2"]
        )
      ).to.emit(rissReputation, "VerificationRequested");
    });

    it("Should allow verifiers to review requests", async function () {
      await rissReputation.connect(user1).submitVerificationRequest(
        "req_1",
        "identity",
        ["proof_1"]
      );

      await expect(
        rissReputation.connect(verifier).reviewVerificationRequest("req_1", true)
      ).to.emit(rissReputation, "VerificationReviewed");
    });
  });

  describe("KRNL Integration", function () {
    it("Should allow authorized KRNL contracts to record task completions", async function () {
      const krnlContract = await ethers.getSigner(await ethers.Wallet.createRandom().getAddress());
      await rissReputation.addKrnlContract(krnlContract.address);

      // Note: This would need to be called from the KRNL contract
      // For testing, we'd need to mock the contract
    });
  });

  describe("Access Control", function () {
    it("Should only allow owner to add verifiers", async function () {
      await expect(
        rissReputation.connect(user1).addVerifier(user2.address)
      ).to.be.revertedWith("RISS: Not owner");
    });

    it("Should only allow verifiers to verify activities", async function () {
      await rissReputation.connect(user1).submitActivityProof(
        "proof_1",
        "github_commit",
        "Fixed bug",
        "GitHub",
        10
      );

      await expect(
        rissReputation.connect(user2).verifyActivity(user1.address, 0)
      ).to.be.revertedWith("RISS: Not authorized verifier");
    });
  });
});

