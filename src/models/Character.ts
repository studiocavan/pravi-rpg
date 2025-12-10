import { Ability } from './Ability';

export interface StatusEffect {
  type: 'buff' | 'debuff';
  stat: 'attack' | 'defense' | 'speed';
  value: number;
  duration: number;
}

export class Character {
  id: string;
  name: string;
  isPlayer: boolean;

  // Base stats
  maxHealth: number;
  currentHealth: number;
  maxMana: number;
  currentMana: number;
  baseAttack: number;
  baseDefense: number;
  speed: number;

  // Abilities (like a deck of cards)
  abilities: Ability[];

  // Status effects
  statusEffects: StatusEffect[];

  // Combat state
  isDead: boolean;

  constructor(
    id: string,
    name: string,
    isPlayer: boolean,
    maxHealth: number,
    maxMana: number,
    baseAttack: number,
    baseDefense: number,
    speed: number,
    abilities: Ability[]
  ) {
    this.id = id;
    this.name = name;
    this.isPlayer = isPlayer;
    this.maxHealth = maxHealth;
    this.currentHealth = maxHealth;
    this.maxMana = maxMana;
    this.currentMana = maxMana;
    this.baseAttack = baseAttack;
    this.baseDefense = baseDefense;
    this.speed = speed;
    this.abilities = abilities.map(a => a.clone());
    this.statusEffects = [];
    this.isDead = false;
  }

  // Calculate effective stats with buffs/debuffs
  getEffectiveAttack(): number {
    let attack = this.baseAttack;
    this.statusEffects.forEach(effect => {
      if (effect.stat === 'attack') {
        attack += effect.value;
      }
    });
    return Math.max(0, attack);
  }

  getEffectiveDefense(): number {
    let defense = this.baseDefense;
    this.statusEffects.forEach(effect => {
      if (effect.stat === 'defense') {
        defense += effect.value;
      }
    });
    return Math.max(0, defense);
  }

  getEffectiveSpeed(): number {
    let speed = this.speed;
    this.statusEffects.forEach(effect => {
      if (effect.stat === 'speed') {
        speed += effect.value;
      }
    });
    return Math.max(1, speed);
  }

  takeDamage(damage: number): number {
    const defense = this.getEffectiveDefense();
    const actualDamage = Math.max(1, damage - defense);
    this.currentHealth = Math.max(0, this.currentHealth - actualDamage);

    if (this.currentHealth === 0) {
      this.isDead = true;
    }

    return actualDamage;
  }

  heal(amount: number): number {
    const oldHealth = this.currentHealth;
    this.currentHealth = Math.min(this.maxHealth, this.currentHealth + amount);
    return this.currentHealth - oldHealth;
  }

  consumeMana(amount: number): boolean {
    if (this.currentMana >= amount) {
      this.currentMana -= amount;
      return true;
    }
    return false;
  }

  restoreMana(amount: number): void {
    this.currentMana = Math.min(this.maxMana, this.currentMana + amount);
  }

  addStatusEffect(effect: StatusEffect): void {
    this.statusEffects.push(effect);
  }

  tickStatusEffects(): void {
    // Decrease duration and remove expired effects
    this.statusEffects = this.statusEffects
      .map(effect => ({ ...effect, duration: effect.duration - 1 }))
      .filter(effect => effect.duration > 0);

    // Tick cooldowns on abilities
    this.abilities.forEach(ability => ability.tickCooldown());
  }

  getHealthPercentage(): number {
    return (this.currentHealth / this.maxHealth) * 100;
  }

  getManaPercentage(): number {
    return (this.currentMana / this.maxMana) * 100;
  }

  startTurn(): void {
    // Restore some mana each turn
    this.restoreMana(2);
  }
}
