export enum AbilityType {
  ATTACK = 'ATTACK',
  HEAL = 'HEAL',
  DEFEND = 'DEFEND',
  SPECIAL = 'SPECIAL'
}

export enum TargetType {
  SELF = 'SELF',
  ENEMY = 'ENEMY',
  ALL_ENEMIES = 'ALL_ENEMIES',
  ALL_ALLIES = 'ALL_ALLIES'
}

export interface AbilityEffect {
  type: 'damage' | 'heal' | 'buff' | 'debuff';
  value: number;
  stat?: 'attack' | 'defense' | 'speed';
  duration?: number; // turns
}

export class Ability {
  id: string;
  name: string;
  description: string;
  type: AbilityType;
  targetType: TargetType;
  manaCost: number;
  effects: AbilityEffect[];
  cooldown: number; // turns before can use again
  currentCooldown: number;

  constructor(
    id: string,
    name: string,
    description: string,
    type: AbilityType,
    targetType: TargetType,
    manaCost: number,
    effects: AbilityEffect[],
    cooldown: number = 0
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.type = type;
    this.targetType = targetType;
    this.manaCost = manaCost;
    this.effects = effects;
    this.cooldown = cooldown;
    this.currentCooldown = 0;
  }

  canUse(currentMana: number): boolean {
    return currentMana >= this.manaCost && this.currentCooldown === 0;
  }

  use(): void {
    this.currentCooldown = this.cooldown;
  }

  tickCooldown(): void {
    if (this.currentCooldown > 0) {
      this.currentCooldown--;
    }
  }

  clone(): Ability {
    return new Ability(
      this.id,
      this.name,
      this.description,
      this.type,
      this.targetType,
      this.manaCost,
      [...this.effects],
      this.cooldown
    );
  }
}

// Predefined abilities library (like MTG cards)
export const ABILITIES_LIBRARY = {
  // Basic attacks
  STRIKE: new Ability(
    'strike',
    'Strike',
    'A basic melee attack',
    AbilityType.ATTACK,
    TargetType.ENEMY,
    1,
    [{ type: 'damage', value: 8 }]
  ),

  FIREBALL: new Ability(
    'fireball',
    'Fireball',
    'Hurl a ball of fire at your enemy',
    AbilityType.ATTACK,
    TargetType.ENEMY,
    3,
    [{ type: 'damage', value: 15 }],
    1
  ),

  LIGHTNING_BOLT: new Ability(
    'lightning',
    'Lightning Bolt',
    'Strike with the power of lightning',
    AbilityType.SPECIAL,
    TargetType.ENEMY,
    4,
    [{ type: 'damage', value: 20 }],
    2
  ),

  // Healing
  HEAL: new Ability(
    'heal',
    'Heal',
    'Restore health',
    AbilityType.HEAL,
    TargetType.SELF,
    2,
    [{ type: 'heal', value: 12 }],
    1
  ),

  // Defense
  DEFEND: new Ability(
    'defend',
    'Defend',
    'Increase defense temporarily',
    AbilityType.DEFEND,
    TargetType.SELF,
    1,
    [{ type: 'buff', value: 5, stat: 'defense', duration: 2 }]
  ),

  // Special abilities
  POWER_ATTACK: new Ability(
    'power_attack',
    'Power Attack',
    'A devastating blow that costs health',
    AbilityType.SPECIAL,
    TargetType.ENEMY,
    2,
    [
      { type: 'damage', value: 25 },
      { type: 'damage', value: 5 } // self-damage
    ],
    3
  ),

  ARCANE_MISSILES: new Ability(
    'arcane_missiles',
    'Arcane Missiles',
    'Fire multiple magic missiles',
    AbilityType.ATTACK,
    TargetType.ENEMY,
    3,
    [{ type: 'damage', value: 12 }],
    1
  )
};
