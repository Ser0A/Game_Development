export class HealthComponent {
  #startingLife; // Beginlevens
  #currentLife;  // Huidige levens
  #isDead;       // Status of dood of niet

  constructor(life) {
    // Stel de initiële levens in
    this.#startingLife = life;
    this.#currentLife = life;
    this.#isDead = false;
  }

  // Geeft de huidige levens terug
  get life() {
    return this.#currentLife;
  }

  // Geeft true terug als het object dood is
  get isDead() {
    return this.#isDead;
  }

  // Reset de gezondheid naar de oorspronkelijke waarde
  reset() {
    this.#currentLife = this.#startingLife;
    this.#isDead = false;
  }

  // Verminder het leven met 1 en markeer als dood als de levens op zijn
  hit() {
    if (this.#isDead) {
      return;
    }

    this.#currentLife -= 1;
    if (this.#currentLife <= 0) {
      this.#isDead = true;
    }
  }

  // Maak het object direct dood
  die() {
    this.#currentLife = 0;
    this.#isDead = true;
  }
}
