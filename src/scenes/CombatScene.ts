import Phaser from 'phaser';
import { Character } from '../models/Character';
import { CombatState, CombatPhase } from '../models/CombatState';
import { Ability, ABILITIES_LIBRARY } from '../models/Ability';

export class CombatScene extends Phaser.Scene {
  private combatState!: CombatState;
  private playerSprite!: Phaser.GameObjects.Rectangle;
  private enemySprite!: Phaser.GameObjects.Rectangle;
  private playerHealthBar!: Phaser.GameObjects.Graphics;
  private enemyHealthBar!: Phaser.GameObjects.Graphics;
  private playerManaBar!: Phaser.GameObjects.Graphics;
  private playerStatsText!: Phaser.GameObjects.Text;
  private enemyStatsText!: Phaser.GameObjects.Text;
  private turnText!: Phaser.GameObjects.Text;
  private logText!: Phaser.GameObjects.Text;
  private abilityCards: Phaser.GameObjects.Container[] = [];
  private endTurnButton!: Phaser.GameObjects.Container;

  constructor() {
    super({ key: 'CombatScene' });
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Create background
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

    // Create title
    const title = this.add.text(width / 2, 30, 'COMBAT', {
      font: 'bold 32px monospace',
      color: '#ff6b6b'
    });
    title.setOrigin(0.5);

    // Initialize combat
    this.initializeCombat();

    // Create UI
    this.createCharacterSprites();
    this.createHealthBars();
    this.createTurnIndicator();
    this.createCombatLog();
    this.createAbilityCards();
    this.createEndTurnButton();

    // Update UI
    this.updateUI();
  }

  private initializeCombat(): void {
    // Create player character
    const player = new Character(
      'player',
      'Hero',
      true,
      100,
      20,
      5,
      3,
      10,
      [
        ABILITIES_LIBRARY.STRIKE.clone(),
        ABILITIES_LIBRARY.FIREBALL.clone(),
        ABILITIES_LIBRARY.HEAL.clone(),
        ABILITIES_LIBRARY.DEFEND.clone(),
        ABILITIES_LIBRARY.LIGHTNING_BOLT.clone()
      ]
    );

    // Create enemy
    const enemy = new Character(
      'enemy',
      'Dark Knight',
      false,
      80,
      15,
      7,
      2,
      8,
      [
        ABILITIES_LIBRARY.STRIKE.clone(),
        ABILITIES_LIBRARY.FIREBALL.clone(),
        ABILITIES_LIBRARY.POWER_ATTACK.clone()
      ]
    );

    this.combatState = new CombatState(player, enemy);
  }

  private createCharacterSprites(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Player sprite (left side)
    this.playerSprite = this.add.rectangle(200, height / 2, 100, 150, 0x4ecdc4);
    this.playerSprite.setStrokeStyle(3, 0xffffff);

    const playerLabel = this.add.text(200, height / 2 + 100, 'HERO', {
      font: 'bold 20px monospace',
      color: '#ffffff'
    });
    playerLabel.setOrigin(0.5);

    // Enemy sprite (right side)
    this.enemySprite = this.add.rectangle(width - 200, height / 2, 100, 150, 0xff6b6b);
    this.enemySprite.setStrokeStyle(3, 0xffffff);

    const enemyLabel = this.add.text(width - 200, height / 2 + 100, 'DARK KNIGHT', {
      font: 'bold 20px monospace',
      color: '#ffffff'
    });
    enemyLabel.setOrigin(0.5);
  }

  private createHealthBars(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Player health bar
    this.playerHealthBar = this.add.graphics();
    this.playerManaBar = this.add.graphics();

    this.playerStatsText = this.add.text(200, height / 2 - 120, '', {
      font: '14px monospace',
      color: '#ffffff',
      align: 'center'
    });
    this.playerStatsText.setOrigin(0.5);

    // Enemy health bar
    this.enemyHealthBar = this.add.graphics();

    this.enemyStatsText = this.add.text(width - 200, height / 2 - 120, '', {
      font: '14px monospace',
      color: '#ffffff',
      align: 'center'
    });
    this.enemyStatsText.setOrigin(0.5);
  }

  private createTurnIndicator(): void {
    const width = this.cameras.main.width;

    this.turnText = this.add.text(width / 2, 80, '', {
      font: 'bold 24px monospace',
      color: '#4ecdc4'
    });
    this.turnText.setOrigin(0.5);
  }

