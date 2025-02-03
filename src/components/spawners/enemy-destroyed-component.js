import * as CONFIG from '../../config.js';

export class VerticalMovementComponent {
  #gameObject;
  #inputComponent;
  #velocity;

  constructor(gameObject, inputComponent, velocity) {
    this.#gameObject = gameObject;
    this.#inputComponent = inputComponent;
    this.#velocity = velocity;

    // Schakel demping in voor een vloeiende beweging
    this.#gameObject.body.setDamping(true);
    // Stel de drag en maximale verticale snelheid in via de config
    this.#gameObject.body.setDrag(CONFIG.COMPONENT_MOVEMENT_VERTICAL_DRAG);
    this.#gameObject.body.setMaxVelocity(CONFIG.COMPONENT_MOVEMENT_VERTICAL_MAX_VELOCITY);
  }

  reset() {
    // Reset de verticale snelheid en angular acceleration
    this.#gameObject.body.velocity.y = 0;
    this.#gameObject.body.setAngularAcceleration(0);
  }

  update() {
    // Als de "down" input actief is, verhoog de verticale snelheid
    if (this.#inputComponent.downIsDown) {
      this.#gameObject.body.velocity.y += this.#velocity;
    }
    // Als de "up" input actief is, verlaag de verticale snelheid
    else if (this.#inputComponent.upIsDown) {
      this.#gameObject.body.velocity.y -= this.#velocity;
    }
    // Geen input: reset de angular acceleration
    else {
      this.#gameObject.body.setAngularAcceleration(0);
    }
  }
}
