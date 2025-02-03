import * as CONFIG from '../../config.js';

export class HorizontalMovementComponent {
  #gameObject;
  #inputComponent;
  #velocity;

  constructor(gameObject, inputComponent, velocity) {
    this.#gameObject = gameObject;
    this.#inputComponent = inputComponent;
    this.#velocity = velocity;

    // Schakel demping in en stel de horizontale drag en max snelheid in
    this.#gameObject.body.setDamping(true);
    this.#gameObject.body.setDrag(CONFIG.COMPONENT_MOVEMENT_HORIZONTAL_DRAG);
    this.#gameObject.body.setMaxVelocity(CONFIG.COMPONENT_MOVEMENT_HORIZONTAL_MAX_VELOCITY);
  }

  reset() {
    // Reset de horizontale snelheid en angular acceleration
    this.#gameObject.body.velocity.x = 0;
    this.#gameObject.body.setAngularAcceleration(0);
  }

  update() {
    // Pas de snelheid aan op basis van de input
    if (this.#inputComponent.leftIsDown) {
      this.#gameObject.body.velocity.x -= this.#velocity;
    } else if (this.#inputComponent.rightIsDown) {
      this.#gameObject.body.velocity.x += this.#velocity;
    } else {
      // Geen input: reset angular acceleration
      this.#gameObject.body.setAngularAcceleration(0);
    }
  }
}
