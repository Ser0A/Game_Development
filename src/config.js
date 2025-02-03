// Speler instellingen
export const PLAYER_LIVES = 3; // Aantal levens
export const PLAYER_HEALTH = 4; // Gezondheid
export const PLAYER_BULLET_SPEED = 350; // Snelheid van de kogels
export const PLAYER_BULLET_INTERVAL = 300; // Tijd tussen schoten (ms)
export const PLAYER_BULLET_LIFESPAN = 3; // Hoe lang een kogel leeft (sec)
export const PLAYER_BULLET_MAX_COUNT = 10; // Max aantal kogels tegelijk
export const PLAYER_MOVEMENT_HORIZONTAL_VELOCITY = 50; // Horizontale snelheid

// Vijand Fighter instellingen
export const ENEMY_FIGHTER_SCORE = 200; // Score per fighter
export const ENEMY_FIGHTER_HEALTH = 2; // Gezondheid van de fighter
export const ENEMY_FIGHTER_MOVEMENT_VERTICAL_VELOCITY = 14; // Verticale snelheid
export const ENEMY_FIGHTER_BULLET_SPEED = -280; // Snelheid van de fighter-kogels
export const ENEMY_FIGHTER_BULLET_INTERVAL = 2000; // Tijd tussen fighter-schoten (ms)
export const ENEMY_FIGHTER_BULLET_LIFESPAN = 3; // Levensduur van fighter-kogels (sec)
export const ENEMY_FIGHTER_BULLET_MAX_COUNT = 10; // Max aantal fighter-kogels tegelijk
export const ENEMY_FIGHTER_GROUP_SPAWN_INTERVAL = 6000; // Interval tussen fighter groepen (ms)
export const ENEMY_FIGHTER_GROUP_SPAWN_START = 3000; // Starttijd voor fighter groep (ms)

// Vijand Scout instellingen
export const ENEMY_SCOUT_SCORE = 100; // Score per scout
export const ENEMY_SCOUT_HEALTH = 2; // Gezondheid van de scout
export const ENEMY_SCOUT_MOVEMENT_MAX_X = 40; // Maximale X-beweging
export const ENEMY_SCOUT_MOVEMENT_VERTICAL_VELOCITY = 9; // Verticale snelheid
export const ENEMY_SCOUT_MOVEMENT_HORIZONTAL_VELOCITY = 7; // Horizontale snelheid
export const ENEMY_SCOUT_GROUP_SPAWN_INTERVAL = 5000; // Interval tussen scout groepen (ms)
export const ENEMY_SCOUT_GROUP_SPAWN_START = 1000; // Starttijd voor scout groep (ms)

// Component beweging instellingen
export const COMPONENT_MOVEMENT_VERTICAL_DRAG = 0.01; // Vertraging bij verticale beweging
export const COMPONENT_MOVEMENT_VERTICAL_MAX_VELOCITY = 200; // Max verticale snelheid
export const COMPONENT_MOVEMENT_HORIZONTAL_DRAG = 0.01; // Vertraging bij horizontale beweging
export const COMPONENT_MOVEMENT_HORIZONTAL_MAX_VELOCITY = 200; // Max horizontale snelheid
