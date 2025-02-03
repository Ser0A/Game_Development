import { ColliderComponent } from '../../components/collider/collider-component.js';
import { CUSTOM_EVENTS } from '../../components/events/event-bus-component.js';
import { HealthComponent } from '../../components/health/health-component.js';
import { BotScoutInputComponent } from '../../components/input/bot-scout-input-component.js';
import { HorizontalMovementComponent } from '../../components/movement/horizontal-movement-component.js';
import { VerticalMovementComponent } from '../../components/movement/vertical-movement-component.js';
import * as CONFIG from '../../config.js';

export class ScoutEnemy extends Phaser.GameObjects.Container {
  #isInitialized;
  #inputComponent;
  #horizontalMovementComponent;
  #verticalMovementComponent;
  #healthComponent;
  #colliderComponent;
  #eventBusComponent;
  #shipSprite;
  #shipEngineSprite;

  constructor(scene, x, y) {
    // Plaats de enemy op de opgegeven positie
    super(scene, x, y, []);
    this.#isInitialized = false;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.body.setSize(24, 24);
    this.body.setOffset(-12, -12);

    // Voeg sprites toe voor het schip en de motor
    this.#shipSprite = scene.add.sprite(0, 0, 'scout', 0);
    this.#shipEngineSprite = scene.add.sprite(0, 0, 'scout_engine').setFlipY(true);
    this.#shipEngineSprite.play('scout_engine');
    this.add([this.#shipEngineSprite, this.#shipSprite]);

    // Registreer de update functie per frame
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    this.once(
      Phaser.GameObjects.Events.DESTROY,
      () => {
        this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
      },
      this
    );
  }

  // Maak de collider toegankelijk voor andere componenten
  get colliderComponent() {
    return this.#colliderComponent;
  }

  // Maak de health toegankelijk voor andere componenten
  get healthComponent() {
    return this.#healthComponent;
  }

  // Geeft de asset key van het schip
  get shipAssetKey() {
    return 'scout';
  }

  // Geeft de animatie key voor de vernietigingsanimatie
  get shipDestroyedAnimationKey() {
    return 'scout_destroy';
  }

  // Initialiseer de enemy met de benodigde componenten
  init(eventBusComponent) {
    this.#eventBusComponent = eventBusComponent;
    this.#inputComponent = new BotScoutInputComponent(this);
    this.#horizontalMovementComponent = new HorizontalMovementComponent(
      this,
      this.#inputComponent,
      CONFIG.ENEMY_SCOUT_MOVEMENT_HORIZONTAL_VELOCITY
    );
    this.#verticalMovementComponent = new VerticalMovementComponent(
      this,
      this.#inputComponent,
      CONFIG.ENEMY_SCOUT_MOVEMENT_VERTICAL_VELOCITY
    );
    this.#healthComponent = new HealthComponent(CONFIG.ENEMY_SCOUT_HEALTH);
    this.#colliderComponent = new ColliderComponent(this.#healthComponent, this.#eventBusComponent);
    // Meld de initialisatie aan de event bus
    this.#eventBusComponent.emit(CUSTOM_EVENTS.ENEMY_INIT, this);
    this.#isInitialized = true;
  }

  // Reset de enemy voor hergebruik
  reset() {
    this.setActive(true);
    this.setVisible(true);
    this.#healthComponent.reset();
    this.#inputComponent.startX = this.x;
    this.#verticalMovementComponent.reset();
    this.#horizontalMovementComponent.reset();
  }

  update(ts, dt) {
    if (!this.#isInitialized || !this.active) {
      return;
    }

    // Als de enemy dood is, verberg hem en stuur een event
    if (this.#healthComponent.isDead) {
      this.setActive(false);
      this.setVisible(false);
      this.#eventBusComponent.emit(CUSTOM_EVENTS.ENEMY_DESTROYED, this);
      return;
    }

    // Update input en beweging
    this.#inputComponent.update();
    this.#horizontalMovementComponent.update();
    this.#verticalMovementComponent.update();
  }
}
