import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useContract } from '../hooks/useContract';
import { useWallet } from '../context/WalletContext';
import { ethers } from 'ethers';
import NFTAbi from '../contracts/NFTMintingPlatform.json';
import { ExternalLink, Tag } from 'lucide-react';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

const NftCard = ({ id }) => {
    const [metadata, setMetadata] = useState(null);
    const [loading, setLoading] = useState(true);
    const { provider } = useWallet();

    useEffect(() => {
        const fetchMetadata = async () => {
            if (!provider) return;
            try {
                const abi = Array.isArray(NFTAbi) ? NFTAbi : NFTAbi.abi;
                const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);
                const uri = await contract.tokenURI(id);
                
                const response = await fetch(uri);
                const data = await response.json();
                setMetadata(data);
            } catch (err) {
                console.error('Error fetching NFT:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchMetadata();
    }, [id, provider]);

    if (loading) return (
        <div className="metallic" style={{ height: '350px', borderRadius: '20px', animate: 'pulse 2s infinite' }} />
    );

    if (!metadata) return null;

    return (
        <motion.div 
            className="glass" 
            style={{ borderRadius: '20px', overflow: 'hidden' }}
            whileHover={{ y: -10 }}
        >
            <div style={{ position: 'relative', height: '240px' }}>
                <img 
                    src={metadata.image.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')} 
                    alt={metadata.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    <span className="glass" style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                        #{id}
                    </span>
                </div>
            </div>
            
            <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{metadata.name}</h3>
                <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '16px', height: '40px', overflow: 'hidden' }}>
                    {metadata.description}
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#8b5cf6' }}>
                        <Tag size={16} />
                        <span style={{ fontWeight: 600 }}>ERC-721</span>
                    </div>
                    <a 
                        href={`https://sepolia.etherscan.io/token/${CONTRACT_ADDRESS}?a=${id}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="secondary-btn"
                        style={{ padding: '8px', borderRadius: '8px' }}
                    >
                        <ExternalLink size={16} />
                    </a>
                </div>
            </div>
        </motion.div>
    );
};

const NftGallery = () => {
    const { tokenCounter } = useContract();
    const ids = Array.from({ length: tokenCounter }, (_, i) => i);

    return (
        <section className="container" style={{ padding: '60px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>Marketplace Items</h2>
                    <p style={{ color: '#6b7280' }}>Explore all unique assets minted on the platform</p>
                </div>
                <div className="metallic" style={{ padding: '8px 20px', borderRadius: '20px', fontSize: '0.9rem' }}>
                    Total: <span style={{ fontWeight: 700, color: '#8b5cf6' }}>{tokenCounter}</span>
                </div>
            </div>

            {tokenCounter === 0 ? (
                <div className="glass" style={{ textAlign: 'center', padding: '60px', borderRadius: '24px' }}>
                    <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>No items minted yet. Be the first to create one!</p>
                </div>
            ) : (
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
                    {ids.reverse().map(id => (
                        <NftCard key={id} id={id} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default NftGallery;
