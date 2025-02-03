import { InputComponent } from './input-component.js';

export class BotFighterInputComponent extends InputComponent {
  constructor() {
    super();
    this._down = true;   // Zorgt ervoor dat de bot naar beneden beweegt
    this._shoot = true;  // Laat de bot schieten
  }

  update() {
    // Hier komt de update logica voor de bot
  }
}
