import Phaser from "phaser";

export default class StoryScene extends Phaser.Scene {
  constructor() {
    super({ key: "StoryScene" });
  }

  create() {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    // Dark background
    this.add.rectangle(w / 2, h / 2, w, h, 0x050010);

    const storyText = [
      "The Blockchain is in peril...",
      "",
      "A fearsome Dark Dragon has hoarded the legendary artifacts",
      "deep within the Sepolia dungeons.",
      "",
      "Only a true Champion can defeat the beast,",
      "reclaim the realm's Gold, and forge the ultimate Trophy.",
      "",
      "Prove your worth. The arena awaits."
    ];

    const textObj = this.add.text(w / 2, h / 2 - 40, storyText.join("\n"), {
      fontFamily: "Cinzel, serif",
      fontSize: "18px",
      color: "#c9b8e8",
      align: "center",
      lineSpacing: 10,
    }).setOrigin(0.5).setAlpha(0);

    // Fade in text
    this.tweens.add({
      targets: textObj,
      alpha: 1,
      duration: 2000,
      ease: "Power2",
      onComplete: () => {
        // Show continue prompt after story is visible
        const continueText = this.add.text(w / 2, h - 50, "[ CLICK TO ENTER ARENA ]", {
          fontFamily: "Inter, sans-serif",
          fontSize: "14px",
          color: "#fbbf24",
          fontStyle: "bold",
          letterSpacing: 2,
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
          targets: continueText,
          alpha: 1,
          yoyo: true,
          repeat: -1,
          duration: 1000,
        });

        // Click anywhere to continue
        this.input.once("pointerdown", () => {
          this.cameras.main.fadeOut(800, 0, 0, 0);
          this.cameras.main.once("camerafadeoutcomplete", () => {
            this.scene.start("BossScene");
          });
        });
      }
    });
  }
}
