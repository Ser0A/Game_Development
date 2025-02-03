import Phaser from '../lib/phaser.js';

// BootScene: Laadt eerste data en start de volgende scene
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' }); // Unieke key voor deze scene
  }

  preload() {
    // Laad de JSON met animatiegegevens
    this.load.json('animations_json', 'assets/data/animations.json');
  }

  create() {
    // Start de PreloadScene zodra preload klaar is
    this.scene.start('PreloadScene');
  }
}
