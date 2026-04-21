import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Plus, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { uploadFileToIPFS, uploadJSONToIPFS } from '../services/pinataService';
import { useContract } from '../hooks/useContract';
import { ethers } from 'ethers';

const MintNft = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('idle'); // idle, uploading, minting, success, error
    const [error, setError] = useState('');

    const { mintNFT, mintFee, tokenCounter, maxSupply } = useContract();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleMint = async (e) => {
        e.preventDefault();
        if (!file || !name) return;

        try {
            setStatus('uploading');
            
            // 1. Upload Image to IPFS
            const imageHash = await uploadFileToIPFS(file);
            const imageURI = `https://gateway.pinata.cloud/ipfs/${imageHash}`;

            // 2. Upload Metadata to IPFS
            const metadata = {
                name,
                description,
                image: imageURI,
                attributes: []
            };
            const metadataHash = await uploadJSONToIPFS(metadata);
            const tokenURI = `https://gateway.pinata.cloud/ipfs/${metadataHash}`;

            // 3. Mint on Blockchain
            setStatus('minting');
            const tx = await mintNFT(tokenURI, mintFee);
            
            console.log('Transaction:', tx);
            setStatus('success');
            
            // Reset form
            setTimeout(() => {
                setFile(null);
                setPreview(null);
                setName('');
                setDescription('');
                setStatus('idle');
            }, 5000);

        } catch (err) {
            console.error(err);
            setError(err.message || 'Something went wrong');
            setStatus('error');
        }
    };

    return (
        <section className="container" style={{ padding: '40px 0' }}>
            <div className="grid" style={{ gridTemplateColumns: 'minmax(300px, 450px) 1fr', alignItems: 'start' }}>
                {/* Left: Upload Card */}
                <motion.div 
                    className="glass" 
                    style={{ padding: '30px', borderRadius: '24px' }}
                    whileHover={{ y: -5 }}
                >
                    <h2 style={{ marginBottom: '20px', fontSize: '1.5rem', fontWeight: 600 }}>Create New NFT</h2>
                    
                    <form onSubmit={handleMint}>
                        <div 
                            className="metallic"
                            style={{
                                height: '250px',
                                borderRadius: '16px',
                                border: '2px dashed #8b5cf6',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                overflow: 'hidden',
                                position: 'relative',
                                marginBottom: '20px'
                            }}
                            onClick={() => document.getElementById('fileInput').click()}
                        >
                            {preview ? (
                                <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <>
                                    <Upload size={40} style={{ color: '#8b5cf6', marginBottom: '12px' }} />
                                    <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>PNG, JPG, GIF (Max 10MB)</p>
                                </>
                            )}
                            <input 
                                id="fileInput" 
                                type="file" 
                                hidden 
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Name *</label>
                            <input 
                                type="text"
                                className="glass"
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', color: 'inherit' }}
                                placeholder="Item name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Description</label>
                            <textarea 
                                className="glass"
                                style={{ width: '100%', padding: '12px', borderRadius: '12px', color: 'inherit', minHeight: '100px', resize: 'vertical' }}
                                placeholder="Provide a detailed description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="primary-btn violet-glow" 
                            style={{ width: '100%', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                            disabled={status !== 'idle' || !file || !name}
                        >
                            {status === 'idle' && <><Plus size={20} /> Mint Asset</>}
                            {status === 'uploading' && <><Loader2 size={20} className="animate-spin" /> Uploading to IPFS...</>}
                            {status === 'minting' && <><Loader2 size={20} className="animate-spin" /> Minting on Chain...</>}
                            {status === 'success' && <><CheckCircle2 size={20} /> Minted Successfully!</>}
                            {status === 'error' && <><AlertCircle size={20} /> Error occured</>}
                        </button>
                        
                        {status === 'error' && (
                            <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '12px', textAlign: 'center' }}>
                                {error}
                            </p>
                        )}
                    </form>
                </motion.div>

                {/* Right: Stats & Details */}
                <div style={{ paddingLeft: '40px' }}>
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '40px' }}>
                        <div className="metallic" style={{ padding: '24px', borderRadius: '20px' }}>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '8px' }}>Mint Fee</p>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 700 }}>{ethers.formatEther(mintFee)} ETH</h3>
                        </div>
                        <div className="metallic" style={{ padding: '24px', borderRadius: '20px' }}>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '8px' }}>Total Supply</p>
                            <h3 style={{ fontSize: '1.8rem', fontWeight: 700 }}>{tokenCounter} / {maxSupply}</h3>
                        </div>
                    </div>

                    <div className="glass" style={{ padding: '30px', borderRadius: '24px' }}>
                        <h3 style={{ marginBottom: '16px' }}>Minting Rules</h3>
                        <ul style={{ listStyle: 'none', color: '#6b7280', lineHeight: '1.8' }}>
                            <li>• Ensure you have enough ETH for the mint fee + gas</li>
                            <li>• Images are stored permanently on IPFS</li>
                            <li>• Maximum supply is hardcapped at {maxSupply}</li>
                            <li>• Each NFT is a unique 1/1 digital collectible</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            <style>
                {`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .animate-spin {
                        animation: spin 1s linear infinite;
                    }
                `}
            </style>
        </section>
    );
};

export default MintNft;
