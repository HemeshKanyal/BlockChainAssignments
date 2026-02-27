import { useState } from "react";
import { getContract } from "./contract";

export default function StudentDashboard() {

    const [addr, setAddr] = useState("");
    const [data, setData] = useState([]);

    const fetchCredentials = async () => {
        try {
            const { contract } = await getContract();

            const res = await contract.methods
                .getCredentials(addr)
                .call();

            console.log(res);

            setData(res);
            if (res.length === 0) {
                alert("No credentials found for this address.");
            }
        } catch (error) {
            console.error(error);
            alert("Error fetching credentials. Ensure the address is correct.");
        }
    };

    return (
        <div className="card">

            <h2>Student Dashboard</h2>

            <div className="form-group">
                <input
                    placeholder="Student Address"
                    value={addr}
                    onChange={(e) => setAddr(e.target.value)}
                />
            </div>

            <button onClick={fetchCredentials}>Fetch</button>

            <table border="1">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Degree</th>
                        <th>Major</th>
                        <th>GPA</th>
                        <th>Hash</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((c, i) => (
                        <tr key={i}>
                            <td>{c.subject.student_name}</td>
                            <td>{c.achievement.degree_type}</td>
                            <td>{c.achievement.major}</td>
                            <td>{c.achievement.gpa}</td>
                            <td>{c.evidence.hash_of_work}</td>
                        </tr>
                    ))}
                </tbody>

            </table>

        </div>
    );
}