// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract Credential is AccessControl {

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ADMIN_ROLE, admin);
    }

    struct Subject {
        string student_name;
        string student_id;
        string date_of_birth;
        string did;
    }

    struct HostelDetails {
        string hostel_name;
        string room_no;
    }

    struct FeeDetails {
        uint256 course_fee;
        uint256 fee_paid;
        uint256 fee_balance;
        uint256 hostel_fee;
    }

    struct Issuer {
        string institution_name;
        string accreditation_body;
        address issuer_address;
        string official_signature;
    }

    struct Achievement {
        string degree_type;
        string major;
        string gpa;
        string competencies;
        uint256 issue_date;
        uint256 expiry_date;
    }

    struct Evidence {
        string transcript_link;
        string portfolio_url;
        string hash_of_work;
    }

    struct CredentialData {
        Subject subject;
        HostelDetails hostel;
        FeeDetails fee;
        Issuer issuer;
        Achievement achievement;
        Evidence evidence;
        uint256 issuedOn;
    }

    mapping(address => CredentialData[]) private credentials;

    event CredentialIssued(
        address indexed student,
        uint256 indexed index,
        address indexed issuer
    );

    event CredentialUpdated(
        address indexed student,
        uint256 indexed index
    );

    function issueCredential(
        address student,
        Subject memory subject,
        HostelDetails memory hostel,
        FeeDetails memory fee,
        Issuer memory issuer,
        Achievement memory achievement,
        Evidence memory evidence
    ) external onlyRole(ISSUER_ROLE) {

        CredentialData memory newCredential = CredentialData({
            subject: subject,
            hostel: hostel,
            fee: fee,
            issuer: issuer,
            achievement: achievement,
            evidence: evidence,
            issuedOn: block.timestamp
        });

        credentials[student].push(newCredential);

        emit CredentialIssued(
            student,
            credentials[student].length - 1,
            msg.sender
        );
    }

    function getCredentials(address student)
        external
        view
        returns (CredentialData[] memory)
    {
        return credentials[student];
    }

    function updateCredentialHash(
        address student,
        uint256 index,
        string memory newHash
    ) external onlyRole(ISSUER_ROLE) {

        require(index < credentials[student].length, "Invalid index");

        credentials[student][index].evidence.hash_of_work = newHash;

        emit CredentialUpdated(student, index);
    }

    function addIssuer(address issuer) external onlyRole(ADMIN_ROLE) {
        grantRole(ISSUER_ROLE, issuer);
    }

    function removeIssuer(address issuer) external onlyRole(ADMIN_ROLE) {
        revokeRole(ISSUER_ROLE, issuer);
    }
}