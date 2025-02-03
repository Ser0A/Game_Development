import { CUSTOM_EVENTS } from '../../components/events/event-bus-component.js';
import * as CONFIG from '../../config.js';

export class Lives extends Phaser.GameObjects.Container {
  #lives;
  #eventBusComponent;

  constructor(scene, eventBusComponent) {
    // Plaats deze container links onderin
    super(scene, 5, scene.scale.height - 30, []);
    this.#eventBusComponent = eventBusComponent;
    this.#lives = CONFIG.PLAYER_LIVES;
    this.scene.add.existing(this);

    // Voeg een icoon toe voor elke extra leven
    for (let i = 0; i < this.#lives; i += 1) {
      const ship = scene.add
        .image(i * 20, 0, 'ship')
        .setScale(0.6)
        .setOrigin(0);
      this.add(ship);
    }

    // Wanneer de speler wordt vernietigd
    this.#eventBusComponent.on(CUSTOM_EVENTS.PLAYER_DESTROYED, () => {
      this.#lives -= 1;
      // Verwijder het laatste levensicoon
      this.getAt(this.#lives).destroy();

      if (this.#lives > 0) {
        // Als er nog levens over zijn, spawn de speler na 1,5 sec
        scene.time.delayedCall(1500, () => {
          this.#eventBusComponent.emit(CUSTOM_EVENTS.PLAYER_SPAWN);
        });
        return;
      }

      // Geen levens meer: toon GAME OVER in het midden van het scherm
      this.scene.add
        .text(this.scene.scale.width / 2, this.scene.scale.height / 2, 'GAME OVER', {
          fontSize: '24px',
        })
        .setOrigin(0.5);

      // Geef aan dat het spel voorbij is
      this.#eventBusComponent.emit(CUSTOM_EVENTS.GAME_OVER);
    });

    // Begin met het spawnen van de speler
    this.#eventBusComponent.emit(CUSTOM_EVENTS.PLAYER_SPAWN);
  }
}
