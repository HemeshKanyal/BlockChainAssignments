import React from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '../context/WalletContext';

const Hero = () => {
  const { isConnected, connectWallet } = useWallet();

  const handleExplore = () => {
    if (isConnected) {
      window.scrollTo({ top: 800, behavior: 'smooth' });
    } else {
      connectWallet();
    }
  };

  const handleHowItWorks = () => {
    alert("NFP Marketplace allows you to mint, view and manage your NFTs on the Sepolia testnet! Connect your wallet to get started.");
  };

  return (
    <section className="hero">
      <div className="container">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 style={{ marginBottom: '10px' }}>Discover & Mint</h1>
          <h1 style={{ marginTop: '0', fontSize: '3.5rem' }}>Rare Digital Art</h1>
          <p>
            The premier decentralized platform for minting unique NFTs on the Sepolia network. 
            Powered by metallic precision and violet elegance.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button onClick={handleExplore} className="primary-btn violet-glow" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
              Explore Collection
            </button>
            <button onClick={handleHowItWorks} className="secondary-btn glass" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
              How it Works
            </button>
          </div>
        </motion.div>
        
        {/* Animated Background Elements */}
        <motion.div
          className="metallic"
          style={{
            position: 'absolute',
            width: '200px',
            height: '200px',
            borderRadius: '40px',
            top: '20%',
            left: '10%',
            opacity: 0.1,
            zIndex: -1,
            rotate: 15
          }}
          animate={{
            rotate: [15, 25, 15],
            y: [0, 20, 0]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="glass violet-glow"
          style={{
            position: 'absolute',
            width: '150px',
            height: '150px',
            borderRadius: '999px',
            bottom: '10%',
            right: '15%',
            opacity: 0.2,
            zIndex: -1
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </section>
  );
};

export default Hero;
