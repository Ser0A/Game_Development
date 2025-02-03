import { ColliderComponent } from '../components/collider/collider-component.js';
import { CUSTOM_EVENTS } from '../components/events/event-bus-component.js';
import { HealthComponent } from '../components/health/health-component.js';
import { KeyboardInputComponent } from '../components/input/keyboard-input-component.js';
import { HorizontalMovementComponent } from '../components/movement/horizontal-movement-component.js';
import { WeaponComponent } from '../components/weapon/weapon-component.js';
import * as CONFIG from '../config.js';

export class Player extends Phaser.GameObjects.Container {
  // Private properties
  #keyboardInputComponent;
  #weaponComponent;
  #horizontalMovementComponent;
  #healthComponent;
  #colliderComponent;
  #eventBusComponent;
  #shipSprite;
  #shipEngineSprite;
  #shipEngineThrusterSprite;

  constructor(scene, eventBusComponent) {
    // Plaats de speler in het midden van de onderkant van het scherm
    super(scene, scene.scale.width / 2, scene.scale.height - 32, []);
    this.#eventBusComponent = eventBusComponent;

    // Voeg de container toe aan de scene en maak een physics body
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);
    this.body.setSize(24, 24);
    this.body.setOffset(-12, -12);
    this.body.setCollideWorldBounds(true);
    this.setDepth(2);

    // Maak en voeg de sprites voor de speler toe
    this.#shipSprite = scene.add.sprite(0, 0, 'ship');
    this.#shipEngineSprite = scene.add.sprite(0, 0, 'ship_engine');
    this.#shipEngineThrusterSprite = scene.add.sprite(0, 0, 'ship_engine_thruster');
    this.#shipEngineThrusterSprite.play('ship_engine_thruster');
    this.add([this.#shipEngineThrusterSprite, this.#shipEngineSprite, this.#shipSprite]);

    // Initialiseer input en beweging
    this.#keyboardInputComponent = new KeyboardInputComponent(this.scene);
    this.#horizontalMovementComponent = new HorizontalMovementComponent(
      this,
      this.#keyboardInputComponent,
      CONFIG.PLAYER_MOVEMENT_HORIZONTAL_VELOCITY
    );
    // Initialiseer wapensysteem
    this.#weaponComponent = new WeaponComponent(
      this,
      this.#keyboardInputComponent,
      {
        speed: CONFIG.PLAYER_BULLET_SPEED,
        interval: CONFIG.PLAYER_BULLET_INTERVAL,
        lifespan: CONFIG.PLAYER_BULLET_LIFESPAN,
        maxCount: CONFIG.PLAYER_BULLET_MAX_COUNT,
        yOffset: -20,
        flipY: false,
      },
      this.#eventBusComponent
    );
    // Initialiseer gezondheid en collider
    this.#healthComponent = new HealthComponent(CONFIG.PLAYER_HEALTH);
    this.#colliderComponent = new ColliderComponent(this.#healthComponent, this.#eventBusComponent);

    // Verberg speler totdat deze gespawned wordt
    this.#hide();
    // Luister naar spawn-event voor de speler
    this.#eventBusComponent.on(CUSTOM_EVENTS.PLAYER_SPAWN, this.#spawn, this);

    // Update de speler elke frame
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    // Verwijder de update listener bij destroy
    this.once(
      Phaser.GameObjects.Events.DESTROY,
      () => {
        this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
      },
      this
    );
  }

  // Exposeer collider-component voor externe toegang
  get colliderComponent() {
    return this.#colliderComponent;
  }

  // Exposeer health-component voor externe toegang
  get healthComponent() {
    return this.#healthComponent;
  }

  // Geef toegang tot de groep van de spelerprojectielen
  get weaponGameObjectGroup() {
    return this.#weaponComponent.bulletGroup;
  }

  // Exposeer weapon-component voor externe toegang
  get weaponComponent() {
    return this.#weaponComponent;
  }

  update(ts, dt) {
    if (!this.active) return;

    // Als de speler dood is, speel explosie en verberg de speler
    if (this.#healthComponent.isDead) {
      this.#hide();
      this.setVisible(true);
      this.#shipSprite.play({ key: 'explosion' });
      this.#eventBusComponent.emit(CUSTOM_EVENTS.PLAYER_DESTROYED);
      return;
    }

    // Update de sprite-frame op basis van de gezondheid
    this.#shipSprite.setFrame((CONFIG.PLAYER_HEALTH - this.#healthComponent.life).toString());
    // Update input, beweging en wapen
    this.#keyboardInputComponent.update();
    this.#horizontalMovementComponent.update();
    this.#weaponComponent.update(dt);
  }

  // Verberg de speler en schakel input uit
  #hide() {
    this.setActive(false);
    this.setVisible(false);
    this.#shipEngineSprite.setVisible(false);
    this.#shipEngineThrusterSprite.setVisible(false);
    this.#keyboardInputComponent.lockInput = true;
  }

  // Spawn de speler, reset gezondheid en positie
  #spawn() {
    this.setActive(true);
    this.setVisible(true);
    this.#shipEngineSprite.setVisible(true);
    this.#shipEngineThrusterSprite.setVisible(true);
    this.#shipSprite.setTexture('ship', 0);
    this.#healthComponent.reset();
    this.setPosition(this.scene.scale.width / 2, this.scene.scale.height - 32);
    this.#keyboardInputComponent.lockInput = false;
  }
}
