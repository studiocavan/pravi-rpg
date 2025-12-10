import { Character } from './Character';
import { Ability, AbilityEffect } from './Ability';

export enum CombatPhase {
  PLAYER_TURN = 'PLAYER_TURN',
  ENEMY_TURN = 'ENEMY_TURN',
  ANIMATION = 'ANIMATION',
  VICTORY = 'VICTORY',
  DEFEAT = 'DEFEAT'
}

export interface CombatAction {
  actor: Character;
  ability: Ability;
  target: Character;
  effects: AbilityEffect[];
}

export interface CombatLog {
  message: string;
  timestamp: number;
}

export class CombatState {
  player: Character;
  enemy: Character;
  phase: CombatPhase;
  turnCount: number;
  combatLog: CombatLog[];
  lastAction: CombatAction | null;

  constructor(player: Character, enemy: Character) {
    this.player = player;
    this.enemy = enemy;
    this.turnCount = 1;
    this.combatLog = [];
    this.lastAction = null;

    // Determine who goes first based on speed
    this.phase = player.getEffectiveSpeed() >= enemy.getEffectiveSpeed()
      ? CombatPhase.PLAYER_TURN
      : CombatPhase.ENEMY_TURN;

    this.addLog(`Combat begins! ${this.phase === CombatPhase.PLAYER_TURN ? 'Player' : 'Enemy'} goes first.`);
  }

  addLog(message: string): void {
    this.combatLog.push({
      message,
      timestamp: Date.now()
    });

    // Keep only last 10 messages
    if (this.combatLog.length > 10) {
      this.combatLog.shift();
    }
  }

  executeAction(actor: Character, ability: Ability, target: Character): boolean {
    // Check if ability can be used
    if (!ability.canUse(actor.currentMana)) {
      this.addLog(`${actor.name} cannot use ${ability.name}!`);
      return false;
    }

    // Consume mana
    actor.consumeMana(ability.manaCost);
    ability.use();

    this.lastAction = {
      actor,
      ability,
      target,
      effects: ability.effects
    };

    this.addLog(`${actor.name} uses ${ability.name}!`);

    // Apply effects
    ability.effects.forEach(effect => {
      this.applyEffect(effect, actor, target);
    });

    return true;
  }

  private applyEffect(effect: AbilityEffect, actor: Character, target: Character): void {
    switch (effect.type) {
      case 'damage':
        const damage = effect.value + actor.getEffectiveAttack();
        const actualDamage = target.takeDamage(damage);
        this.addLog(`${target.name} takes ${actualDamage} damage!`);

        if (target.isDead) {
          this.phase = target.isPlayer ? CombatPhase.DEFEAT : CombatPhase.VICTORY;
          this.addLog(`${target.name} has been defeated!`);
        }
        break;

      case 'heal':
        const healed = actor.heal(effect.value);
        this.addLog(`${actor.name} heals ${healed} HP!`);
        break;

      case 'buff':
      case 'debuff':
        if (effect.stat && effect.duration) {
          target.addStatusEffect({
            type: effect.type,
            stat: effect.stat,
            value: effect.type === 'buff' ? effect.value : -effect.value,
            duration: effect.duration
          });
          this.addLog(
            `${target.name}'s ${effect.stat} ${effect.type === 'buff' ? 'increased' : 'decreased'}!`
          );
        }
        break;
    }
  }

  endTurn(): void {
    // Tick status effects for current actor
    const currentActor = this.phase === CombatPhase.PLAYER_TURN ? this.player : this.enemy;
    currentActor.tickStatusEffects();

    // Switch turns
    if (this.phase === CombatPhase.PLAYER_TURN) {
      this.phase = CombatPhase.ENEMY_TURN;
      this.enemy.startTurn();
      this.addLog("Enemy's turn.");
    } else if (this.phase === CombatPhase.ENEMY_TURN) {
      this.phase = CombatPhase.PLAYER_TURN;
      this.turnCount++;
      this.player.startTurn();
      this.addLog(`Turn ${this.turnCount} - Player's turn.`);
    }

    this.lastAction = null;
  }

  getUsableAbilities(character: Character): Ability[] {
    return character.abilities.filter(ability =>
      ability.canUse(character.currentMana)
    );
  }

  isGameOver(): boolean {
    return this.phase === CombatPhase.VICTORY || this.phase === CombatPhase.DEFEAT;
  }

  getWinner(): Character | null {
    if (this.phase === CombatPhase.VICTORY) return this.player;
    if (this.phase === CombatPhase.DEFEAT) return this.enemy;
    return null;
  }
}
