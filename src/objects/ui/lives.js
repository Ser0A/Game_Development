import { CUSTOM_EVENTS } from '../../components/events/event-bus-component.js';
import * as CONFIG from '../../config.js';

export class Lives extends Phaser.GameObjects.Container {
  #lives;
  #eventBusComponent;
  #icons;

  constructor(scene, eventBusComponent) {
    super(scene, 5, scene.scale.height - 30, []);
    this.#eventBusComponent = eventBusComponent;
    this.#lives = CONFIG.PLAYER_LIVES;
    this.scene.add.existing(this);

    this.#icons = [];

    // Voeg een icoon toe voor elke extra leven
    for (let i = 0; i < this.#lives; i += 1) {
      const ship = scene.add
        .image(i * 20, 0, 'ship')
        .setScale(0.6)
        .setOrigin(0);
      this.add(ship);
      this.#icons.push(ship);
    }

    // ✅ Event voor speler verlies
    this.#eventBusComponent.on(CUSTOM_EVENTS.PLAYER_DESTROYED, () => {
      this.loseLife();
    });

    // ✅ Speler begint direct
    this.#eventBusComponent.emit(CUSTOM_EVENTS.PLAYER_SPAWN);
  }

  // ✅ Geeft het aantal huidige levens terug
  getLives() {
    return this.#lives;
  }

  // ✅ Vermindert een leven en verwijdert het laatste icoon
  loseLife() {
    if (this.#lives > 0) {
      this.#lives -= 1;
      console.log("⚠️ Leven verloren! Huidige levens:", this.#lives);

      if (this.#icons.length > 0) {
        const lastIcon = this.#icons.pop();
        lastIcon.destroy();
      }

      if (this.#lives > 0) {
        this.scene.time.delayedCall(1500, () => {
          this.#eventBusComponent.emit(CUSTOM_EVENTS.PLAYER_SPAWN);
        });
        return;
      }

      this.scene.add
        .text(this.scene.scale.width / 2, this.scene.scale.height / 2, 'GAME OVER', {
          fontSize: '24px',
        })
        .setOrigin(0.5);

      this.#eventBusComponent.emit(CUSTOM_EVENTS.GAME_OVER);
    }
  }

  // ✅ Voegt een leven toe en spawnt een nieuw icoon
  gainLife() {
    if (this.#lives < CONFIG.PLAYER_LIVES) {
      this.#lives += 1;
      console.log("✅ HealthUp opgepakt! Huidige levens:", this.#lives);

      const ship = this.scene.add
        .image(this.#icons.length * 20, 0, 'ship')
        .setScale(0.6)
        .setOrigin(0);
      this.add(ship);
      this.#icons.push(ship);
    }
  }
}
