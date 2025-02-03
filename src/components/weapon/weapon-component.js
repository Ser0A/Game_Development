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

    // Maak een groep aan voor vijanden met een unieke naam en type
    this.#group = this.#scene.add.group({
      name: `${this.constructor.name}-${Phaser.Math.RND.uuid()}`,
      classType: enemyClass,
      runChildUpdate: true,
      createCallback: (enemy) => {
        // Zodra een vijand wordt aangemaakt, initialiseer hem met de event bus
        enemy.init(eventBusComponent);
      },
    });

    // Stel de spawn-interval en de starttijd voor het spawnen in
    this.#spawnInterval = spawnConfig.interval;
    this.#spawnAt = spawnConfig.spawnAt;
    this.#disableSpawning = false;

    // Registreer de update-functie zodat deze elke frame wordt aangeroepen
    this.#scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    // Controleer elke physics-step of vijanden buiten het scherm komen
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

    // Schakel spawnen uit wanneer het GAME_OVER event wordt uitgezonden
    eventBusComponent.on(CUSTOM_EVENTS.GAME_OVER, () => {
      this.#disableSpawning = true;
    });
  }

  // Geeft de groep met vijanden terug, zodat andere componenten hier toegang toe hebben
  get phaserGroup() {
    return this.#group;
  }

  // Update-functie die elke frame wordt aangeroepen
  update(ts, dt) {
    if (this.#disableSpawning) {
      return;
    }

    // Verminder de spawn timer met de verstreken tijd
    this.#spawnAt -= dt;
    if (this.#spawnAt > 0) {
      return;
    }

    // Kies een willekeurige x-positie binnen de schermbreedte (met een marge van 30 pixels)
    const x = Phaser.Math.RND.between(30, this.#scene.scale.width - 30);
    // Haal een vijand uit de groep en reset hem op de nieuwe positie (boven het scherm)
    const enemy = this.#group.get(x, -20);
    enemy.reset();
    // Herstel de spawn timer naar het ingestelde interval
    this.#spawnAt = this.#spawnInterval;
  }

  // Controleer tijdens elke physics-step of vijanden buiten het scherm zijn
  worldStep(delta) {
    this.#group.getChildren().forEach((enemy) => {
      if (!enemy.active) {
        return;
      }

      // Als een vijand te ver onderaan het scherm komt, deactiveer en verberg hem
      if (enemy.y > this.#scene.scale.height + 50) {
        enemy.setActive(false);
        enemy.setVisible(false);
      }
    });
  }
}
