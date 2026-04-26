import Phaser from "phaser";

export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: "PreloadScene" });
  }

  preload() {
    // Loading bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const barBg = this.add.rectangle(width / 2, height / 2, 320, 24, 0x1a0b38);
    barBg.setStrokeStyle(1, 0xa855f7);
    const barFill = this.add.rectangle(width / 2 - 155, height / 2, 0, 18, 0xffd700);
    barFill.setOrigin(0, 0.5);

    this.add.text(width / 2, height / 2 - 40, "PREPARING ARENA...", {
      fontFamily: "Cinzel, serif",
      fontSize: "16px",
      color: "#a89cc8",
      letterSpacing: 4,
    }).setOrigin(0.5);

    this.load.on("progress", (value) => {
      barFill.width = 310 * value;
    });

    // Load assets — characters
    this.load.image("arena-bg", "/assets/arena-bg.png");
    this.load.image("player-armed", "/assets/player-with sword.png");
    this.load.image("player-unarmed", "/assets/player-withoutsword.png");
    this.load.image("player-attacking", "/assets/player-attacking.png");
    this.load.image("player-punching", "/assets/player-punching.png");
    this.load.image("boss", "/assets/boss.png");

    // Items
    this.load.image("sword-icon", "/assets/sword.png");
    this.load.image("shield-icon", "/assets/shield.png");
    this.load.image("gold-icon", "/assets/gold.png");

    // Effects
    this.load.image("slash-effect", "/assets/slash.png");
    this.load.image("fire-breath", "/assets/boss-fire.png");
    this.load.image("shield-effect", "/assets/shield-effect.png");
  }

  create() {
    this.scene.start("StoryScene");
  }
}
