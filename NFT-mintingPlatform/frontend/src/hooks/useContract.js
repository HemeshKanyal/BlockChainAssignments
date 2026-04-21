import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../context/WalletContext';
import NFTAbi from '../contracts/NFTMintingPlatform.json';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export const useContract = () => {
    const { provider, signer, account, isConnected } = useWallet();
    const [tokenCounter, setTokenCounter] = useState(0);
    const [maxSupply, setMaxSupply] = useState(0);
    const [mintFee, setMintFee] = useState(0n);
    const [publicMintEnabled, setPublicMintEnabled] = useState(false);
    const [owner, setOwner] = useState('');

    useEffect(() => {
        const fetchContractData = async () => {
            if (provider) {
                try {
                    // Check if NFTAbi is an array or an object with an abi property
                    const abi = Array.isArray(NFTAbi) ? NFTAbi : NFTAbi.abi;
                    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
                    
                    const [fetchedCounter, fetchedMax, fetchedFee, fetchedMintEnabled, fetchedOwner] = await Promise.all([
                        contract.tokenCounter(),
                        contract.maxSupply(),
                        contract.mintFee(),
                        contract.publicMintEnabled(),
                        contract.owner()
                    ]);

                    setTokenCounter(Number(fetchedCounter));
                    setMaxSupply(Number(fetchedMax));
                    setMintFee(fetchedFee);
                    setPublicMintEnabled(fetchedMintEnabled);
                    setOwner(fetchedOwner);
                } catch (err) {
                    console.error("Failed to fetch contract data:", err);
                }
            }
        };

        fetchContractData();
        const interval = setInterval(fetchContractData, 10000);
        return () => clearInterval(interval);
    }, [provider]);

    const mintNFT = async (tokenURI, fee) => {
        if (!signer) throw new Error("Wallet not connected");
        const abi = Array.isArray(NFTAbi) ? NFTAbi : NFTAbi.abi;
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
        const tx = await contract.mintNFT(tokenURI, { value: fee });
        return await tx.wait();
    };

    const togglePublicMint = async (enabled) => {
        if (!signer) throw new Error("Wallet not connected");
        const abi = Array.isArray(NFTAbi) ? NFTAbi : NFTAbi.abi;
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
        const tx = await contract.togglePublicMint(enabled);
        return await tx.wait();
    };

    const withdraw = async () => {
        if (!signer) throw new Error("Wallet not connected");
        const abi = Array.isArray(NFTAbi) ? NFTAbi : NFTAbi.abi;
        const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, signer);
        const tx = await contract.withdraw();
        return await tx.wait();
    };

    return {
        address: account,
        owner,
        tokenCounter,
        maxSupply,
        mintFee,
        publicMintEnabled,
        isOwner: account && owner && (account.toLowerCase() === owner.toLowerCase()),
        mintNFT,
        togglePublicMint,
        withdraw,
    };
};
