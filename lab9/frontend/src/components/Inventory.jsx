import { useState } from "react";
import { useWallet } from "../context/WalletContext";
import { TOKEN_META, RARITY_COLORS } from "../contracts/config";
import "./Inventory.css";

export default function Inventory() {
  const { inventory, refreshInventory, account } = useWallet();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshInventory();
    setTimeout(() => setRefreshing(false), 600);
  };

  const tokenIds = [0, 1, 2, 3, 4, 5];

  return (
    <section className="inventory" id="inventory-page">
      <div className="inventory-header">
        <h2>🎒 Your Inventory</h2>
        <p>On-chain ERC1155 items linked to your wallet</p>
      </div>

      <div className="inventory-actions">
        <button
          className={`btn btn-secondary btn-refresh ${refreshing ? "spinning" : ""}`}
          onClick={handleRefresh}
          disabled={refreshing}
          id="btn-refresh-inventory"
        >
          <span className="refresh-icon">🔄</span>
          {refreshing ? "Syncing..." : "Sync from Chain"}
        </button>
      </div>

      <div className="inventory-grid">
        {tokenIds.map((id) => {
          const meta = TOKEN_META[id];
          const balance = inventory[id] ?? 0;
          const rarityColor = RARITY_COLORS[meta.rarity];
          const rarityClass = `rarity-${meta.rarity.toLowerCase()}`;

          return (
            <div className="item-card glass-card" key={id} id={`item-card-${id}`}>
              <div className="item-image-wrapper">
                <img src={meta.image} alt={meta.name} loading="lazy" />
                <div className="item-balance-badge">×{balance > 999999 ? "999k+" : balance.toLocaleString()}</div>
                <div className="item-rarity-strip" style={{ background: rarityColor }} />
              </div>
              <div className="item-info">
                <div className="item-info-top">
                  <h3>{meta.name}</h3>
                  <span className={`rarity-badge ${rarityClass}`}>{meta.rarity}</span>
                </div>
                <div className="item-type">{meta.type}</div>
                <div className="item-stats">
                  {meta.attack && (
                    <div className="item-stat">
                      <span className="stat-icon">⚔️</span>
                      <span>ATK</span>
                      <span className="stat-value">+{meta.attack}</span>
                    </div>
                  )}
                  {meta.defense && (
                    <div className="item-stat">
                      <span className="stat-icon">🛡️</span>
                      <span>DEF</span>
                      <span className="stat-value">+{meta.defense}</span>
                    </div>
                  )}
                  <div className="item-stat">
                    <span className="stat-icon">📦</span>
                    <span>Owned</span>
                    <span className="stat-value">{balance > 999999 ? "999k+" : balance.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
