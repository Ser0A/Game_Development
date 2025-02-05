import { ColliderComponent } from '../components/collider/collider-component.js';
import { CUSTOM_EVENTS } from '../components/events/event-bus-component.js';

export class HealthUp extends Phaser.GameObjects.Container {
  #eventBusComponent;
  #colliderComponent;
  #sprite;

  constructor(scene, x, y) {
    super(scene, x, y, []);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    console.log("✅ HealthUp sprite aangemaakt op", x, y);

    // ✅ Voeg de sprite toe en pas de grootte aan
    this.#sprite = scene.add.sprite(0, 0, 'healthup');
    this.#sprite.setScale(0.08); // 🔹 Pas de grootte aan (maak even groot als vijanden)
    this.#sprite.setVisible(true);
    this.add(this.#sprite);

    // ✅ Collider instellen voor correcte detectie
    this.body.setSize(20, 20); // 🔹 Kleinere hitbox voor betere detectie
    this.body.setOffset(-10, -10);
    this.body.setVelocityY(100); // Power-up beweegt naar beneden

    // ✅ Event-handler voor update
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
    });
  }

  // ✅ Initialiseer de HealthUp met een eventBus component
  init(eventBusComponent) {
    this.#eventBusComponent = eventBusComponent;
    this.#colliderComponent = new ColliderComponent(null, this.#eventBusComponent);
    this.#eventBusComponent.emit(CUSTOM_EVENTS.POWERUP_SPAWNED, this);
  }

  // ✅ Reset de HealthUp voor hergebruik
  reset(x, y) {
    this.setActive(true);
    this.setVisible(true);
    this.setPosition(x, y);
  }

  update() {
    if (!this.active) return;

    // ✅ Verwijder de power-up als hij buiten het scherm valt
    if (this.y > this.scene.scale.height) {
      console.log("❌ HealthUp verdwenen uit beeld, wordt verwijderd.");
      this.destroy();
    }
  }
}
