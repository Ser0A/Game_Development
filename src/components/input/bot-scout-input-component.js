import { InputComponent } from './input-component.js';
import * as CONFIG from '../../config.js';

export class BotScoutInputComponent extends InputComponent {
  #gameObject;
  #startX;
  #maxXMovement;

  constructor(gameObject) {
    super();
    // Bewaar het gameObject en sla de startpositie (x) op
    this.#gameObject = gameObject;
    this.#startX = this.#gameObject.x;
    // Stel de maximale horizontale beweging in vanuit de config
    this.#maxXMovement = CONFIG.ENEMY_SCOUT_MOVEMENT_MAX_X;
    // Zet de initiële richting: beweeg naar rechts en naar beneden
    this._right = true;
    this._down = true;
    this._left = false;
  }

  // Setter om de startX-waarde eventueel bij te werken
  set startX(val) {
    this.#startX = val;
  }

  update() {
    // Als het object verder naar rechts beweegt dan toegestaan, ga dan naar links
    if (this.#gameObject.x > this.#startX + this.#maxXMovement) {
      this._left = true;
      this._right = false;
    }
    // Als het object verder naar links beweegt dan toegestaan, ga dan naar rechts
    else if (this.#gameObject.x < this.#startX - this.#maxXMovement) {
      this._left = false;
      this._right = true;
    }
  }
}
