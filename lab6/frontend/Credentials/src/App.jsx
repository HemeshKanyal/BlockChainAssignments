import { useState } from "react";
import MetaMaskConnect from "./MetaMaskConnect";
import StudentDashboard from "./StudentDashboard";
import AdminDashboard from "./AdminDashboard";

function App() {

  const [wallet, setWallet] = useState("");

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Credential DApp</h1>
      <MetaMaskConnect setWallet={setWallet} />
      <StudentDashboard />
      {wallet && <AdminDashboard wallet={wallet} />}
    </div>
  );
}

export default App;