  private createCombatLog(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Log background
    const logBg = this.add.rectangle(width / 2, 150, 500, 120, 0x0f3460, 0.7);
    logBg.setStrokeStyle(2, 0x4ecdc4);

    this.logText = this.add.text(width / 2, 150, '', {
      font: '12px monospace',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 480 }
    });
    this.logText.setOrigin(0.5);
  }

  private createAbilityCards(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const cardY = height - 120;
    const startX = width / 2 - 300;
    const cardSpacing = 130;

    this.combatState.player.abilities.forEach((ability, index) => {
      const card = this.createAbilityCard(
        startX + index * cardSpacing,
        cardY,
        ability
      );
      this.abilityCards.push(card);
    });
  }

  private createAbilityCard(x: number, y: number, ability: Ability): Phaser.GameObjects.Container {
    const card = this.add.container(x, y);

    // Card background
    const bg = this.add.rectangle(0, 0, 110, 140, 0x16213e);
    bg.setStrokeStyle(2, 0x4ecdc4);

    // Card name
    const name = this.add.text(0, -50, ability.name, {
      font: 'bold 12px monospace',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 100 }
    });
    name.setOrigin(0.5);

    // Mana cost
    const manaCost = this.add.text(-45, -60, ability.manaCost.toString(), {
      font: 'bold 16px monospace',
      color: '#4ecdc4'
    });

    const manaCircle = this.add.circle(-45, -60, 12, 0x0f3460);
    manaCircle.setStrokeStyle(2, 0x4ecdc4);

    // Description
    const desc = this.add.text(0, 0, ability.description, {
      font: '10px monospace',
      color: '#aaaaaa',
      align: 'center',
      wordWrap: { width: 100 }
    });
    desc.setOrigin(0.5);

    // Cooldown indicator
    const cooldownText = this.add.text(0, 50, '', {
      font: 'bold 14px monospace',
      color: '#ff6b6b'
    });
    cooldownText.setOrigin(0.5);

    card.add([bg, manaCircle, manaCost, name, desc, cooldownText]);
    card.setSize(110, 140);
    card.setData('ability', ability);
    card.setData('bg', bg);
    card.setData('cooldownText', cooldownText);

    card.setInteractive(
      new Phaser.Geom.Rectangle(-55, -70, 110, 140),
      Phaser.Geom.Rectangle.Contains
    );

    // Hover effects
    card.on('pointerover', () => {
      if (ability.canUse(this.combatState.player.currentMana) &&
          this.combatState.phase === CombatPhase.PLAYER_TURN) {
        bg.setFillStyle(0x1f2f4e);
        this.game.canvas.style.cursor = 'pointer';
      }
    });

    card.on('pointerout', () => {
      bg.setFillStyle(0x16213e);
      this.game.canvas.style.cursor = 'default';
    });

    card.on('pointerdown', () => {
      this.onAbilityClicked(ability);
    });

    return card;
  }

  private createEndTurnButton(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const button = this.add.container(width - 120, height - 50);

    const bg = this.add.rectangle(0, 0, 180, 40, 0xff6b6b);
    bg.setStrokeStyle(2, 0xffffff);

    const label = this.add.text(0, 0, 'End Turn', {
      font: 'bold 16px monospace',
      color: '#ffffff'
    });
    label.setOrigin(0.5);

    button.add([bg, label]);
    button.setSize(180, 40);
    button.setData('bg', bg);
    button.setInteractive(
      new Phaser.Geom.Rectangle(-90, -20, 180, 40),
      Phaser.Geom.Rectangle.Contains
    );

    button.on('pointerover', () => {
      if (this.combatState.phase === CombatPhase.PLAYER_TURN) {
        bg.setFillStyle(0xff8888);
        this.game.canvas.style.cursor = 'pointer';
      }
    });

    button.on('pointerout', () => {
      bg.setFillStyle(0xff6b6b);
      this.game.canvas.style.cursor = 'default';
    });

    button.on('pointerdown', () => {
      if (this.combatState.phase === CombatPhase.PLAYER_TURN) {
        this.endPlayerTurn();
      }
    });

    this.endTurnButton = button;
  }

  private onAbilityClicked(ability: Ability): void {
    if (this.combatState.phase !== CombatPhase.PLAYER_TURN) {
      return;
    }

    if (!ability.canUse(this.combatState.player.currentMana)) {
      this.combatState.addLog('Not enough mana or ability on cooldown!');
      this.updateUI();
      return;
    }

    // Execute the action
    const success = this.combatState.executeAction(
      this.combatState.player,
      ability,
      this.combatState.enemy
    );

    if (success) {
      this.playAttackAnimation(this.playerSprite, this.enemySprite);
      this.updateUI();

      // Check if combat is over
      if (this.combatState.isGameOver()) {
        this.time.delayedCall(1000, () => {
          this.showGameOver();
        });
      }
    }
  }

  private endPlayerTurn(): void {
    this.combatState.endTurn();
    this.updateUI();

    // Enemy turn
    if (this.combatState.phase === CombatPhase.ENEMY_TURN) {
      this.time.delayedCall(1000, () => {
        this.executeEnemyTurn();
      });
    }
  }

  private executeEnemyTurn(): void {
    if (this.combatState.isGameOver()) {
      return;
    }

    // Simple AI: choose random usable ability
    const usableAbilities = this.combatState.getUsableAbilities(this.combatState.enemy);

    if (usableAbilities.length > 0) {
      const randomAbility = Phaser.Math.RND.pick(usableAbilities);
      this.combatState.executeAction(
        this.combatState.enemy,
        randomAbility,
        this.combatState.player
      );

      this.playAttackAnimation(this.enemySprite, this.playerSprite);
      this.updateUI();

      // Check if combat is over
      if (this.combatState.isGameOver()) {
        this.time.delayedCall(1000, () => {
          this.showGameOver();
        });
        return;
      }
    }

    // End enemy turn
    this.time.delayedCall(1500, () => {
      this.combatState.endTurn();
      this.updateUI();
    });
  }

  private playAttackAnimation(attacker: Phaser.GameObjects.Rectangle, target: Phaser.GameObjects.Rectangle): void {
    const originalX = attacker.x;

    this.tweens.add({
      targets: attacker,
      x: attacker.x + (attacker === this.playerSprite ? 50 : -50),
      duration: 200,
      yoyo: true,
      onComplete: () => {
        // Flash target
        this.tweens.add({
          targets: target,
          alpha: 0.3,
          duration: 100,
          yoyo: true,
          repeat: 2
        });
      }
    });
  }

  private updateUI(): void {
    // Update health bars
    this.updateHealthBar(
      this.playerHealthBar,
      200,
      this.cameras.main.height / 2 - 100,
      this.combatState.player
    );

    this.updateHealthBar(
      this.enemyHealthBar,
      this.cameras.main.width - 200,
      this.cameras.main.height / 2 - 100,
      this.combatState.enemy
    );

    // Update mana bar
    this.updateManaBar(
      this.playerManaBar,
      200,
      this.cameras.main.height / 2 - 80,
      this.combatState.player
    );

    // Update stats text
    this.playerStatsText.setText(
      `HP: ${this.combatState.player.currentHealth}/${this.combatState.player.maxHealth}\n` +
      `MP: ${this.combatState.player.currentMana}/${this.combatState.player.maxMana}\n` +
      `ATK: ${this.combatState.player.getEffectiveAttack()} DEF: ${this.combatState.player.getEffectiveDefense()}`
    );

    this.enemyStatsText.setText(
      `HP: ${this.combatState.enemy.currentHealth}/${this.combatState.enemy.maxHealth}\n` +
      `MP: ${this.combatState.enemy.currentMana}/${this.combatState.enemy.maxMana}\n` +
      `ATK: ${this.combatState.enemy.getEffectiveAttack()} DEF: ${this.combatState.enemy.getEffectiveDefense()}`
    );

    // Update turn indicator
    const turnPhase = this.combatState.phase === CombatPhase.PLAYER_TURN ? 'YOUR TURN' : 'ENEMY TURN';
    this.turnText.setText(`Turn ${this.combatState.turnCount} - ${turnPhase}`);
    this.turnText.setColor(this.combatState.phase === CombatPhase.PLAYER_TURN ? '#4ecdc4' : '#ff6b6b');

    // Update combat log
    const recentLogs = this.combatState.combatLog.slice(-5);
    this.logText.setText(recentLogs.map(log => log.message).join('\n'));

    // Update ability cards
    this.abilityCards.forEach(card => {
      const ability = card.getData('ability') as Ability;
      const bg = card.getData('bg') as Phaser.GameObjects.Rectangle;
      const cooldownText = card.getData('cooldownText') as Phaser.GameObjects.Text;

      // Update cooldown display
      if (ability.currentCooldown > 0) {
        cooldownText.setText(`Cooldown: ${ability.currentCooldown}`);
      } else {
        cooldownText.setText('');
      }

      // Gray out unusable cards
      if (!ability.canUse(this.combatState.player.currentMana)) {
        bg.setAlpha(0.5);
      } else {
        bg.setAlpha(1);
      }
    });
  }

  private updateHealthBar(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    character: Character
  ): void {
    graphics.clear();

    const barWidth = 120;
    const barHeight = 12;

    // Background
    graphics.fillStyle(0x333333);
    graphics.fillRect(x - barWidth / 2, y, barWidth, barHeight);

    // Health
    const healthPercent = character.getHealthPercentage() / 100;
    const healthColor = healthPercent > 0.5 ? 0x00ff00 : healthPercent > 0.25 ? 0xffaa00 : 0xff0000;
    graphics.fillStyle(healthColor);
    graphics.fillRect(x - barWidth / 2, y, barWidth * healthPercent, barHeight);

    // Border
    graphics.lineStyle(2, 0xffffff);
    graphics.strokeRect(x - barWidth / 2, y, barWidth, barHeight);
  }

  private updateManaBar(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    character: Character
  ): void {
    graphics.clear();

    const barWidth = 120;
    const barHeight = 8;

    // Background
    graphics.fillStyle(0x333333);
    graphics.fillRect(x - barWidth / 2, y, barWidth, barHeight);

    // Mana
    const manaPercent = character.getManaPercentage() / 100;
    graphics.fillStyle(0x4ecdc4);
    graphics.fillRect(x - barWidth / 2, y, barWidth * manaPercent, barHeight);

    // Border
    graphics.lineStyle(1, 0xffffff);
    graphics.strokeRect(x - barWidth / 2, y, barWidth, barHeight);
  }

  private showGameOver(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Dim background
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);

    const winner = this.combatState.getWinner();
    const isVictory = winner === this.combatState.player;

    // Game over text
    const gameOverText = this.add.text(width / 2, height / 2 - 80, isVictory ? 'VICTORY!' : 'DEFEAT!', {
      font: 'bold 64px monospace',
      color: isVictory ? '#4ecdc4' : '#ff6b6b'
    });
    gameOverText.setOrigin(0.5);

    const resultText = this.add.text(
      width / 2,
      height / 2,
      isVictory
        ? `You defeated the ${this.combatState.enemy.name}!`
        : `You were defeated by the ${this.combatState.enemy.name}...`,
      {
        font: '20px monospace',
        color: '#ffffff'
      }
    );
    resultText.setOrigin(0.5);

    // Buttons
    const restartButton = this.createGameOverButton(width / 2 - 110, height / 2 + 80, 'Restart', () => {
      this.scene.restart();
    });

    const menuButton = this.createGameOverButton(width / 2 + 110, height / 2 + 80, 'Main Menu', () => {
      this.scene.start('MainMenuScene');
    });

    // Animate
    this.tweens.add({
      targets: gameOverText,
      scale: { from: 0, to: 1 },
      duration: 500,
      ease: 'Back.easeOut'
    });
  }

  private createGameOverButton(
    x: number,
    y: number,
    text: string,
    callback: () => void
  ): Phaser.GameObjects.Container {
    const button = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, 180, 50, 0x4ecdc4);
    bg.setStrokeStyle(2, 0xffffff);

    const label = this.add.text(0, 0, text, {
      font: 'bold 18px monospace',
      color: '#1a1a2e'
    });
    label.setOrigin(0.5);

    button.add([bg, label]);
    button.setSize(180, 50);
    button.setInteractive(
      new Phaser.Geom.Rectangle(-90, -25, 180, 50),
      Phaser.Geom.Rectangle.Contains
    );

    button.on('pointerover', () => {
      bg.setFillStyle(0x5fded7);
      this.game.canvas.style.cursor = 'pointer';
    });

    button.on('pointerout', () => {
      bg.setFillStyle(0x4ecdc4);
      this.game.canvas.style.cursor = 'default';
    });

    button.on('pointerdown', () => {
      callback();
    });

    return button;
  }
}
