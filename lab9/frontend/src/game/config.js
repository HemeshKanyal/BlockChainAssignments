import Phaser from "phaser";
import PreloadScene from "./scenes/PreloadScene";
import StoryScene from "./scenes/StoryScene";
import BossScene from "./scenes/BossScene";

export function createGameConfig(parentElement) {
  return {
    type: Phaser.AUTO,
    parent: parentElement,
    width: 800,
    height: 500,
    backgroundColor: "#050010",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 0 },
        debug: false,
      },
    },
    scene: [PreloadScene, StoryScene, BossScene],
    render: {
      pixelArt: false,
      antialias: true,
    },
  };
}
