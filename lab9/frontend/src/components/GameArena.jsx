import { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import { useWallet } from "../context/WalletContext";
import { createGameConfig } from "../game/config";
import { calculateStats, BOSS_STATS } from "../game/utils";
import VictoryModal from "./VictoryModal";
import "./GameArena.css";

export default function GameArena({ onNavigate }) {
  const { inventory } = useWallet();
  const gameRef = useRef(null);
  const containerRef = useRef(null);
  const [gameResult, setGameResult] = useState(null); // null | "won" | "lost"
  const playerStats = calculateStats(inventory);

  useEffect(() => {
    if (gameResult) return; // Don't create game if result shown

    const config = createGameConfig(containerRef.current);
    const game = new Phaser.Game(config);
    gameRef.current = game;

    // Pass player stats to Phaser via registry
    game.registry.set("playerStats", playerStats);

    // Listen for game over event
    game.events.on("gameOver", (data) => {
      setGameResult(data);
      game.destroy(true);
      gameRef.current = null;
    });

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [gameResult]); // restart creates a new game

  const handleRestart = () => {
    setGameResult(null);
  };

  if (gameResult?.won === true) {
    return <VictoryModal onNavigate={onNavigate} onPlayAgain={handleRestart} gameData={gameResult} />;
  }

  return (
    <section className="game-arena" id="game-arena-page">
      <div className="game-header">
        <h2>⚔️ Boss Arena</h2>
        <p>Defeat the {BOSS_STATS.name} to earn a Champion Trophy NFT!</p>
      </div>

      <div className="game-stats-bar">
        <div className="game-stat-chip">
          <span className="label">ATK</span>
          <span className="value">{playerStats.attack}</span>
        </div>
        <div className="game-stat-chip">
          <span className="label">DEF</span>
          <span className="value">{playerStats.defense}</span>
        </div>
        <div className="game-stat-chip">
          <span className="label">HP</span>
          <span className="value">{playerStats.maxHP}</span>
        </div>
        {playerStats.swordCount > 0 && (
          <div className="game-stat-chip">
            <span className="label">🗡️</span>
            <span className="value">×{playerStats.swordCount}</span>
          </div>
        )}
        {playerStats.shieldCount > 0 && (
          <div className="game-stat-chip">
            <span className="label">🛡️</span>
            <span className="value">×{playerStats.shieldCount}</span>
          </div>
        )}
        {playerStats.hasCrown && (
          <div className="game-stat-chip">
            <span className="label">👑</span>
            <span className="value">Equipped</span>
          </div>
        )}
      </div>

      {gameResult?.won === false ? (
        <div className="defeat-overlay glass-card">
          <h3>💀 DEFEAT</h3>
          <p>The Dark Dragon has bested you. Return with stronger equipment or try again!</p>
          <div className="defeat-buttons">
            <button className="btn btn-primary btn-game" onClick={handleRestart} id="btn-retry">
              ⚔️ Try Again
            </button>
            <button className="btn btn-secondary btn-game" onClick={() => onNavigate("inventory")} id="btn-back-inventory">
              🎒 Check Inventory
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="game-canvas-wrapper" ref={containerRef} id="game-canvas" />
          <div className="game-controls-info">
            <div className="control-tip">
              <kbd>A</kbd> or <kbd>SPACE</kbd> — ATTACK (Deals damage)
            </div>
            <div className="control-tip">
              <kbd>D</kbd> or <kbd>SHIFT</kbd> — DEFEND (Reduces damage)
            </div>
            <div className="control-tip">
              <kbd>P</kbd> — PAUSE GAME
            </div>
          </div>
        </>
      )}
    </section>
  );
}
