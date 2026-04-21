import React from 'react';
import { useWallet } from '../context/WalletContext';
import { Shield } from 'lucide-react';

const Navbar = () => {
  const { isConnected, account, chainId, connectWallet } = useWallet();

  const shortenAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <nav className="glass" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      padding: '16px 0',
      marginBottom: '20px'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer'
        }}>
          <div className="metallic" style={{
            padding: '8px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#8b5cf6'
          }}>
            <Shield size={24} />
          </div>
          <span style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            background: 'linear-gradient(to right, #1f2937, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>NFP <span style={{ fontWeight: 400 }}>Market</span></span>
        </div>
        
        <div style={{ display: 'flex', gap: 12 }}>
          {!isConnected ? (
            <button onClick={connectWallet} className="primary-btn violet-glow">
              Connect Wallet
            </button>
          ) : chainId !== 11155111 ? (
            <button className="primary-btn" style={{ background: '#ef4444' }}>
              Wrong Network
            </button>
          ) : (
            <>
              <button
                style={{ display: 'flex', alignItems: 'center' }}
                className="secondary-btn glass"
              >
                {/* Sepolia indicator optionally here */}
                Sepolia
              </button>

              <button className="secondary-btn glass">
                {shortenAddress(account)}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
