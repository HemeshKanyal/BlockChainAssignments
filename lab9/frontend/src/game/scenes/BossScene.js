import Phaser from "phaser";
import { calculateDamage, BOSS_STATS } from "../utils.js";

export default class BossScene extends Phaser.Scene {
  constructor() {
    super({ key: "BossScene" });
  }

  init() {
    this.playerStats = this.registry.get("playerStats") || {
      attack: 10, defense: 5, maxHP: 100,
      swordCount: 0, shieldCount: 0, hasCrown: false, hasGold: false,
    };
    this.playerHP = this.playerStats.maxHP;
    this.bossHP = BOSS_STATS.maxHP;
    this.isDefending = false;
    
    // Game states
    this.gameState = "START"; // START | PLAYING | PAUSED | OVER
    this.bossAttackTimer = null;
    this.canAttack = true;
    this.attackCooldown = 800;
    
    // Track stats for "Extraordinary" reward logic
    this.timeTakenMs = 0;
    this.damageTaken = 0;
    this.startTime = 0;
  }

  create() {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    // ===== BACKGROUND =====
    this.bg = this.add.image(w / 2, h / 2, "arena-bg").setDisplaySize(w, h);
    this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.25);

    // ===== GROUND LINE =====
    const groundY = h * 0.78;
    this.add.rectangle(w / 2, groundY, w, 2, 0x6b5b8a, 0.2);

    // ===== PLAYER =====
    const playerX = w * 0.22;
    const playerY = groundY - 85;
    const hasSword = this.playerStats.swordCount > 0;

    this.player = this.add.image(playerX, playerY, hasSword ? "player-armed" : "player-unarmed")
      .setDisplaySize(150, 150).setOrigin(0.5, 0.5);

    this.swordOverlay = null; // Removing overlay as sword is baked in sprite
    if (this.playerStats.shieldCount > 0) {
      this.shieldOverlay = this.add.image(playerX - 30, playerY + 5, "shield-icon")
        .setDisplaySize(45, 45).setAlpha(0.85);
    }
    this.shieldBarrier = this.add.image(playerX, playerY, "shield-effect")
      .setDisplaySize(180, 180).setAlpha(0).setDepth(5);

    // ===== BOSS =====
    const bossX = w * 0.76;
    const bossY = groundY - 100;

    this.boss = this.add.image(bossX, bossY, "boss")
      .setDisplaySize(210, 210).setOrigin(0.5, 0.5);

    this.slashEffect = this.add.image(bossX - 30, bossY, "slash-effect")
      .setDisplaySize(140, 140).setAlpha(0).setDepth(5);

    // ===== HUD =====
    this.createHUD(w, h);
    this.createButtons(w, h, hasSword);

    // ===== COMBAT LOG =====
    this.logBg = this.add.rectangle(w / 2, h - 18, w - 40, 28, 0x000000, 0.5)
      .setStrokeStyle(1, 0x6b5b8a, 0.3);
    this.combatLog = this.add.text(w / 2, h - 18, "Press START to begin!", {
      fontFamily: "Inter, sans-serif", fontSize: "12px", color: "#c9b8e8", align: "center",
    }).setOrigin(0.5);

    // ===== START SCREEN OVERLAY =====
    this.startOverlayBg = this.add.rectangle(w/2, h/2, w, h, 0x000000, 0.7).setDepth(50);
    this.startBtn = this.add.rectangle(w/2, h/2, 200, 60, 0x3b82f6, 1)
      .setStrokeStyle(3, 0x60a5fa).setInteractive({ useHandCursor: true }).setDepth(50);
    this.startText = this.add.text(w/2, h/2, "START BATTLE", {
      fontFamily: "Cinzel, serif", fontSize: "20px", color: "#fff", fontStyle: "bold",
    }).setOrigin(0.5).setDepth(50);

    this.startBtn.on("pointerdown", () => this.startGame());

