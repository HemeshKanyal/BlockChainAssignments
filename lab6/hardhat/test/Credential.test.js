const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Credential Contract", function () {

    let Credential, credential;
    let admin, issuer, student, other;

    beforeEach(async function () {
        [admin, issuer, student, other] = await ethers.getSigners();

        Credential = await ethers.getContractFactory("Credential");
        credential = await Credential.deploy(admin.address);
        await credential.waitForDeployment();

        // Grant ISSUER_ROLE to issuer account
        await credential.connect(admin).addIssuer(issuer.address);
    });

    // Helper function to create sample credential data
    function getSampleData() {
        return {
            subject: {
                student_name: "John Doe",
                student_id: "ST123",
                date_of_birth: "01-01-2000",
                did: "did:example:123"
            },
            hostel: {
                hostel_name: "A Block",
                room_no: "101"
            },
            fee: {
                course_fee: 1000,
                fee_paid: 800,
                fee_balance: 200,
                hostel_fee: 300
            },
            issuer: {
                institution_name: "ABC University",
                accreditation_body: "UGC",
                issuer_address: issuer.address,
                official_signature: "DigitalSignature"
            },
            achievement: {
                degree_type: "B.Tech",
                major: "Computer Science",
                gpa: "8.5",
                competencies: "Blockchain, AI",
                issue_date: 1700000000,
                expiry_date: 1800000000
            },
            evidence: {
                transcript_link: "ipfs://transcript",
                portfolio_url: "https://portfolio.com",
                hash_of_work: "QmHash"
            }
        };
    }

    // 1. Admin can add credentials (via issuer role)
    it("Admin can add credentials (issuer role)", async function () {
        const data = getSampleData();

        await expect(
            credential.connect(issuer).issueCredential(
                student.address,
                data.subject,
                data.hostel,
                data.fee,
                data.issuer,
                data.achievement,
                data.evidence
            )
        ).to.not.be.reverted;

        const creds = await credential.getCredentials(student.address);
        expect(creds.length).to.equal(1);
        expect(creds[0].subject.student_name).to.equal("John Doe");
    });

    // 2. Non-admin / non-issuer cannot add credentials
    it("Non-admin cannot add credentials", async function () {
        const data = getSampleData();

        await expect(
            credential.connect(other).issueCredential(
                student.address,
                data.subject,
                data.hostel,
                data.fee,
                data.issuer,
                data.achievement,
                data.evidence
            )
        ).to.be.reverted;
    });

    // 3. Student can view credentials
    it("Student can view credentials", async function () {
        const data = getSampleData();

        await credential.connect(issuer).issueCredential(
            student.address,
            data.subject,
            data.hostel,
            data.fee,
            data.issuer,
            data.achievement,
            data.evidence
        );

        const creds = await credential.connect(student).getCredentials(student.address);

        expect(creds.length).to.equal(1);
        expect(creds[0].achievement.major).to.equal("Computer Science");
    });

    // 4. Admin/Issuer can update credential hash
    it("Admin can update credential hash", async function () {
        const data = getSampleData();

        await credential.connect(issuer).issueCredential(
            student.address,
            data.subject,
            data.hostel,
            data.fee,
            data.issuer,
            data.achievement,
            data.evidence
        );

        await credential.connect(issuer).updateCredentialHash(
            student.address,
            0,
            "NewHashValue"
        );

        const creds = await credential.getCredentials(student.address);
        expect(creds[0].evidence.hash_of_work).to.equal("NewHashValue");
    });

    // 5. Event emitted correctly
    it("Should emit CredentialIssued event", async function () {
        const data = getSampleData();

        await expect(
            credential.connect(issuer).issueCredential(
                student.address,
                data.subject,
                data.hostel,
                data.fee,
                data.issuer,
                data.achievement,
                data.evidence
            )
        )
            .to.emit(credential, "CredentialIssued")
            .withArgs(student.address, 0, issuer.address);
    });

});