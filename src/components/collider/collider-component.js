import { CUSTOM_EVENTS } from '../events/event-bus-component.js';

export class ColliderComponent {
  #healthComponent;
  #eventBusComponent;

  constructor(healthComponent, eventBusComponent) {
    // Bewaar de health component en event bus voor latere referentie
    this.#healthComponent = healthComponent;
    this.#eventBusComponent = eventBusComponent;
  }

  // Wordt aangeroepen bij een botsing met een vijandelijk schip
  collideWithEnemyShip() {
    // Als het object al dood is, doe niets
    if (this.#healthComponent.isDead) {
      return;
    }
    // Maak het object dood
    this.#healthComponent.die();
  }

  // Wordt aangeroepen bij een botsing met een vijandelijk projectiel
  collideWithEnemyProjectile() {
    // Als het object al dood is, doe niets
    if (this.#healthComponent.isDead) {
      return;
    }
    // Verminder de gezondheid van het object
    this.#healthComponent.hit();
    // Zend een event dat het schip geraakt is
    this.#eventBusComponent.emit(CUSTOM_EVENTS.SHIP_HIT);
  }
}
