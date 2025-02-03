import Phaser from '../../lib/phaser.js';
import { CUSTOM_EVENTS } from '../events/event-bus-component.js';

export class EnemySpawnerComponent {
  #scene;
  #spawnInterval;
  #spawnAt;
  #group;
  #disableSpawning;

  constructor(scene, enemyClass, spawnConfig, eventBusComponent) {
    this.#scene = scene;

    // Maak een groep aan voor de vijanden
    this.#group = this.#scene.add.group({
      name: `${this.constructor.name}-${Phaser.Math.RND.uuid()}`,
      classType: enemyClass,
      runChildUpdate: true,
      createCallback: (enemy) => {
        // Initialiseer de vijand zodra deze wordt aangemaakt
        enemy.init(eventBusComponent);
      },
    });

    // Stel de spawn-interval en starttijd in
    this.#spawnInterval = spawnConfig.interval;
    this.#spawnAt = spawnConfig.spawnAt;
    this.#disableSpawning = false;

    // Registreer de update functie die elke frame wordt aangeroepen
    this.#scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    // Controleer de wereld elke physics-step
    this.#scene.physics.world.on(Phaser.Physics.Arcade.Events.WORLD_STEP, this.worldStep, this);

    // Verwijder de event listeners wanneer de scene wordt vernietigd
    this.#scene.events.once(
      Phaser.Scenes.Events.DESTROY,
      () => {
        this.#scene.events.off(Phaser.Scenes.Events.UPDATE, this.update, this);
        this.#scene.physics.world.off(Phaser.Physics.Arcade.Events.WORLD_STEP, this.worldStep, this);
      },
      this
    );

    // Stop met spawnen als het spel voorbij is
    eventBusComponent.on(CUSTOM_EVENTS.GAME_OVER, () => {
      this.#disableSpawning = true;
    });
  }

  // Geef de groep met vijanden terug
  get phaserGroup() {
    return this.#group;
  }

  // Update functie die elke frame wordt aangeroepen
  update(ts, dt) {
    if (this.#disableSpawning) {
      return;
    }

    // Verminder de spawn timer
    this.#spawnAt -= dt;
    if (this.#spawnAt > 0) {
      return;
    }

    // Bepaal een willekeurige x-positie binnen het scherm
    const x = Phaser.Math.RND.between(30, this.#scene.scale.width - 30);
    // Haal een vijand uit de groep en reset hem op de nieuwe positie
    const enemy = this.#group.get(x, -20);
    enemy.reset();
    // Reset de spawn timer
    this.#spawnAt = this.#spawnInterval;
  }

  // Controleer elke physics-step of vijanden buiten het scherm zijn
  worldStep(delta) {
    this.#group.getChildren().forEach((enemy) => {
      if (!enemy.active) {
        return;
      }

      // Als de vijand te ver naar beneden komt, verberg hem
      if (enemy.y > this.#scene.scale.height + 50) {
        enemy.setActive(false);
        enemy.setVisible(false);
      }
    });
  }
}
