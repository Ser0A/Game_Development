export class InputComponent {
  // Variabelen voor input richting en schieten
  _up;
  _down;
  _left;
  _right;
  _shoot;

  constructor() {
    // Stel alle inputwaarden in op false bij het starten
    this.reset();
  }

  // Geeft aan of de linker richting is ingedrukt
  get leftIsDown() {
    return this._left;
  }

  // Geeft aan of de rechter richting is ingedrukt
  get rightIsDown() {
    return this._right;
  }

  // Geeft aan of de neer richting is ingedrukt
  get downIsDown() {
    return this._down;
  }

  // Geeft aan of de omhoog richting is ingedrukt
  get upIsDown() {
    return this._up;
  }

  // Geeft aan of de schietknop is ingedrukt
  get shootIsDown() {
    return this._shoot;
  }

  // Reset alle inputwaarden naar false
  reset() {
    this._up = false;
    this._down = false;
    this._left = false;
    this._right = false;
    this._shoot = false;
  }
}
