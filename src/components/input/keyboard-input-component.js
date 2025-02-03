import { InputComponent } from './input-component.js';

export class KeyboardInputComponent extends InputComponent {
  #cursorKeys;    // Houdt de cursor toetsen bij (pijltjes en spatie)
  #inputLocked;   // Bepaalt of input tijdelijk uitgeschakeld is

  constructor(scene) {
    super();
    // Maak de cursor keys aan vanuit de scene
    this.#cursorKeys = scene.input.keyboard.createCursorKeys();
    this.#inputLocked = false;
  }

  // Zet input lock aan of uit
  set lockInput(val) {
    this.#inputLocked = val;
  }

  update() {
    // Als input vergrendeld is, reset de input en stop
    if (this.#inputLocked) {
      this.reset();
      return;
    }

    // Update de inputwaarden op basis van de status van de toetsen
    this._up = this.#cursorKeys.up.isDown;
    this._down = this.#cursorKeys.down.isDown;
    this._left = this.#cursorKeys.left.isDown;
    this._right = this.#cursorKeys.right.isDown;
    this._shoot = this.#cursorKeys.space.isDown;
  }
}
