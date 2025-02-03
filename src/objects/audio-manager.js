import { CUSTOM_EVENTS } from '../components/events/event-bus-component.js';

export class AudioManager {
  #scene;
  #eventBusComponent;

  constructor(scene, eventBusComponent) {
    this.#scene = scene;
    this.#eventBusComponent = eventBusComponent;

    // Speel achtergrondmuziek af
    this.#scene.sound.play('bg', {
      volume: 0.6,
      loop: true,
    });

    // Speel explosiegeluid als een vijand wordt vernietigd
    this.#eventBusComponent.on(CUSTOM_EVENTS.ENEMY_DESTROYED, () => {
      this.#scene.sound.play('explosion', {
        volume: 0.6,
      });
    });

    // Speel explosiegeluid als de speler wordt vernietigd
    this.#eventBusComponent.on(CUSTOM_EVENTS.PLAYER_DESTROYED, () => {
      this.#scene.sound.play('explosion', {
        volume: 0.6,
      });
    });

    // Speel 'hit' geluid als het schip geraakt wordt
    this.#eventBusComponent.on(CUSTOM_EVENTS.SHIP_HIT, () => {
      this.#scene.sound.play('hit', {
        volume: 0.6,
      });
    });

    // Speel schietgeluid af als het schip schiet
    this.#eventBusComponent.on(CUSTOM_EVENTS.SHIP_SHOOT, () => {
      this.#scene.sound.play('shot1', {
        volume: 0.05,
      });
    });
  }
}
