import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [account, setAccount] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const [chainId, setChainId] = useState(null);

    const connectWallet = async () => {
        if (window.ethereum) {
            try {
                const web3Provider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await web3Provider.send("eth_requestAccounts", []);
                const web3Signer = await web3Provider.getSigner();
                const network = await web3Provider.getNetwork();

                setProvider(web3Provider);
                setSigner(web3Signer);
                setAccount(accounts[0]);
                setIsConnected(true);
                setChainId(Number(network.chainId));
            } catch (error) {
                console.error("Error connecting wallet:", error);
            }
        } else {
            alert('Please install MetaMask to use this application.');
        }
    };

    useEffect(() => {
        if (window.ethereum) {
            // Check if already connected
            window.ethereum.request({ method: 'eth_accounts' }).then(async (accounts) => {
                if (accounts.length > 0) {
                    const web3Provider = new ethers.BrowserProvider(window.ethereum);
                    const web3Signer = await web3Provider.getSigner();
                    const network = await web3Provider.getNetwork();

                    setProvider(web3Provider);
                    setSigner(web3Signer);
                    setAccount(accounts[0]);
                    setIsConnected(true);
                    setChainId(Number(network.chainId));
                }
            });

            // Listeners
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    setIsConnected(true);
                } else {
                    setAccount('');
                    setIsConnected(false);
                }
            });

            window.ethereum.on('chainChanged', (newChainId) => {
                window.location.reload();
            });
        }
    }, []);

    return (
        <WalletContext.Provider value={{ provider, signer, account, isConnected, chainId, connectWallet }}>
            {children}
        </WalletContext.Provider>
    );
};
