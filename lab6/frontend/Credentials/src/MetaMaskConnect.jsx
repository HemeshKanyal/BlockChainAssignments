import { useState } from "react";

export default function MetaMaskConnect({ setWallet }) {

    const [account, setAccount] = useState("");
    const [chainId, setChainId] = useState("");
    const [wrongNetwork, setWrongNetwork] = useState(false);

    const connectWallet = async () => {
        if (!window.ethereum) {
            alert("Install MetaMask");
            return;
        }

        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });

        const chain = await window.ethereum.request({
            method: "eth_chainId",
        });

        setAccount(accounts[0]);
        setChainId(chain);

        // Hardhat localhost chainId = 31337 (0x7a69)
        // if (chain !== "0x7a69") {
        // Sepolia chainId = 11155111 (0xaa36a7)
        if (chain !== "0xaa36a7" && chain !== "0xAA36A7") {
            setWrongNetwork(true);
        } else {
            setWrongNetwork(false);
        }

        setWallet(accounts[0]);
    };

    return (
        <div className="card">
            <h2>MetaMask Connect</h2>

            <button onClick={connectWallet}>Connect Wallet</button>

            <p>Account: {account}</p>
            <p>ChainId: {chainId}</p>

            {wrongNetwork && (
                <p style={{ color: "red" }}>
                    {/* Wrong Network — switch to Hardhat Localhost */}
                    Wrong Network — switch to Sepolia Testnet
                </p>
            )}
        </div>
    );
}