    // ===== PAUSE SCREEN OVERLAY =====
    this.pauseOverlayBg = this.add.rectangle(w/2, h/2, w, h, 0x000000, 0.8).setDepth(50).setVisible(false);
    this.pauseText = this.add.text(w/2, h/2 - 20, "PAUSED", {
      fontFamily: "Cinzel, serif", fontSize: "36px", color: "#fff", fontStyle: "bold", letterSpacing: 4
    }).setOrigin(0.5).setDepth(50).setVisible(false);
    this.resumeBtn = this.add.rectangle(w/2, h/2 + 40, 200, 50, 0x22c55e, 1)
      .setStrokeStyle(2, 0x4ade80).setInteractive({ useHandCursor: true }).setDepth(50).setVisible(false);
    this.resumeText = this.add.text(w/2, h/2 + 40, "RESUME", {
      fontFamily: "Inter, sans-serif", fontSize: "16px", color: "#fff", fontStyle: "bold"
    }).setOrigin(0.5).setDepth(50).setVisible(false);
    
    this.resumeBtn.on("pointerdown", () => this.togglePause());

    // ===== KEYBOARD CONTROLS =====
    this.input.keyboard.on('keydown-A', () => this.playerAttack());
    this.input.keyboard.on('keydown-SPACE', () => this.playerAttack());
    
    this.input.keyboard.on('keydown-D', () => this.playerDefend());
    this.input.keyboard.on('keydown-SHIFT', () => this.playerDefend());

    this.input.keyboard.on('keydown-P', () => {
      if (this.gameState === "PLAYING" || this.gameState === "PAUSED") {
        this.togglePause();
      }
    });

