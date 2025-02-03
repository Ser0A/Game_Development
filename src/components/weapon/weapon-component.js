import { CUSTOM_EVENTS } from '../events/event-bus-component.js';

export class WeaponComponent {
  #gameObject;          // Het object dat schiet (bijv. een schip)
  #inputComponent;       // Input-component die schiet-input bijhoudt
  #bulletGroup;          // Groep met bullets (bullet pool)
  #fireBulletInterval;   // Timer voor de volgende schot
  #bulletConfig;         // Configuratie voor de bullets (snelheid, interval, etc.)
  #eventBusComponent;    // Event bus voor communicatie tussen componenten

  constructor(gameObject, inputComponent, bulletConfig, eventBusComponent) {
    this.#gameObject = gameObject;
    this.#inputComponent = inputComponent;
    this.#bulletConfig = bulletConfig;
    this.#eventBusComponent = eventBusComponent;
    this.#fireBulletInterval = 0;

    // Maak een groep (pool) aan voor de bullets
    this.#bulletGroup = this.#gameObject.scene.physics.add.group({
      name: `bullets-${Phaser.Math.RND.uuid()}`,
      enable: false,
    });
    // Voeg meerdere bullets toe aan de pool
    this.#bulletGroup.createMultiple({
      key: 'bullet',
      quantity: this.#bulletConfig.maxCount,
      active: false,
      visible: false,
    });

    // Luister naar elke physics step om bullets te updaten (bv. hun levensduur)
    this.#gameObject.scene.physics.world.on(Phaser.Physics.Arcade.Events.WORLD_STEP, this.worldStep, this);
    // Verwijder de event listener wanneer het gameObject wordt vernietigd
    this.#gameObject.once(
      Phaser.GameObjects.Events.DESTROY,
      () => {
        this.#gameObject.scene.physics.world.off(Phaser.Physics.Arcade.Events.WORLD_STEP, this.worldStep, this);
      },
      this
    );
  }

  // Geef de bullet group terug zodat andere componenten er eventueel toegang toe hebben
  get bulletGroup() {
    return this.#bulletGroup;
  }

  // Update-functie die elke frame wordt aangeroepen
  update(dt) {
    // Verminder de timer voor het volgende schot
    this.#fireBulletInterval -= dt;
    if (this.#fireBulletInterval > 0) {
      return;
    }

    // Als de schietknop ingedrukt is...
    if (this.#inputComponent.shootIsDown) {
      // Haal een beschikbare (dode) bullet uit de pool
      const bullet = this.#bulletGroup.getFirstDead();
      if (bullet === undefined || bullet === null) {
        return;
      }

      // Stel de positie van de bullet in op basis van het gameObject
      const x = this.#gameObject.x;
      const y = this.#gameObject.y + this.#bulletConfig.yOffset;
      // Activeer de bullet en zet hem in beeld
      bullet.enableBody(true, x, y, true, true);
      // Geef de bullet een snelheid (richting omhoog)
      bullet.body.velocity.y -= this.#bulletConfig.speed;
      // Stel de levensduur van de bullet in (wordt in worldStep afgetrokken)
      bullet.setState(this.#bulletConfig.lifespan);
      // Speel de bullet-animatie af
      bullet.play('bullet');
      // Pas de schaal en grootte van de bullet aan
      bullet.setScale(0.8);
      bullet.body.setSize(14, 18);
      // Indien nodig, draai de bullet (bijv. voor schiet richting)
      bullet.setFlipY(this.#bulletConfig.flipY);

      // Reset de timer voor het volgende schot
      this.#fireBulletInterval = this.#bulletConfig.interval;
      // Zend een event dat er geschoten is
      this.#eventBusComponent.emit(CUSTOM_EVENTS.SHIP_SHOOT);
    }
  }

  // Deze functie wordt elke physics-step aangeroepen
  worldStep(delta) {
    // Loop door alle bullets in de groep
    this.#bulletGroup.getChildren().forEach((bullet) => {
      if (!bullet.active) {
        return;
      }

      // Verminder de 'state' (levensduur) van de bullet met de verstreken tijd
      bullet.state -= delta;
      // Als de levensduur op is, deactiveer en verberg de bullet
      if (bullet.state <= 0) {
        bullet.disableBody(true, true);
      }
    });
  }

  // Methode om een bullet direct te vernietigen (bijv. bij een botsing)
  destroyBullet(bullet) {
    bullet.setState(0);
  }
}
