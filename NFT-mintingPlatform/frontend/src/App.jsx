import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MintNft from './components/MintNft';
import NftGallery from './components/NftGallery';
import AdminPanel from './components/AdminPanel';
import { useWallet } from './context/WalletContext';

function App() {
  const { isConnected } = useWallet();

  return (
    <div className="App">
      <Navbar />
      
      <main style={{ marginTop: '80px' }}>
        <Hero />
        
        {isConnected ? (
          <>
            <AdminPanel />
            <MintNft />
            <NftGallery />
          </>
        ) : (
          <section className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
            <div className="glass" style={{ padding: '60px', borderRadius: '32px', maxWidth: '600px', margin: '0 auto' }}>
              <h2 style={{ marginBottom: '16px' }}>Connect Your Wallet</h2>
              <p style={{ color: '#6b7280', marginBottom: '32px' }}>
                Join the NFP Marketplace to start minting and collecting unique digital treasures. 
                Supporting MetaMask, Coinbase, and more.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                {/* RainbowKit ConnectButton is also in Navbar, but good to have a CTA here */}
                {/* Note: ConnectButton from RainbowKit is easily imported if needed, but we already have it in Navbar */}
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="matte-bg" style={{ padding: '60px 0', borderTop: '1px solid #e5e7eb', marginTop: '100px' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1f2937' }}>NFP Market</span>
            <p style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '4px' }}>© 2026 NFP Minting Platform. All rights reserved.</p>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#" style={{ color: '#6b7280', textDecoration: 'none' }}>Documentation</a>
            <a href="#" style={{ color: '#6b7280', textDecoration: 'none' }}>Terms</a>
            <a href="#" style={{ color: '#6b7280', textDecoration: 'none' }}>Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
