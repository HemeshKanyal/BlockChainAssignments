import React from 'react';
import { useContract } from '../hooks/useContract';
import { Settings, Lock, Unlock, Landmark, CreditCard } from 'lucide-react';
import { ethers } from 'ethers';

const AdminPanel = () => {
    const { isOwner, publicMintEnabled, togglePublicMint, withdraw, mintFee } = useContract();

    if (!isOwner) return null;

    return (
        <section className="container" style={{ padding: '40px 0' }}>
            <div className="glass" style={{ padding: '30px', borderRadius: '24px', border: '1px solid var(--primary-violet)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <div className="metallic" style={{ padding: '10px', borderRadius: '12px', color: '#8b5cf6' }}>
                        <Settings size={24} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Owner Dashboard</h2>
                </div>

                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                    {/* Toggle Public Mint */}
                    <div className="metallic" style={{ padding: '24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h4 style={{ marginBottom: '4px' }}>Public Minting</h4>
                            <p style={{ color: '#6b7280', fontSize: '0.8rem' }}>Currently {publicMintEnabled ? 'Enabled' : 'Disabled'}</p>
                        </div>
                        <button 
                            className={publicMintEnabled ? "secondary-btn" : "primary-btn"}
                            style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
                            onClick={() => togglePublicMint(!publicMintEnabled)}
                        >
                            {publicMintEnabled ? <><Lock size={18} /> Disable</> : <><Unlock size={18} /> Enable</>}
                        </button>
                    </div>

                    {/* Withdraw Funds */}
                    <div className="metallic" style={{ padding: '24px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h4 style={{ marginBottom: '4px' }}>Contract Balance</h4>
                            <p style={{ color: '#6b7280', fontSize: '0.8rem' }}>Withdraw accumulated fees</p>
                        </div>
                        <button 
                            className="primary-btn violet-glow"
                            style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}
                            onClick={() => withdraw()}
                        >
                            <Landmark size={18} /> Withdraw
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminPanel;
