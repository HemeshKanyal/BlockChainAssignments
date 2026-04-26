import { useWallet } from "../context/WalletContext";
import { CONTRACT_ADDRESS } from "../contracts/config";
import "./Landing.css";

export default function Landing({ onNavigate }) {
  const { account, connectWallet, isConnecting, error } = useWallet();

  return (
    <section className="landing" id="landing-page">
      {/* Background particles */}
      <div className="landing-particles">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="p" />
        ))}
      </div>

      {/* Hero */}
      <div className="landing-hero">
        <span className="sword-icon">⚔️</span>
        <h1>AWESOME ARENA</h1>
        <p className="subtitle">On-Chain Mini RPG</p>
        <p className="description">
          Connect your wallet, equip your NFT items, and battle the fearsome Dark Dragon.
          Defeat the boss to mint a legendary Champion Trophy NFT — forever on the blockchain.
        </p>

        <div className="landing-cta">
          {!account ? (
            <button
              className="btn btn-primary btn-game"
              onClick={connectWallet}
              disabled={isConnecting}
              id="btn-connect-wallet"
            >
              {isConnecting ? "⏳ Connecting..." : "🔗 Connect Wallet"}
            </button>
          ) : (
            <>
              <button
                className="btn btn-primary btn-game"
                onClick={() => onNavigate("game")}
                id="btn-enter-game"
              >
                ⚔️ Enter Arena
              </button>
              <button
                className="btn btn-secondary btn-game"
                onClick={() => onNavigate("shop")}
                id="btn-visit-shop"
              >
                🏪 Armory Shop
              </button>
              <button
                className="btn btn-secondary btn-game"
                onClick={() => onNavigate("inventory")}
                id="btn-view-inventory"
              >
                🎒 View Inventory
              </button>
            </>
          )}
        </div>
      </div>

      {/* Feature cards */}
      <div className="landing-features">
        <div className="feature-card glass-card">
          <span className="icon">🏪</span>
          <h3>Armory Shop</h3>
          <p>Mint Swords, Shields & Gold on-chain to power up your hero before battle.</p>
        </div>
        <div className="feature-card glass-card">
          <span className="icon">🗡️</span>
          <h3>Equip & Fight</h3>
          <p>Your on-chain Sword & Shield NFTs boost your attack and defense in the arena.</p>
        </div>
        <div className="feature-card glass-card">
          <span className="icon">🐉</span>
          <h3>Slay the Boss</h3>
          <p>Battle the Dark Dragon in a real-time 2D arena. Strategy and items are key to victory.</p>
        </div>
        <div className="feature-card glass-card">
          <span className="icon">🏆</span>
          <h3>Mint Trophy</h3>
          <p>Defeat the boss and mint a Legendary Champion Trophy NFT on Sepolia testnet.</p>
        </div>
      </div>

      {/* Contract info */}
      <div className="contract-info">
        <span>Smart Contract (Sepolia)</span>
        <a
          href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {CONTRACT_ADDRESS}
        </a>
      </div>

      {error && <div className="landing-error">{error}</div>}
    </section>
  );
}
