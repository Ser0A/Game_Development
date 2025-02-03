import Phaser from './lib/phaser.js';
import { BootScene } from './scenes/boot-scene.js';
import { GameScene } from './scenes/game-scene.js';
import { PreloadScene } from './scenes/preload-scene.js';

// Maak een nieuw Phaser-spel
const game = new Phaser.Game({
  type: Phaser.CANVAS, // Gebruik canvas
  roundPixels: true, // Ronde pixels voor scherpe weergave
  pixelArt: true, // Houd pixel art stijl
  scale: {
    parent: 'game-container', // HTML container
    width: 450, // Spelbreedte
    height: 640, // Spelhoogte
    autoCenter: Phaser.Scale.CENTER_BOTH, // Centreer het spel
    mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH, // Pas breedte aan op hoogte
  },
  backgroundColor: '#000000', // Achtergrondkleur
  physics: {
    default: 'arcade', // Gebruik Arcade physics
    arcade: {
      gravity: { y: 0, x: 0 }, // Geen zwaartekracht
      debug: false, // Debug uit
    },
  },
});

// Voeg scenes toe
game.scene.add('BootScene', BootScene);
game.scene.add('PreloadScene', PreloadScene);
game.scene.add('GameScene', GameScene);

// Start met de BootScene
game.scene.start('BootScene');
