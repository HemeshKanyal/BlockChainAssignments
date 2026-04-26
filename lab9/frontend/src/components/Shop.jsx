import { useState } from "react";
import { useWallet } from "../context/WalletContext";
import { TOKEN_META, TOKEN_IDS, RARITY_COLORS } from "../contracts/config";
import "./Shop.css";

const SHOP_ITEMS = [
  {
    id: TOKEN_IDS.SWORD,
    desc: "A sharp enchanted blade. Each sword adds +50 Attack Power in the arena.",
    effect: "⚔️ +50 ATK per sword",
  },
  {
    id: TOKEN_IDS.SHIELD,
    desc: "A sturdy magical shield. Each shield adds +40 Defense when blocking.",
    effect: "🛡️ +40 DEF per shield",
  },
];

export default function Shop() {
  const { mintItem, inventory } = useWallet();
  const [quantities, setQuantities] = useState({});
  const [mintStates, setMintStates] = useState({});

  const getQty = (id) => quantities[id] || 1;

  const setQty = (id, val) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, Math.min(10, val)) }));
  };

  const handleMint = async (id) => {
    const qty = getQty(id);
    setMintStates((prev) => ({ ...prev, [id]: { status: "pending" } }));
    try {
      const tx = await mintItem(id, qty);
      setMintStates((prev) => ({
        ...prev,
        [id]: { status: "success", hash: tx.hash },
      }));
      // Auto-clear success after 5s
      setTimeout(() => {
        setMintStates((prev) => ({ ...prev, [id]: null }));
      }, 5000);
    } catch (err) {
      setMintStates((prev) => ({
        ...prev,
        [id]: { status: "error", msg: err.reason || err.message || "Mint failed" },
      }));
    }
  };

  return (
    <section className="shop" id="shop-page">
      <div className="shop-header">
        <h2>🏪 Armory Shop</h2>
        <p>Mint items on-chain to equip your hero before battle</p>
      </div>

      <div className="shop-grid">
        {SHOP_ITEMS.map((item) => {
          const meta = TOKEN_META[item.id];
          const balance = inventory[item.id] ?? 0;
          const qty = getQty(item.id);
          const state = mintStates[item.id];
          const rarityClass = `rarity-${meta.rarity.toLowerCase()}`;

          return (
            <div className="shop-card glass-card" key={item.id} id={`shop-card-${item.id}`}>
              <div className="shop-card-image">
                <img src={meta.image} alt={meta.name} />
                <span className="shop-card-owned">Owned: {balance.toLocaleString()}</span>
              </div>
              <div className="shop-card-body">
                <h3>{meta.name}</h3>
                <div className="shop-type">
                  {meta.type} · <span className={`rarity-badge ${rarityClass}`}>{meta.rarity}</span>
                </div>
                <p className="shop-desc">{item.desc}</p>
                <div className="shop-stat-row">
                  <div className="shop-stat">
                    <span>Effect:</span>
                    <span className="val">{item.effect}</span>
                  </div>
                </div>
                <div className="shop-mint-row">
                  <div className="shop-qty">
                    <button onClick={() => setQty(item.id, qty - 1)}>−</button>
                    <span>{qty}</span>
                    <button onClick={() => setQty(item.id, qty + 1)}>+</button>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleMint(item.id)}
                    disabled={state?.status === "pending"}
                    id={`btn-mint-${item.id}`}
                  >
                    {state?.status === "pending" ? "Minting..." : `Mint ×${qty}`}
                  </button>
                </div>
                {state?.status === "pending" && (
                  <div className="shop-mint-status pending">⏳ Confirm in MetaMask...</div>
                )}
                {state?.status === "success" && (
                  <div className="shop-mint-status success">
                    ✅ Minted! <a href={`https://sepolia.etherscan.io/tx/${state.hash}`} target="_blank" rel="noopener noreferrer">View tx →</a>
                  </div>
                )}
                {state?.status === "error" && (
                  <div className="shop-mint-status error">❌ {state.msg}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="shop-note">
        <p>
          <strong>Note:</strong> Items are minted as ERC1155 tokens on Sepolia testnet.
          Each mint requires a small gas fee (SepoliaETH). Your items directly affect your combat stats in the arena!
        </p>
      </div>
    </section>
  );
}
