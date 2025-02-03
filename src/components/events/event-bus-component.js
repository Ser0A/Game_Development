// Definieer een set constante events die door het spel worden gebruikt
export const CUSTOM_EVENTS = Object.freeze({
  ENEMY_INIT: 'ENEMY_INIT',           // Wordt uitgezonden wanneer een vijand geïnitialiseerd is
  ENEMY_DESTROYED: 'ENEMY_DESTROYED', // Wordt uitgezonden wanneer een vijand wordt vernietigd
  PLAYER_SPAWN: 'PLAYER_SPAWN',       // Wordt uitgezonden wanneer de speler spawnt
  PLAYER_DESTROYED: 'PLAYER_DESTROYED', // Wordt uitgezonden wanneer de speler wordt vernietigd
  GAME_OVER: 'GAME_OVER',             // Wordt uitgezonden bij het einde van het spel
  SHIP_HIT: 'SHIP_HIT',               // Wordt uitgezonden als het schip geraakt wordt
  SHIP_SHOOT: 'SHIP_SHOOT',           // Wordt uitgezonden wanneer het schip schiet
});

// Maak een event bus door de Phaser EventEmitter uit te breiden.
// Hiermee kunnen verschillende onderdelen van het spel met elkaar communiceren via events.
export class EventBusComponent extends Phaser.Events.EventEmitter {
  constructor() {
    super();
  }
}
