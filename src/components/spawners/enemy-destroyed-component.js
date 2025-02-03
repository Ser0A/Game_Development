import { CUSTOM_EVENTS } from '../events/event-bus-component.js';

export class EnemyDestroyedComponent {
  #scene;
  #group;
  #eventBusComponent;

  constructor(scene, eventBusComponent) {
    this.#scene = scene;
    this.#eventBusComponent = eventBusComponent;

    // Maak een groep aan om de vernietigings-animaties te beheren
    this.#group = this.#scene.add.group({
      name: `${this.constructor.name}-${Phaser.Math.RND.uuid()}`,
    });

    // Luister naar het ENEMY_DESTROYED event en speel de vernietigings-animatie af
    this.#eventBusComponent.on(CUSTOM_EVENTS.ENEMY_DESTROYED, (enemy) => {
      const gameObject = this.#group.get(enemy.x, enemy.y, enemy.shipAssetKey, 0);
      if (gameObject) {
        gameObject.play({
          key: enemy.shipDestroyedAnimationKey,
        });
      }
    });
  }
}
