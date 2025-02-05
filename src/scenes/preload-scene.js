import Phaser from '../lib/phaser.js';

// Scene om assets voor te laden en animaties aan te maken
export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' }); // Stel de unieke key van deze scene in
  }

  preload() {
    // Laad de asset pack met de asset-data
    this.load.pack('asset_pack', 'assets/data/assets.json');

    this.load.pack('asset_pack', 'assets/data/assets.json');

    // Laad een extra afbeelding (life icon)
    this.load.image('lifeIcon', 'http://localhost:5500/assets/images/logo_zonder_tekst.png');
  }

  create() {
    // Maak de animaties aan en start daarna de GameScene
    this.#createAnimations();
    this.scene.start('GameScene');
  }

  // Private methode: Maakt animaties op basis van de JSON-data
  #createAnimations() {
    const data = this.cache.json.get('animations_json');
    data.forEach((animation) => {
      // Gebruik specifieke frames als die gegeven zijn, anders alle frames
      const frames = animation.frames
        ? this.anims.generateFrameNumbers(animation.assetKey, { frames: animation.frames })
        : this.anims.generateFrameNumbers(animation.assetKey);
      // Maak de animatie aan met de gegeven instellingen
      this.anims.create({
        key: animation.key,
        frames: frames,
        frameRate: animation.frameRate,
        repeat: animation.repeat,
      });
    });
  }
}
