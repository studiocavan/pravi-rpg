import Phaser from 'phaser';
import { Character } from '../models/Character';
import { CombatState, CombatPhase } from '../models/CombatState';
import { Ability, ABILITIES_LIBRARY, AbilityType } from '../models/Ability';
import { CharacterSprite } from '../sprites/CharacterSprite';
import { ParticleEffects } from '../effects/ParticleEffects';

export class CombatScene extends Phaser.Scene {
  private combatState!: CombatState;
  private playerSprite!: CharacterSprite;
  private enemySprite!: CharacterSprite;
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

    // Create gradient background
    this.createGradientBackground();

    // Create floating particles
    this.createAmbientParticles();

    // Create title with glow effect
    const title = this.add.text(width / 2, 30, 'COMBAT', {
      font: 'bold 36px Arial',
      color: '#ffffff',
      stroke: '#ff6b6b',
      strokeThickness: 4
    });
    title.setOrigin(0.5);
    this.tweens.add({
      targets: title,
      alpha: { from: 0.8, to: 1 },
      duration: 1000,
      yoyo: true,
      repeat: -1
    });

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

  private createGradientBackground(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Create multiple gradient layers for depth
    const bg1 = this.add.rectangle(width / 2, height / 2, width, height, 0x0f0e17);

    const graphics = this.add.graphics();

    // Top gradient
    graphics.fillGradientStyle(0x3d1f47, 0x3d1f47, 0x1a1a2e, 0x1a1a2e, 1, 1, 0.7, 0.7);
    graphics.fillRect(0, 0, width, height / 2);

    // Bottom gradient
    graphics.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x0f0e17, 0x0f0e17, 0.7, 0.7, 1, 1);
    graphics.fillRect(0, height / 2, width, height / 2);

