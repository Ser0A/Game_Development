// @ts-nocheck

import { EnemySpawnerComponent } from '../components/spawners/enemy-spawner-component.js';
import Phaser from '../lib/phaser.js';
import { FighterEnemy } from '../objects/enemies/fighter-enemy.js';
import { ScoutEnemy } from '../objects/enemies/scout-enemy.js';
import { Player } from '../objects/player.js';
import * as CONFIG from '../config.js';
import { CUSTOM_EVENTS, EventBusComponent } from '../components/events/event-bus-component.js';
import { EnemyDestroyedComponent } from '../components/spawners/enemy-destroyed-component.js';
import { Score } from '../objects/ui/score.js';
import { Lives } from '../objects/ui/lives.js';
import { AudioManager } from '../objects/audio-manager.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Laad alle assets via een pack
    this.load.pack('asset_pack', 'assets/data/assets.json');
  }

  create() {
    // Voeg een levensicoon toe
    this.add.image(30, 30, 'lifeIcon').setScale(0.03).setDepth(9999);

    // Voeg achtergrondsprites toe en speel hun animaties
    this.add.sprite(0, 0, 'bg1', 0)
      .setOrigin(0, 1)
      .setAlpha(0.7)
      .setAngle(90)
      .setScale(1, 1.25)
      .play('bg1');
    this.add.sprite(0, 0, 'bg2', 0)
      .setOrigin(0, 1)
      .setAlpha(0.7)
      .setAngle(90)
      .setScale(1, 1.25)
      .play('bg2');
    this.add.sprite(0, 0, 'bg3', 0)
      .setOrigin(0, 1)
      .setAlpha(0.7)
      .setAngle(90)
      .setScale(1, 1.25)
      .play('bg3');

    // Initialiseer de event bus en maak de speler
    const eventBusComponent = new EventBusComponent();
    const player = new Player(this, eventBusComponent);

    // Maak spawners voor scout- en fighter-vijanden
    const scoutSpawner = new EnemySpawnerComponent(
      this,
      ScoutEnemy,
      {
        interval: CONFIG.ENEMY_SCOUT_GROUP_SPAWN_INTERVAL,
        spawnAt: CONFIG.ENEMY_SCOUT_GROUP_SPAWN_START,
      },
      eventBusComponent
    );
    const fighterSpawner = new EnemySpawnerComponent(
      this,
      FighterEnemy,
      {
        interval: CONFIG.ENEMY_FIGHTER_GROUP_SPAWN_INTERVAL,
        spawnAt: CONFIG.ENEMY_FIGHTER_GROUP_SPAWN_START,
      },
      eventBusComponent
    );
    new EnemyDestroyedComponent(this, eventBusComponent);

    // Check overlap tussen speler en scout-vijanden
    this.physics.add.overlap(
      player,
      scoutSpawner.phaserGroup,
      (playerGO, enemyGO) => {
        if (!playerGO.active || !enemyGO.active) return;
        playerGO.colliderComponent.collideWithEnemyShip();
        enemyGO.colliderComponent.collideWithEnemyShip();
      }
    );

    // Check overlap tussen speler en fighter-vijanden
    this.physics.add.overlap(
      player,
      fighterSpawner.phaserGroup,
      (playerGO, enemyGO) => {
        if (!playerGO.active || !enemyGO.active) return;
        playerGO.colliderComponent.collideWithEnemyShip();
        enemyGO.colliderComponent.collideWithEnemyShip();
      }
    );

    // Voeg overlap toe voor fighter-projectielen
    eventBusComponent.on(CUSTOM_EVENTS.ENEMY_INIT, (gameObject) => {
      if (gameObject.constructor.name !== 'FighterEnemy') return;
      this.physics.add.overlap(
        player,
        gameObject.weaponGameObjectGroup,
        (playerGO, projectileGO) => {
          if (!playerGO.active || !projectileGO.active) return;
          gameObject.weaponComponent.destroyBullet(projectileGO);
          playerGO.colliderComponent.collideWithEnemyProjectile();
        }
      );
    });

    // Check overlap tussen speler-projectielen en scout-vijanden
    this.physics.add.overlap(
      scoutSpawner.phaserGroup,
      player.weaponGameObjectGroup,
      (enemyGO, projectileGO) => {
        if (!enemyGO.active || !projectileGO.active) return;
        player.weaponComponent.destroyBullet(projectileGO);
        enemyGO.colliderComponent.collideWithEnemyProjectile();
      }
    );

    // Check overlap tussen speler-projectielen en fighter-vijanden
    this.physics.add.overlap(
      fighterSpawner.phaserGroup,
      player.weaponGameObjectGroup,
      (enemyGO, projectileGO) => {
        if (!enemyGO.active || !projectileGO.active) return;
        player.weaponComponent.destroyBullet(projectileGO);
        enemyGO.colliderComponent.collideWithEnemyProjectile();
      }
    );

    // Start UI-elementen en audio
    new Score(this, eventBusComponent);
    new Lives(this, eventBusComponent);
    new AudioManager(this, eventBusComponent);
  }
}
