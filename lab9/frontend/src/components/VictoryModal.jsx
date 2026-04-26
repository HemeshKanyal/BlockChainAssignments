import { useState, useMemo } from "react";
import { useWallet } from "../context/WalletContext";
import { TOKEN_IDS } from "../contracts/config";
import "./VictoryModal.css";

const CONFETTI_COLORS = ["#ffd700", "#a855f7", "#3b82f6", "#22c55e", "#ef4444", "#f97316", "#ec4899"];

export default function VictoryModal({ onNavigate, onPlayAgain, gameData }) {
  const { mintItem, mintTrophy } = useWallet();
  const [mintStates, setMintStates] = useState({});

  // Destructure game data
  const { won, damageTaken, timeTakenMs } = gameData || { won: false, damageTaken: 0, timeTakenMs: 0 };
  
  // Calculate rewards
  const timeTakenSec = Math.floor(timeTakenMs / 1000);
  const isPerfect = damageTaken === 0;
  const isSpeedrun = timeTakenSec <= 15;
  const extraordinary = isPerfect || isSpeedrun;

  const rewards = [
    {
      id: "silver",
      tokenId: TOKEN_IDS.SILVER,
      name: "Silver Coin",
      icon: "/assets/silver.png",
      earned: true, // Earned just for playing
      reason: "Participation Reward",
    },
    {
      id: "gold",
      tokenId: TOKEN_IDS.GOLD,
      name: "Gold Coin",
      icon: "/assets/gold.png",
      earned: won,
      reason: "Victory Reward",
    },
    {
      id: "trophy",
      tokenId: TOKEN_IDS.TROPHY,
      name: "Champion Trophy",
      icon: "/assets/trophy.png",
      earned: won,
      reason: "Slay the Dragon",
      isTrophy: true
    },
    {
      id: "crown",
      tokenId: TOKEN_IDS.CROWN,
      name: "Legendary Crown",
      icon: "/assets/crown.png",
      earned: won && extraordinary,
      reason: "Extraordinary Feat",
      reqDesc: "Win without taking damage OR win in under 15s"
    }
  ];

  const confettiPieces = useMemo(() => {
    if (!won) return [];
    return Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: `${Math.random() * 3}s`,
      duration: `${2 + Math.random() * 3}s`,
      size: `${6 + Math.random() * 8}px`,
    }));
  }, [won]);

  const handleMint = async (reward) => {
    setMintStates(prev => ({ ...prev, [reward.id]: { status: "pending" } }));
    try {
      let tx;
      if (reward.isTrophy) {
        tx = await mintTrophy();
      } else {
        tx = await mintItem(reward.tokenId, 1);
      }
      setMintStates(prev => ({ ...prev, [reward.id]: { status: "success", hash: tx.hash } }));
    } catch (err) {
      console.error("Mint error:", err);
      setMintStates(prev => ({ ...prev, [reward.id]: { status: "error", msg: err.reason || err.message } }));
    }
  };

  return (
    <div className={`victory-modal ${won ? 'is-victory' : 'is-defeat'}`} id="victory-modal">
      {won && (
        <div className="confetti-container">
          {confettiPieces.map((c) => (
            <div key={c.id} className="confetti" style={{ left: c.left, backgroundColor: c.color, width: c.size, height: c.size, animationDelay: c.delay, animationDuration: c.duration }} />
          ))}
        </div>
      )}

      <div className="victory-content glass-card">
        <h2>{won ? "🎉 VICTORY!" : "💀 DEFEAT"}</h2>
        <p className="victory-subtitle">
          {won ? "The Dark Dragon has been slain" : "The Dragon claims another victim"}
        </p>

        <div className="battle-stats">
          <div className="stat-box">
            <span className="label">Time</span>
            <span className="value">{timeTakenSec}s</span>
          </div>
          <div className="stat-box">
            <span className="label">Damage Taken</span>
            <span className="value">{damageTaken}</span>
          </div>
        </div>

        <h3 className="rewards-title">BATTLE REWARDS</h3>
        <p className="rewards-subtitle">Mint your earned loot to the blockchain</p>

        <div className="rewards-list">
          {rewards.map(reward => {
            const state = mintStates[reward.id];
            
            return (
              <div className={`reward-item ${reward.earned ? 'earned' : 'locked'}`} key={reward.id}>
                <div className="reward-icon">
                  <img src={reward.icon} alt={reward.name} />
                </div>
                <div className="reward-info">
                  <h4>{reward.name}</h4>
                  <p>{reward.reason}</p>
                  {!reward.earned && reward.reqDesc && (
                    <span className="req-desc">({reward.reqDesc})</span>
                  )}
                </div>
                <div className="reward-action">
                  {reward.earned ? (
                    state?.status === "success" ? (
                      <span className="mint-success">✅ Minted</span>
                    ) : state?.status === "pending" ? (
                      <span className="mint-pending">⏳ Waiting...</span>
                    ) : (
                      <button 
                        className="btn btn-primary btn-sm" 
                        onClick={() => handleMint(reward)}
                      >
                        Mint
                      </button>
                    )
                  ) : (
                    <span className="mint-locked">🔒 Locked</span>
                  )}
                </div>
                {state?.status === "error" && (
                  <div className="reward-error">{state.msg}</div>
                )}
              </div>
            );
          })}
        </div>

        <div className="victory-actions">
          <button className="btn btn-secondary" onClick={() => onNavigate("inventory")} id="btn-victory-inventory">
            🎒 Inventory
          </button>
          <button className="btn btn-secondary" onClick={onPlayAgain} id="btn-play-again">
            ⚔️ Fight Again
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate("shop")} id="btn-victory-shop">
            🏪 Armory
          </button>
        </div>
      </div>
    </div>
  );
}
