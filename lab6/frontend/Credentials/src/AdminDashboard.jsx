import { useState, useEffect } from "react";
import { getContract } from "./contract";

export default function AdminDashboard({ wallet }) {

    const [student, setStudent] = useState("");
    const [studentName, setStudentName] = useState("");
    const [degree, setDegree] = useState("");
    const [major, setMajor] = useState("");
    const [gpa, setGpa] = useState("");
    const [hash, setHash] = useState("");
    const [credentialIndex, setCredentialIndex] = useState("0");
    const [issuerAddress, setIssuerAddress] = useState("");
    const [events, setEvents] = useState([]);

    const issueCredential = async () => {

        const { contract } = await getContract();

        const subject = {
            student_name: studentName,
            student_id: "ST1",
            date_of_birth: "2000",
            did: "did:test"
        };

        const hostel = {
            hostel_name: "Block A",
            room_no: "101"
        };

        const fee = {
            course_fee: 1000,
            fee_paid: 800,
            fee_balance: 200,
            hostel_fee: 300
        };

        const issuer = {
            institution_name: "ABC University",
            accreditation_body: "UGC",
            issuer_address: wallet,
            official_signature: "DigitalSign"
        };

        const achievement = {
            degree_type: degree,
            major: major,
            gpa: gpa,
            competencies: "Blockchain",
            issue_date: 1,
            expiry_date: 2
        };

        const evidence = {
            transcript_link: "ipfs://transcript",
            portfolio_url: "url",
            hash_of_work: hash
        };

        try {
            await contract.methods.issueCredential(
                student,
                subject,
                hostel,
                fee,
                issuer,
                achievement,
                evidence
            ).send({ from: wallet });
            alert("Credential Issued Successfully!");
        } catch (error) {
            console.error(error);
            alert("Error issuing credential: " + error.message);
        }
    };

    const updateHash = async () => {
        try {
            const { contract } = await getContract();

            await contract.methods
                .updateCredentialHash(student, credentialIndex, hash)
                .send({ from: wallet });
            alert("Hash Updated Successfully!");
        } catch (error) {
            console.error(error);
            alert("Error updating hash: " + error.message);
        }
    };

    const handleAddIssuer = async () => {
        try {
            const { contract } = await getContract();
            await contract.methods
                .addIssuer(issuerAddress)
                .send({ from: wallet });
            alert("Issuer Added Successfully!");
        } catch (error) {
            console.error(error);
            alert("Error adding issuer: " + error.message);
        }
    };

    const handleRemoveIssuer = async () => {
        try {
            const { contract } = await getContract();
            await contract.methods
                .removeIssuer(issuerAddress)
                .send({ from: wallet });
            alert("Issuer Removed Successfully!");
        } catch (error) {
            console.error(error);
            alert("Error removing issuer: " + error.message);
        }
    };

    // Event Listener
    useEffect(() => {

        const loadEvents = async () => {

            const { contract } = await getContract();

            contract.events.CredentialIssued()
                .on("data", e => {
                    setEvents(prev => [...prev, e.returnValues]);
                });

            contract.events.CredentialUpdated()
                .on("data", e => {
                    setEvents(prev => [...prev, e.returnValues]);
                });
        };

        loadEvents();

    }, []);

    return (
        <div className="card">
            <h2>Admin / Issuer Dashboard</h2>

            <h3>Issuer Management</h3>
            <div className="form-group">
                <input
                    placeholder="Issuer Address"
                    value={issuerAddress}
                    onChange={(e) => setIssuerAddress(e.target.value)}
                />
            </div>
            <button onClick={handleAddIssuer}>Add Issuer</button>
            <button onClick={handleRemoveIssuer}>Remove Issuer</button>

            <hr style={{ margin: "24px 0", borderColor: "#444" }} />

            <h3>Issue / Update Credential</h3>
            <div className="form-group">
                <input
                    placeholder="Student Address"
                    value={student}
                    onChange={(e) => setStudent(e.target.value)}
                />
            </div>
            <div className="form-group">
                <input
                    placeholder="Student Name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                />
            </div>
            <div className="form-group">
                <input
                    placeholder="Degree"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                />
            </div>
            <div className="form-group">
                <input
                    placeholder="Major"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                />
            </div>
            <div className="form-group">
                <input
                    placeholder="GPA"
                    value={gpa}
                    onChange={(e) => setGpa(e.target.value)}
                />
            </div>
            <div className="form-group">
                <input
                    placeholder="Credential Index (for update)"
                    type="number"
                    value={credentialIndex}
                    onChange={(e) => setCredentialIndex(e.target.value)}
                />
            </div>
            <div className="form-group">
                <input
                    placeholder="Document Hash"
                    value={hash}
                    onChange={(e) => setHash(e.target.value)}
                />
            </div>

            <button onClick={issueCredential}>
                Add Credential
            </button>

            <button onClick={updateHash}>
                Update Hash
            </button>

            <h3>Events</h3>

            {events.map((e, i) => (
                <div key={i}>
                    Student: {e.student} | Index: {e.index}
                </div>
            ))}

        </div>
    );
}