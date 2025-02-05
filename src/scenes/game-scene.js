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
import { HealthUp } from '../objects/healthup.js'; // 🔹 HealthUp power-up importeren

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });

    this.playerScore = 0; // ✅ Houdt de huidige score bij
    this.lastHealthUpScore = 0; // ✅ Houdt de score bij van de laatste HealthUp spawn
    this.healthUpAvailable = false; // ✅ Zorgt ervoor dat een HealthUp alleen spawnt na een hit
  }

  preload() {
    this.load.pack('asset_pack', 'assets/data/assets.json');
  }

  create() {
    this.add.image(30, 30, 'lifeIcon').setScale(0.03).setDepth(9999);

    this.add.sprite(0, 0, 'bg1', 0).setOrigin(0, 1).setAlpha(0.7).setAngle(90).setScale(1, 1.25).play('bg1');
    this.add.sprite(0, 0, 'bg2', 0).setOrigin(0, 1).setAlpha(0.7).setAngle(90).setScale(1, 1.25).play('bg2');
    this.add.sprite(0, 0, 'bg3', 0).setOrigin(0, 1).setAlpha(0.7).setAngle(90).setScale(1, 1.25).play('bg3');

    const eventBusComponent = new EventBusComponent();
    this.player = new Player(this, eventBusComponent);
    
    this.scoreUI = new Score(this, eventBusComponent);
    this.livesUI = new Lives(this, eventBusComponent);

    const scoutSpawner = new EnemySpawnerComponent(
      this,
      ScoutEnemy,
      { interval: CONFIG.ENEMY_SCOUT_GROUP_SPAWN_INTERVAL, spawnAt: CONFIG.ENEMY_SCOUT_GROUP_SPAWN_START },
      eventBusComponent
    );
    const fighterSpawner = new EnemySpawnerComponent(
      this,
      FighterEnemy,
      { interval: CONFIG.ENEMY_FIGHTER_GROUP_SPAWN_INTERVAL, spawnAt: CONFIG.ENEMY_FIGHTER_GROUP_SPAWN_START },
      eventBusComponent
    );

    new EnemyDestroyedComponent(this, eventBusComponent);

    // ✅ Collision checks
    this.physics.add.overlap(this.player, scoutSpawner.phaserGroup, this.handlePlayerCollision, null, this);
    this.physics.add.overlap(this.player, fighterSpawner.phaserGroup, this.handlePlayerCollision, null, this);

    eventBusComponent.on(CUSTOM_EVENTS.ENEMY_INIT, (gameObject) => {
      if (gameObject.constructor.name !== 'FighterEnemy') return;
      this.physics.add.overlap(
        this.player,
        gameObject.weaponGameObjectGroup,
        this.handleProjectileCollision,
        null,
        this
      );
    });

    this.physics.add.overlap(scoutSpawner.phaserGroup, this.player.weaponGameObjectGroup, this.handleEnemyHit, null, this);
    this.physics.add.overlap(fighterSpawner.phaserGroup, this.player.weaponGameObjectGroup, this.handleEnemyHit, null, this);

    new AudioManager(this, eventBusComponent);

    // ✅ Start HealthUp spawner
    this.time.addEvent({
      delay: 5000, // Check elke 5 seconden
      loop: true,
      callback: () => {
        this.spawnHealthUp();
      }
    });
  }

  spawnHealthUp() {
    console.log("🔹 Check voor HealthUp: levens =", this.livesUI.getLives(), "score =", this.playerScore);
    console.log("🛠 Laatste HealthUp bij score:", this.lastHealthUpScore);
    console.log("🛠 HealthUp beschikbaar?", this.healthUpAvailable);

    let scoreDiff = this.playerScore - this.lastHealthUpScore;
    console.log("🛠 Score verschil sinds laatste HealthUp:", scoreDiff);

    if (this.livesUI.getLives() < 3 &&
        scoreDiff >= 1000 &&
        this.healthUpAvailable) {

        let x = Phaser.Math.Between(50, 400);
        let healthUp = new HealthUp(this, x, 0);
        this.add.existing(healthUp);
        this.physics.add.existing(healthUp);

        console.log("✅ HealthUp gespawned op X:", x);

        this.physics.add.overlap(this.player, healthUp, this.collectHealthUp, null, this);

        this.lastHealthUpScore = this.playerScore; // ✅ Reset de teller na spawn
        this.healthUpAvailable = false; // ✅ Moet eerst weer geraakt worden
    } else {
        console.log("❌ HealthUp niet gespawned. Voorwaarden niet gehaald.");
    }
}


  // ✅ HealthUp oppakken
  collectHealthUp(player, healthUp) {
    console.log("✅ HealthUp opgepakt!");
    healthUp.destroy();
    this.livesUI.gainLife();
  }

  // ✅ Score bijwerken
  updateScore(points) {
    this.playerScore += points;
    console.log("🔹 Score geüpdatet:", this.playerScore);

    if (this.scoreUI && typeof this.scoreUI.updateScore === 'function') {
        this.scoreUI.updateScore(this.playerScore);
    } else {
        console.error('⚠️ scoreUI is niet correct geïnitialiseerd of updateScore ontbreekt.');
    }
}


  // ✅ Enemy hit handling
  handleEnemyHit(enemy, projectile) {
    if (!enemy.active || !projectile.active) return;
    this.player.weaponComponent.destroyBullet(projectile);

    let points = enemy.constructor.name === 'FighterEnemy' ? 200 : 100;
    this.updateScore(points); // ✅ Zorg ervoor dat score toeneemt

    if (enemy.colliderComponent.collideWithEnemyProjectile()) {
      console.log("💥 Vijand vernietigd! Score +", points);
    }
}


  handlePlayerCollision(player, enemy) {
    if (!player.active || !enemy.active) return;

    player.colliderComponent.collideWithEnemyShip();
    enemy.colliderComponent.collideWithEnemyShip();

    this.healthUpAvailable = true; // ✅ Activeer HealthUp na een hit
    console.log("⚠️ Speler geraakt! HealthUp is nu beschikbaar.");
  }

  handleProjectileCollision(player, projectile) {
    if (!player.active || !projectile.active) return;

    projectile.destroy();
    player.colliderComponent.collideWithEnemyProjectile();

    this.healthUpAvailable = true; // ✅ Activeer HealthUp na een hit
    console.log("⚠️ Speler geraakt door projectiel! HealthUp is nu beschikbaar.");
  }
}
