import Web3 from "web3";
// export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const CONTRACT_ADDRESS = "0xd46197B32F4bB56460a0c478725a43f319c9A785";

export const ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "admin",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "AccessControlBadConfirmation",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "internalType": "bytes32",
                "name": "neededRole",
                "type": "bytes32"
            }
        ],
        "name": "AccessControlUnauthorizedAccount",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "student",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "issuer",
                "type": "address"
            }
        ],
        "name": "CredentialIssued",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "student",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "CredentialUpdated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "previousAdminRole",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "newAdminRole",
                "type": "bytes32"
            }
        ],
        "name": "RoleAdminChanged",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "RoleGranted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "RoleRevoked",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "ADMIN_ROLE",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "DEFAULT_ADMIN_ROLE",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "ISSUER_ROLE",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "issuer",
                "type": "address"
            }
        ],
        "name": "addIssuer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "student",
                "type": "address"
            }
        ],
        "name": "getCredentials",
        "outputs": [
            {
                "components": [
                    {
                        "components": [
                            {
                                "internalType": "string",
                                "name": "student_name",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "student_id",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "date_of_birth",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "did",
                                "type": "string"
                            }
                        ],
                        "internalType": "struct Credential.Subject",
                        "name": "subject",
                        "type": "tuple"
                    },
                    {
                        "components": [
                            {
                                "internalType": "string",
                                "name": "hostel_name",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "room_no",
                                "type": "string"
                            }
                        ],
                        "internalType": "struct Credential.HostelDetails",
                        "name": "hostel",
                        "type": "tuple"
                    },
                    {
                        "components": [
                            {
                                "internalType": "uint256",
                                "name": "course_fee",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "fee_paid",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "fee_balance",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "hostel_fee",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct Credential.FeeDetails",
                        "name": "fee",
                        "type": "tuple"
                    },
                    {
                        "components": [
                            {
                                "internalType": "string",
                                "name": "institution_name",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "accreditation_body",
                                "type": "string"
                            },
                            {
                                "internalType": "address",
                                "name": "issuer_address",
                                "type": "address"
                            },
                            {
                                "internalType": "string",
                                "name": "official_signature",
                                "type": "string"
                            }
                        ],
                        "internalType": "struct Credential.Issuer",
                        "name": "issuer",
                        "type": "tuple"
                    },
                    {
                        "components": [
                            {
                                "internalType": "string",
                                "name": "degree_type",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "major",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "gpa",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "competencies",
                                "type": "string"
                            },
                            {
                                "internalType": "uint256",
                                "name": "issue_date",
                                "type": "uint256"
                            },
                            {
                                "internalType": "uint256",
                                "name": "expiry_date",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct Credential.Achievement",
                        "name": "achievement",
                        "type": "tuple"
                    },
                    {
                        "components": [
                            {
                                "internalType": "string",
                                "name": "transcript_link",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "portfolio_url",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "hash_of_work",
                                "type": "string"
                            }
                        ],
                        "internalType": "struct Credential.Evidence",
                        "name": "evidence",
                        "type": "tuple"
                    },
                    {
                        "internalType": "uint256",
                        "name": "issuedOn",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct Credential.CredentialData[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            }
        ],
        "name": "getRoleAdmin",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "grantRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "hasRole",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "student",
                "type": "address"
            },
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "student_name",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "student_id",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "date_of_birth",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "did",
                        "type": "string"
                    }
                ],
                "internalType": "struct Credential.Subject",
                "name": "subject",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "hostel_name",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "room_no",
                        "type": "string"
                    }
                ],
                "internalType": "struct Credential.HostelDetails",
                "name": "hostel",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "course_fee",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "fee_paid",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "fee_balance",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "hostel_fee",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct Credential.FeeDetails",
                "name": "fee",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "institution_name",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "accreditation_body",
                        "type": "string"
                    },
                    {
                        "internalType": "address",
                        "name": "issuer_address",
                        "type": "address"
                    },
                    {
                        "internalType": "string",
                        "name": "official_signature",
                        "type": "string"
                    }
                ],
                "internalType": "struct Credential.Issuer",
                "name": "issuer",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "degree_type",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "major",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "gpa",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "competencies",
                        "type": "string"
                    },
                    {
                        "internalType": "uint256",
                        "name": "issue_date",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "expiry_date",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct Credential.Achievement",
                "name": "achievement",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "transcript_link",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "portfolio_url",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "hash_of_work",
                        "type": "string"
                    }
                ],
                "internalType": "struct Credential.Evidence",
                "name": "evidence",
                "type": "tuple"
            }
        ],
        "name": "issueCredential",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "issuer",
                "type": "address"
            }
        ],
        "name": "removeIssuer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "callerConfirmation",
                "type": "address"
            }
        ],
        "name": "renounceRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "revokeRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "student",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "newHash",
                "type": "string"
            }
        ],
        "name": "updateCredentialHash",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

export const getContract = async () => {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
    return { web3, contract };
};