    // Add some decorative elements
    for (let i = 0; i < 30; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height / 2),
        Phaser.Math.Between(1, 3),
        0xffffff,
        Phaser.Math.FloatBetween(0.3, 0.8)
      );

      this.tweens.add({
        targets: star,
        alpha: { from: star.alpha, to: 0 },
        duration: Phaser.Math.Between(2000, 4000),
        yoyo: true,
        repeat: -1
      });
    }
  }

  private createAmbientParticles(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    for (let i = 0; i < 15; i++) {
      const particle = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        Phaser.Math.Between(2, 4),
        0x4ecdc4,
        0.3
      );

      this.tweens.add({
        targets: particle,
        y: particle.y - Phaser.Math.Between(50, 150),
        x: particle.x + Phaser.Math.Between(-20, 20),
        alpha: 0,
        duration: Phaser.Math.Between(3000, 6000),
        repeat: -1,
        onRepeat: () => {
          particle.x = Phaser.Math.Between(0, width);
          particle.y = height;
          particle.alpha = 0.3;
        }
      });
    }
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

    // Player sprite (left side) - artsy hero character
    this.playerSprite = new CharacterSprite(this, 250, height / 2, true);

    const playerLabel = this.add.text(250, height / 2 + 130, 'HERO', {
      font: 'bold 22px Arial',
      color: '#4ecdc4',
      stroke: '#000000',
      strokeThickness: 3
    });
    playerLabel.setOrigin(0.5);

    // Enemy sprite (right side) - artsy dark knight character
    this.enemySprite = new CharacterSprite(this, width - 250, height / 2, false);

    const enemyLabel = this.add.text(width - 250, height / 2 + 130, 'DARK KNIGHT', {
      font: 'bold 22px Arial',
      color: '#ff6b6b',
      stroke: '#000000',
      strokeThickness: 3
    });
    enemyLabel.setOrigin(0.5);
  }

  private createHealthBars(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Player health bar
    this.playerHealthBar = this.add.graphics();
    this.playerManaBar = this.add.graphics();

    this.playerStatsText = this.add.text(250, height / 2 - 130, '', {
      font: 'bold 15px Arial',
      color: '#ffffff',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 2
    });
    this.playerStatsText.setOrigin(0.5);

    // Enemy health bar
    this.enemyHealthBar = this.add.graphics();

    this.enemyStatsText = this.add.text(width - 250, height / 2 - 130, '', {
      font: 'bold 15px Arial',
      color: '#ffffff',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 2
    });
    this.enemyStatsText.setOrigin(0.5);
  }

  private createTurnIndicator(): void {
    const width = this.cameras.main.width;

    this.turnText = this.add.text(width / 2, 85, '', {
      font: 'bold 26px Arial',
      color: '#4ecdc4',
      stroke: '#000000',
      strokeThickness: 3
    });
    this.turnText.setOrigin(0.5);
  }

  private createCombatLog(): void {
    const width = this.cameras.main.width;

    // Modern log background with gradient
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x16213e, 0x16213e, 0x0f1626, 0x0f1626, 0.9, 0.9, 0.95, 0.95);
    graphics.fillRoundedRect(width / 2 - 260, 120, 520, 100, 12);
    graphics.lineStyle(3, 0x4ecdc4, 0.8);
    graphics.strokeRoundedRect(width / 2 - 260, 120, 520, 100, 12);

    this.logText = this.add.text(width / 2, 170, '', {
      font: '13px Arial',
      color: '#e0e0e0',
      align: 'center',
      wordWrap: { width: 500 }
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

    // Determine card color based on ability type
    let cardColor = 0x1a2332;
    let accentColor = 0x4ecdc4;

    switch (ability.type) {
      case AbilityType.ATTACK:
        accentColor = 0xff6b6b;
        break;
      case AbilityType.HEAL:
        accentColor = 0x00ff88;
        break;
      case AbilityType.DEFEND:
        accentColor = 0x4ecdc4;
        break;
      case AbilityType.SPECIAL:
        accentColor = 0xffd700;
        break;
    }

    // Card background with gradient
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(cardColor, cardColor, 0x0f1626, 0x0f1626, 1, 1, 1, 1);
    graphics.fillRoundedRect(-58, -73, 116, 146, 8);
    graphics.lineStyle(3, accentColor, 1);
    graphics.strokeRoundedRect(-58, -73, 116, 146, 8);

    // Card name
    const name = this.add.text(0, -52, ability.name, {
      font: 'bold 13px Arial',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: 105 }
    });
    name.setOrigin(0.5);

    // Mana cost with modern styling
    const manaCircle = this.add.circle(-48, -63, 14, accentColor);
    manaCircle.setStrokeStyle(2, 0xffffff);

    const manaCost = this.add.text(-48, -63, ability.manaCost.toString(), {
      font: 'bold 17px Arial',
      color: '#ffffff'
    });
    manaCost.setOrigin(0.5);

    // Type indicator icon
    const typeIcon = this.add.text(48, -63, this.getAbilityIcon(ability.type), {
      font: '16px Arial',
      color: '#' + accentColor.toString(16).padStart(6, '0')
    });
    typeIcon.setOrigin(0.5);

    // Description
    const desc = this.add.text(0, 0, ability.description, {
      font: '11px Arial',
      color: '#b0b0b0',
      align: 'center',
      wordWrap: { width: 105 }
    });
    desc.setOrigin(0.5);

    // Cooldown indicator
    const cooldownText = this.add.text(0, 55, '', {
      font: 'bold 12px Arial',
      color: '#ff6b6b'
    });
    cooldownText.setOrigin(0.5);

    card.add([graphics, manaCircle, manaCost, typeIcon, name, desc, cooldownText]);
    card.setSize(116, 146);
    card.setData('ability', ability);
    card.setData('graphics', graphics);
    card.setData('cooldownText', cooldownText);
    card.setData('accentColor', accentColor);
    card.setData('originalY', y);

    // FIXED: Make entire card clickable by using proper bounds
    card.setInteractive(
      new Phaser.Geom.Rectangle(-58, -73, 116, 146),
      Phaser.Geom.Rectangle.Contains
    );

    // Enhanced hover effects
    card.on('pointerover', () => {
      if (ability.canUse(this.combatState.player.currentMana) &&
          this.combatState.phase === CombatPhase.PLAYER_TURN) {
        this.game.canvas.style.cursor = 'pointer';

        // Lift card up
        this.tweens.add({
          targets: card,
          y: y - 15,
          scale: 1.05,
          duration: 150,
          ease: 'Power2'
        });

        // Redraw with highlight
        graphics.clear();
        graphics.fillGradientStyle(0x2a3545, 0x2a3545, 0x1a2332, 0x1a2332, 1, 1, 1, 1);
        graphics.fillRoundedRect(-58, -73, 116, 146, 8);
        graphics.lineStyle(4, accentColor, 1);
        graphics.strokeRoundedRect(-58, -73, 116, 146, 8);
      }
    });

    card.on('pointerout', () => {
      this.game.canvas.style.cursor = 'default';

      // Return to original position
      this.tweens.add({
        targets: card,
        y: y,
        scale: 1,
        duration: 150,
        ease: 'Power2'
      });

      // Redraw normal
      graphics.clear();
      graphics.fillGradientStyle(cardColor, cardColor, 0x0f1626, 0x0f1626, 1, 1, 1, 1);
      graphics.fillRoundedRect(-58, -73, 116, 146, 8);
      graphics.lineStyle(3, accentColor, 1);
      graphics.strokeRoundedRect(-58, -73, 116, 146, 8);
    });

    card.on('pointerdown', () => {
      this.onAbilityClicked(ability);
    });

    return card;
  }

  private getAbilityIcon(type: AbilityType): string {
    switch (type) {
      case AbilityType.ATTACK: return '⚔️';
      case AbilityType.HEAL: return '❤️';
      case AbilityType.DEFEND: return '🛡️';
      case AbilityType.SPECIAL: return '✨';
      default: return '•';
    }
  }

  private createEndTurnButton(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const button = this.add.container(width - 140, height - 60);

    // Modern button with gradient
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0xff6b6b, 0xff6b6b, 0xcc5555, 0xcc5555, 1, 1, 1, 1);
    graphics.fillRoundedRect(-95, -25, 190, 50, 10);
    graphics.lineStyle(3, 0xffffff, 1);
    graphics.strokeRoundedRect(-95, -25, 190, 50, 10);

    const label = this.add.text(0, 0, 'End Turn', {
      font: 'bold 18px Arial',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2
    });
    label.setOrigin(0.5);

    button.add([graphics, label]);
    button.setSize(190, 50);
    button.setData('graphics', graphics);

    // FIXED: Proper hitbox covering entire button
    button.setInteractive(
      new Phaser.Geom.Rectangle(-95, -25, 190, 50),
      Phaser.Geom.Rectangle.Contains
    );

    button.on('pointerover', () => {
      if (this.combatState.phase === CombatPhase.PLAYER_TURN) {
        this.game.canvas.style.cursor = 'pointer';
        graphics.clear();
        graphics.fillGradientStyle(0xff8888, 0xff8888, 0xdd6666, 0xdd6666, 1, 1, 1, 1);
        graphics.fillRoundedRect(-95, -25, 190, 50, 10);
        graphics.lineStyle(4, 0xffffff, 1);
        graphics.strokeRoundedRect(-95, -25, 190, 50, 10);
      }
    });

    button.on('pointerout', () => {
      this.game.canvas.style.cursor = 'default';
      graphics.clear();
      graphics.fillGradientStyle(0xff6b6b, 0xff6b6b, 0xcc5555, 0xcc5555, 1, 1, 1, 1);
      graphics.fillRoundedRect(-95, -25, 190, 50, 10);
      graphics.lineStyle(3, 0xffffff, 1);
      graphics.strokeRoundedRect(-95, -25, 190, 50, 10);
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
      this.playAbilityAnimation(ability, this.playerSprite, this.enemySprite);
      this.updateUI();

      // Check if combat is over
      if (this.combatState.isGameOver()) {
        if (this.combatState.enemy.isDead) {
          this.enemySprite.playDeathAnimation();
        }
        this.time.delayedCall(1500, () => {
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

      this.playAbilityAnimation(randomAbility, this.enemySprite, this.playerSprite);
      this.updateUI();

      // Check if combat is over
      if (this.combatState.isGameOver()) {
        if (this.combatState.player.isDead) {
          this.playerSprite.playDeathAnimation();
        }
        this.time.delayedCall(1500, () => {
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

  private playAbilityAnimation(ability: Ability, attacker: CharacterSprite, target: CharacterSprite): void {
    const attackerContainer = attacker.getContainer();
    const targetContainer = target.getContainer();

    // Play different effects based on ability
    if (ability.id === 'fireball' || ability.id === 'arcane_missiles') {
      attacker.playAttackAnimation(() => {
        ParticleEffects.createFireballEffect(
          this,
          attackerContainer.x,
          attackerContainer.y,
          targetContainer.x,
          targetContainer.y,
          () => target.playHitAnimation()
        );
      });
    } else if (ability.id === 'lightning') {
      ParticleEffects.createLightningEffect(
        this,
        targetContainer.x,
        targetContainer.y - 20,
        () => target.playHitAnimation()
      );
    } else if (ability.id === 'heal') {
      ParticleEffects.createHealEffect(
        this,
        attackerContainer.x,
        attackerContainer.y
      );
    } else if (ability.id === 'defend') {
      ParticleEffects.createDefendEffect(
        this,
        attackerContainer.x,
        attackerContainer.y
      );
    } else {
      // Default melee attack
      attacker.playAttackAnimation(() => {
        ParticleEffects.createSlashEffect(
          this,
          targetContainer.x,
          targetContainer.y
        );
        target.playHitAnimation();
      });
    }
  }

  private updateUI(): void {
    // Update health bars with modern style
    this.updateHealthBar(
      this.playerHealthBar,
      250,
      this.cameras.main.height / 2 - 105,
      this.combatState.player
    );

    this.updateHealthBar(
      this.enemyHealthBar,
      this.cameras.main.width - 250,
      this.cameras.main.height / 2 - 105,
      this.combatState.enemy
    );

    // Update mana bar
    this.updateManaBar(
      this.playerManaBar,
      250,
      this.cameras.main.height / 2 - 85,
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
    const recentLogs = this.combatState.combatLog.slice(-4);
    this.logText.setText(recentLogs.map(log => log.message).join('\n'));

    // Update ability cards
    this.abilityCards.forEach(card => {
      const ability = card.getData('ability') as Ability;
      const graphics = card.getData('graphics') as Phaser.GameObjects.Graphics;
      const cooldownText = card.getData('cooldownText') as Phaser.GameObjects.Text;
      const accentColor = card.getData('accentColor') as number;

      // Update cooldown display
      if (ability.currentCooldown > 0) {
        cooldownText.setText(`CD: ${ability.currentCooldown}`);
      } else {
        cooldownText.setText('');
      }

      // Gray out unusable cards
      if (!ability.canUse(this.combatState.player.currentMana)) {
        card.setAlpha(0.5);
      } else {
        card.setAlpha(1);
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

    const barWidth = 140;
    const barHeight = 16;

    // Shadow
    graphics.fillStyle(0x000000, 0.3);
    graphics.fillRoundedRect(x - barWidth / 2 + 2, y + 2, barWidth, barHeight, 4);

    // Background
    graphics.fillStyle(0x2d2d44);
    graphics.fillRoundedRect(x - barWidth / 2, y, barWidth, barHeight, 4);

    // Health with gradient effect
    const healthPercent = character.getHealthPercentage() / 100;
    const healthWidth = barWidth * healthPercent;

    let color1, color2;
    if (healthPercent > 0.5) {
      color1 = 0x00ff88;
      color2 = 0x00dd66;
    } else if (healthPercent > 0.25) {
      color1 = 0xffaa00;
      color2 = 0xdd8800;
    } else {
      color1 = 0xff3333;
      color2 = 0xdd0000;
    }

    graphics.fillGradientStyle(color1, color1, color2, color2, 1, 1, 1, 1);
    graphics.fillRoundedRect(x - barWidth / 2, y, healthWidth, barHeight, 4);

    // Border
    graphics.lineStyle(2, 0xffffff, 0.8);
    graphics.strokeRoundedRect(x - barWidth / 2, y, barWidth, barHeight, 4);
  }

  private updateManaBar(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    character: Character
  ): void {
    graphics.clear();

    const barWidth = 140;
    const barHeight = 10;

    // Shadow
    graphics.fillStyle(0x000000, 0.3);
    graphics.fillRoundedRect(x - barWidth / 2 + 2, y + 2, barWidth, barHeight, 3);

    // Background
    graphics.fillStyle(0x2d2d44);
    graphics.fillRoundedRect(x - barWidth / 2, y, barWidth, barHeight, 3);

    // Mana with gradient
    const manaPercent = character.getManaPercentage() / 100;
    const manaWidth = barWidth * manaPercent;

    graphics.fillGradientStyle(0x4ecdc4, 0x4ecdc4, 0x3dbdb6, 0x3dbdb6, 1, 1, 1, 1);
    graphics.fillRoundedRect(x - barWidth / 2, y, manaWidth, barHeight, 3);

    // Border
    graphics.lineStyle(2, 0xffffff, 0.6);
    graphics.strokeRoundedRect(x - barWidth / 2, y, barWidth, barHeight, 3);
  }

  private showGameOver(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Dim background with gradient
    const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.85);

    const winner = this.combatState.getWinner();
    const isVictory = winner === this.combatState.player;

    // Game over text with glow
    const gameOverText = this.add.text(width / 2, height / 2 - 100, isVictory ? 'VICTORY!' : 'DEFEAT!', {
      font: 'bold 72px Arial',
      color: '#ffffff',
      stroke: isVictory ? '#4ecdc4' : '#ff6b6b',
      strokeThickness: 6
    });
    gameOverText.setOrigin(0.5);

    const resultText = this.add.text(
      width / 2,
      height / 2 - 10,
      isVictory
        ? `You defeated the ${this.combatState.enemy.name}!`
        : `You were defeated by the ${this.combatState.enemy.name}...`,
      {
        font: '22px Arial',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2
      }
    );
    resultText.setOrigin(0.5);

    // Buttons
    const restartButton = this.createGameOverButton(width / 2 - 120, height / 2 + 90, 'Restart', () => {
      this.scene.restart();
    });

    const menuButton = this.createGameOverButton(width / 2 + 120, height / 2 + 90, 'Main Menu', () => {
      this.scene.start('MainMenuScene');
    });

    // Animate
    this.tweens.add({
      targets: gameOverText,
      scale: { from: 0, to: 1 },
      duration: 600,
      ease: 'Back.easeOut'
    });

    // Victory particles
    if (isVictory) {
      for (let i = 0; i < 50; i++) {
        const particle = this.add.circle(
          width / 2,
          height / 2 - 100,
          Phaser.Math.Between(3, 8),
          0x4ecdc4
        );

        this.tweens.add({
          targets: particle,
          x: width / 2 + Phaser.Math.Between(-200, 200),
          y: height / 2 - 100 + Phaser.Math.Between(-150, 150),
          alpha: 0,
          scale: 0,
          duration: 1500,
          delay: i * 20,
          ease: 'Power2'
        });
      }
    }
  }

  private createGameOverButton(
    x: number,
    y: number,
    text: string,
    callback: () => void
  ): Phaser.GameObjects.Container {
    const button = this.add.container(x, y);

    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x4ecdc4, 0x4ecdc4, 0x3dbdb6, 0x3dbdb6, 1, 1, 1, 1);
    graphics.fillRoundedRect(-95, -28, 190, 56, 10);
    graphics.lineStyle(3, 0xffffff);
    graphics.strokeRoundedRect(-95, -28, 190, 56, 10);

    const label = this.add.text(0, 0, text, {
      font: 'bold 20px Arial',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    });
    label.setOrigin(0.5);

    button.add([graphics, label]);
    button.setSize(190, 56);
    button.setData('graphics', graphics);

    // FIXED: Proper hitbox
    button.setInteractive(
      new Phaser.Geom.Rectangle(-95, -28, 190, 56),
      Phaser.Geom.Rectangle.Contains
    );

    button.on('pointerover', () => {
      this.game.canvas.style.cursor = 'pointer';
      graphics.clear();
      graphics.fillGradientStyle(0x5fded7, 0x5fded7, 0x4ecdc4, 0x4ecdc4, 1, 1, 1, 1);
      graphics.fillRoundedRect(-95, -28, 190, 56, 10);
      graphics.lineStyle(4, 0xffffff);
      graphics.strokeRoundedRect(-95, -28, 190, 56, 10);
    });

    button.on('pointerout', () => {
      this.game.canvas.style.cursor = 'default';
      graphics.clear();
      graphics.fillGradientStyle(0x4ecdc4, 0x4ecdc4, 0x3dbdb6, 0x3dbdb6, 1, 1, 1, 1);
      graphics.fillRoundedRect(-95, -28, 190, 56, 10);
      graphics.lineStyle(3, 0xffffff);
      graphics.strokeRoundedRect(-95, -28, 190, 56, 10);
    });

    button.on('pointerdown', () => {
      callback();
    });

    return button;
  }
}