    // Idle float animations
    this.tweens.add({
      targets: [this.player, this.swordOverlay, this.shieldOverlay].filter(Boolean),
      y: "-=5", yoyo: true, repeat: -1, duration: 1500, ease: "Sine.easeInOut",
    });
    this.tweens.add({
      targets: this.boss,
      y: "-=7", yoyo: true, repeat: -1, duration: 2000, ease: "Sine.easeInOut",
    });
  }

  startGame() {
    this.startOverlayBg.destroy();
    this.startBtn.destroy();
    this.startText.destroy();
    
    this.gameState = "PLAYING";
    this.startTime = this.time.now;
    this.updateCombatLog("⚔️ Battle begins! Defeat the Dark Dragon!");

    this.bossAttackTimer = this.time.addEvent({
      delay: BOSS_STATS.attackInterval,
      callback: this.bossAttack,
      callbackScope: this,
      loop: true,
    });
  }

  togglePause() {
    if (this.gameState === "PLAYING") {
      this.gameState = "PAUSED";
      if (this.bossAttackTimer) this.bossAttackTimer.paused = true;
      this.tweens.pauseAll();
      
      this.pauseOverlayBg.setVisible(true);
      this.pauseText.setVisible(true);
      this.resumeBtn.setVisible(true);
      this.resumeText.setVisible(true);
    } else if (this.gameState === "PAUSED") {
      this.gameState = "PLAYING";
      if (this.bossAttackTimer) this.bossAttackTimer.paused = false;
      this.tweens.resumeAll();

      this.pauseOverlayBg.setVisible(false);
      this.pauseText.setVisible(false);
      this.resumeBtn.setVisible(false);
      this.resumeText.setVisible(false);
    }
  }

  createHUD(w, h) {
    // ===== PLAYER PANEL (left) =====
    this.add.rectangle(140, 22, 260, 36, 0x000000, 0.65).setStrokeStyle(1, 0x3b82f6, 0.5).setOrigin(0.5);
    this.add.text(16, 14, hasSwordLabel(this.playerStats), { fontFamily: "Cinzel, serif", fontSize: "11px", color: "#60a5fa" }).setOrigin(0, 0.5);
    this.add.rectangle(175, 14, 140, 12, 0x1a0b38).setStrokeStyle(1, 0x3b82f6, 0.3);
    this.playerHPBar = this.add.rectangle(106, 14, 138, 8, 0x22c55e).setOrigin(0, 0.5);
    this.playerHPText = this.add.text(175, 14, `${this.playerHP}/${this.playerStats.maxHP}`, { fontFamily: "Inter, sans-serif", fontSize: "9px", color: "#fff", fontStyle: "bold" }).setOrigin(0.5);

    // Stats row
    this.add.text(16, 34, `ATK ${this.playerStats.attack}`, { fontFamily: "Inter, sans-serif", fontSize: "9px", color: "#fbbf24" });
    this.add.text(80, 34, `DEF ${this.playerStats.defense}`, { fontFamily: "Inter, sans-serif", fontSize: "9px", color: "#60a5fa" });
    if (this.playerStats.swordCount > 0) this.add.text(140, 34, `🗡️×${this.playerStats.swordCount}`, { fontFamily: "Inter, sans-serif", fontSize: "9px", color: "#c084fc" });
    if (this.playerStats.shieldCount > 0) this.add.text(190, 34, `🛡️×${this.playerStats.shieldCount}`, { fontFamily: "Inter, sans-serif", fontSize: "9px", color: "#c084fc" });
    if (this.playerStats.hasCrown) this.add.text(240, 34, `👑`, { fontFamily: "Inter, sans-serif", fontSize: "9px", color: "#fbbf24" });

    // ===== BOSS PANEL (right) =====
    this.add.rectangle(w - 140, 22, 260, 36, 0x000000, 0.65).setStrokeStyle(1, 0xef4444, 0.5).setOrigin(0.5);
    this.add.text(w - 268, 14, `🐉 ${BOSS_STATS.name.toUpperCase()}`, { fontFamily: "Cinzel, serif", fontSize: "11px", color: "#f87171" }).setOrigin(0, 0.5);
    this.add.rectangle(w - 105, 14, 140, 12, 0x1a0b38).setStrokeStyle(1, 0xef4444, 0.3);
    this.bossHPBar = this.add.rectangle(w - 174, 14, 138, 8, 0xef4444).setOrigin(0, 0.5);
    this.bossHPText = this.add.text(w - 105, 14, `${this.bossHP}/${BOSS_STATS.maxHP}`, { fontFamily: "Inter, sans-serif", fontSize: "9px", color: "#fff", fontStyle: "bold" }).setOrigin(0.5);
    this.add.text(w - 268, 34, `ATK ${BOSS_STATS.attack}  DEF ${BOSS_STATS.defense}`, { fontFamily: "Inter, sans-serif", fontSize: "9px", color: "#f87171" });

    // ===== PAUSE BUTTON =====
    const pauseBtnBg = this.add.rectangle(w / 2, 22, 40, 36, 0x000000, 0.65).setStrokeStyle(1, 0x6b5b8a, 0.5).setInteractive({ useHandCursor: true });
    this.add.text(w / 2, 22, "⏸️", { fontSize: "16px" }).setOrigin(0.5);
    pauseBtnBg.on("pointerdown", () => this.togglePause());
  }

  createButtons(w, h, hasSword) {
    const btnY = h - 55;
    const btnWidth = 140;
    const btnHeight = 38;

    // ATTACK button
    const atkLabel = hasSword ? "⚔️ SLASH" : "👊 PUNCH";
    const atkBg = this.add.rectangle(w / 2 - 80, btnY, btnWidth, btnHeight, 0xb8860b, 0.9).setStrokeStyle(2, 0xffd700).setInteractive({ useHandCursor: true });
    this.atkLabel = this.add.text(w / 2 - 80, btnY, atkLabel, { fontFamily: "Cinzel, serif", fontSize: "13px", color: "#0a0118", fontStyle: "bold" }).setOrigin(0.5);

    atkBg.on("pointerdown", () => this.playerAttack());
    atkBg.on("pointerover", () => { atkBg.setFillStyle(0xffd700, 1); });
    atkBg.on("pointerout", () => { atkBg.setFillStyle(0xb8860b, 0.9); });

    // DEFEND button
    const defLabel = this.playerStats.shieldCount > 0 ? "🛡️ BLOCK" : "🙅 DODGE";
    const defBg = this.add.rectangle(w / 2 + 80, btnY, btnWidth, btnHeight, 0x1e3a5f, 0.9).setStrokeStyle(2, 0x3b82f6).setInteractive({ useHandCursor: true });
    this.defLabel = this.add.text(w / 2 + 80, btnY, defLabel, { fontFamily: "Cinzel, serif", fontSize: "13px", color: "#93c5fd", fontStyle: "bold" }).setOrigin(0.5);

    defBg.on("pointerdown", () => this.playerDefend());
    defBg.on("pointerover", () => { defBg.setFillStyle(0x2563eb, 1); });
    defBg.on("pointerout", () => { defBg.setFillStyle(0x1e3a5f, 0.9); });
  }

  playerAttack() {
    if (this.gameState !== "PLAYING" || !this.canAttack) return;
    this.canAttack = false;
    this.isDefending = false;

    const damage = calculateDamage(this.playerStats.attack, BOSS_STATS.defense);
    this.bossHP = Math.max(0, this.bossHP - damage);
    const hasSword = this.playerStats.swordCount > 0;

    const targets = [this.player, this.swordOverlay, this.shieldOverlay].filter(Boolean);
    this.tweens.add({ targets, x: "+=70", duration: 150, yoyo: true, ease: "Power2" });

    // Swap to attacking sprite
    this.player.setTexture(hasSword ? "player-attacking" : "player-punching");
    this.time.delayedCall(300, () => {
      // Revert sprite when done
      this.player.setTexture(hasSword ? "player-armed" : "player-unarmed");
    });

    if (hasSword) {
      // Position slash effect at the end of the sword
      this.slashEffect.setPosition(this.player.x + 80, this.player.y);
      // Make it smaller and visible
      this.slashEffect.setDisplaySize(80, 80); 
      this.slashEffect.setAlpha(1);
      this.slashEffect.setAngle(0);
      this.slashEffect.setScale(1);

      this.tweens.add({ 
        targets: this.slashEffect, 
        x: this.boss.x - 30, // Travel to boss
        scaleX: 1.2, 
        scaleY: 1.2, 
        alpha: 0, 
        angle: 45, 
        duration: 250, 
        ease: "Power2" 
      });
    }

    this.time.delayedCall(120, () => {
      this.boss.setTint(0xffffff);
      this.time.delayedCall(60, () => {
        this.boss.setTint(0xff4444);
        this.time.delayedCall(100, () => this.boss.clearTint());
      });
      this.tweens.add({ targets: this.boss, x: "+=20", duration: 80, yoyo: true, ease: "Power1" });
    });

    this.cameras.main.shake(120, 0.006);
    this.showDamageText(this.boss.x, this.boss.y - 90, `-${damage}`, "#ef4444");
    this.updateBossHP();

    const verb = hasSword ? "slash" : "punch";
    this.updateCombatLog(`You ${verb} the Dragon for ${damage} damage!`);

    if (this.bossHP <= 0) {
      this.handleVictory();
      return;
    }
    this.time.delayedCall(this.attackCooldown, () => { this.canAttack = true; });
  }

  playerDefend() {
    if (this.gameState !== "PLAYING") return;
    this.isDefending = true;
    const hasShield = this.playerStats.shieldCount > 0;

    if (hasShield) {
      this.shieldBarrier.setAlpha(0.7).setScale(0.5);
      this.tweens.add({ targets: this.shieldBarrier, scaleX: 1.1, scaleY: 1.1, alpha: 0, duration: 800, ease: "Power2" });
      this.updateCombatLog("You raise your shield! 🛡️ Next attack will be blocked!");
    } else {
      const targets = [this.player, this.swordOverlay, this.shieldOverlay].filter(Boolean);
      this.tweens.add({ targets, x: "-=30", duration: 200, yoyo: true, ease: "Power2" });
      this.updateCombatLog("You prepare to dodge! Next attack damage reduced.");
    }
  }

  bossAttack() {
    if (this.gameState !== "PLAYING") return;

    let dmg = calculateDamage(BOSS_STATS.attack, this.playerStats.defense);

    // Swap to attacking texture and face left
    this.boss.setTexture("fire-breath");
    this.boss.setFlipX(true);
    this.time.delayedCall(400, () => {
      // Revert texture and face left (default)
      this.boss.setTexture("boss");
      this.boss.setFlipX(false);
    });

    this.tweens.add({ targets: this.boss, x: "-=40", duration: 200, yoyo: true, ease: "Power2" });

    if (this.isDefending) {
      dmg = Math.round(dmg * 0.35);
      this.isDefending = false;
      if (this.playerStats.shieldCount > 0) {
        this.shieldBarrier.setAlpha(0.8).setScale(0.8);
        this.tweens.add({ targets: this.shieldBarrier, scaleX: 1.3, scaleY: 1.3, alpha: 0, duration: 500, ease: "Power2" });
        this.updateCombatLog(`🛡️ Shield blocks fire! Only ${dmg} damage taken.`);
      } else {
        this.updateCombatLog(`🙅 Dodged partially! Only ${dmg} damage taken.`);
      }
    } else {
      this.updateCombatLog(`🔥 Dragon breathes fire! ${dmg} damage!`);
    }

    this.playerHP = Math.max(0, this.playerHP - dmg);
    this.damageTaken += dmg; // track damage for rewards

    this.time.delayedCall(350, () => {
      this.player.setTint(0xff4444);
      this.time.delayedCall(150, () => this.player.clearTint());
      this.cameras.main.shake(180, 0.008);
      this.showDamageText(this.player.x, this.player.y - 80, `-${dmg}`, "#f87171");
      this.updatePlayerHP();

      if (this.playerHP <= 0) {
        this.handleDefeat();
      }
    });
  }

  showDamageText(x, y, text, color) {
    const dmg = this.add.text(x, y, text, { fontFamily: "Cinzel, serif", fontSize: "24px", color, fontStyle: "bold", stroke: "#000", strokeThickness: 4 }).setOrigin(0.5).setDepth(10);
    this.tweens.add({ targets: dmg, y: y - 60, alpha: 0, duration: 1000, ease: "Power2", onComplete: () => dmg.destroy() });
  }

  updatePlayerHP() {
    const ratio = this.playerHP / this.playerStats.maxHP;
    this.playerHPBar.scaleX = Math.max(0, ratio);
    this.playerHPText.setText(`${this.playerHP}/${this.playerStats.maxHP}`);
    if (ratio <= 0.25) this.playerHPBar.setFillStyle(0xef4444);
    else if (ratio <= 0.5) this.playerHPBar.setFillStyle(0xf59e0b);
  }

  updateBossHP() {
    const ratio = this.bossHP / BOSS_STATS.maxHP;
    this.bossHPBar.scaleX = Math.max(0, ratio);
    this.bossHPText.setText(`${this.bossHP}/${BOSS_STATS.maxHP}`);
  }

  updateCombatLog(msg) {
    this.combatLog.setText(msg);
    this.tweens.add({ targets: this.combatLog, alpha: 0.5, duration: 80, yoyo: true });
  }

  handleVictory() {
    this.gameState = "OVER";
    if (this.bossAttackTimer) this.bossAttackTimer.remove();
    this.timeTakenMs = this.time.now - this.startTime;

    this.tweens.add({ targets: this.boss, alpha: 0, scaleX: 2, scaleY: 2, angle: 15, duration: 800, ease: "Power2" });

    const victoryText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, "🎉 VICTORY!", {
      fontFamily: "Cinzel, serif", fontSize: "36px", color: "#ffd700", fontStyle: "bold", stroke: "#000", strokeThickness: 5,
    }).setOrigin(0.5).setDepth(20).setAlpha(0);

    this.tweens.add({ targets: victoryText, alpha: 1, scaleX: 1.2, scaleY: 1.2, duration: 500, yoyo: true, repeat: 1, ease: "Back.easeOut" });

    this.updateCombatLog("🎉 VICTORY! The Dark Dragon has been slain!");
    this.time.delayedCall(2000, () => {
      this.game.events.emit("gameOver", { 
        won: true, 
        damageTaken: this.damageTaken,
        timeTakenMs: this.timeTakenMs
      });
    });
  }

  handleDefeat() {
    this.gameState = "OVER";
    if (this.bossAttackTimer) this.bossAttackTimer.remove();
    this.timeTakenMs = this.time.now - this.startTime;

    const targets = [this.player, this.swordOverlay, this.shieldOverlay].filter(Boolean);
    this.tweens.add({ targets, alpha: 0.3, angle: 90, y: "+=40", duration: 600, ease: "Power2" });

    const defeatText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, "💀 DEFEAT", {
      fontFamily: "Cinzel, serif", fontSize: "36px", color: "#ef4444", fontStyle: "bold", stroke: "#000", strokeThickness: 5,
    }).setOrigin(0.5).setDepth(20).setAlpha(0);

    this.tweens.add({ targets: defeatText, alpha: 1, duration: 600, ease: "Power2" });

    this.updateCombatLog("💀 DEFEAT! The Dragon has won...");
    this.time.delayedCall(2500, () => {
      this.game.events.emit("gameOver", { 
        won: false,
        damageTaken: this.damageTaken,
        timeTakenMs: this.timeTakenMs
      });
    });
  }
}

function hasSwordLabel(stats) {
  if (stats.hasCrown) return "👑 CHAMPION";
  if (stats.swordCount > 0) return "⚔️ WARRIOR";
  return "👊 FIGHTER";
}
