import Phaser from 'phaser';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' });
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Create gradient background
    this.createGradientBackground();

    // Create floating particles
    this.createAmbientParticles();

    // Title with glow effect
    const title = this.add.text(width / 2, height / 3, 'PRAVI RPG', {
      font: 'bold 76px Arial',
      color: '#ffffff',
      stroke: '#ff6b6b',
      strokeThickness: 6
    });
    title.setOrigin(0.5);

    // Subtitle
    const subtitle = this.add.text(width / 2, height / 3 + 70, 'Turn-Based Combat System', {
      font: '28px Arial',
      color: '#4ecdc4',
      stroke: '#000000',
      strokeThickness: 2
    });
    subtitle.setOrigin(0.5);

    // Tagline
    const tagline = this.add.text(width / 2, height / 3 + 110, 'MTG meets Baldur\'s Gate', {
      font: 'italic 18px Arial',
      color: '#b0b0b0'
    });
    tagline.setOrigin(0.5);

    // Create animated title effect
    this.tweens.add({
      targets: title,
      scale: { from: 1, to: 1.05 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    this.tweens.add({
      targets: subtitle,
      alpha: { from: 0.8, to: 1 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Start button with modern design
    const startButton = this.createButton(width / 2, height / 2 + 60, 'Start Game', () => {
      this.cameras.main.fadeOut(500);
      this.time.delayedCall(500, () => {
        this.scene.start('CombatScene');
      });
    });

    // Instructions box
    const instructionsBox = this.add.graphics();
    instructionsBox.fillGradientStyle(0x16213e, 0x16213e, 0x0f1626, 0x0f1626, 0.8, 0.8, 0.9, 0.9);
    instructionsBox.fillRoundedRect(width / 2 - 200, height - 180, 400, 120, 12);
    instructionsBox.lineStyle(2, 0x4ecdc4, 0.6);
    instructionsBox.strokeRoundedRect(width / 2 - 200, height - 180, 400, 120, 12);

    const instructions = this.add.text(width / 2, height - 150,
      '⚔️  Click ability cards to use them\n✨  Manage your mana wisely\n🛡️  Defend and heal strategically\n🎯  Defeat the Dark Knight to win!', {
      font: '15px Arial',
      color: '#e0e0e0',
      align: 'center',
      lineSpacing: 8
    });
    instructions.setOrigin(0.5);

    // Credits
    const credits = this.add.text(width / 2, height - 25,
      'Built with Phaser 3 + TypeScript', {
      font: '13px Arial',
      color: '#666666'
    });
    credits.setOrigin(0.5);

    // Fade in
    this.cameras.main.fadeIn(800);
  }

  private createGradientBackground(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Base background
    const bg1 = this.add.rectangle(width / 2, height / 2, width, height, 0x0f0e17);

    const graphics = this.add.graphics();

    // Create radial gradient effect using multiple rectangles
    graphics.fillGradientStyle(0x4a1f5e, 0x4a1f5e, 0x1a1a2e, 0x1a1a2e, 0.8, 0.8, 0.5, 0.5);
    graphics.fillRect(0, 0, width, height / 2);

    graphics.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x0f0e17, 0x0f0e17, 0.5, 0.5, 1, 1);
    graphics.fillRect(0, height / 2, width, height / 2);

    // Decorative stars
    for (let i = 0; i < 40; i++) {
      const star = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        Phaser.Math.Between(1, 4),
        0xffffff,
        Phaser.Math.FloatBetween(0.2, 0.7)
      );

      this.tweens.add({
        targets: star,
        alpha: { from: star.alpha, to: 0 },
        duration: Phaser.Math.Between(2000, 5000),
        yoyo: true,
        repeat: -1
      });
    }
  }

  private createAmbientParticles(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    for (let i = 0; i < 20; i++) {
      const isBlue = Math.random() > 0.5;
      const particle = this.add.circle(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        Phaser.Math.Between(2, 5),
        isBlue ? 0x4ecdc4 : 0xff6b6b,
        0.4
      );

      this.tweens.add({
        targets: particle,
        y: particle.y - Phaser.Math.Between(100, 200),
        x: particle.x + Phaser.Math.Between(-30, 30),
        alpha: 0,
        duration: Phaser.Math.Between(4000, 8000),
        repeat: -1,
        onRepeat: () => {
          particle.x = Phaser.Math.Between(0, width);
          particle.y = height;
          particle.alpha = 0.4;
        }
      });
    }
  }

  private createButton(
    x: number,
    y: number,
    text: string,
    callback: () => void
  ): Phaser.GameObjects.Container {
    const button = this.add.container(x, y);

    // Modern button with gradient
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0xff6b6b, 0xff6b6b, 0xcc5555, 0xcc5555, 1, 1, 1, 1);
    graphics.fillRoundedRect(-120, -30, 240, 60, 12);
    graphics.lineStyle(3, 0xffffff, 1);
    graphics.strokeRoundedRect(-120, -30, 240, 60, 12);

    const label = this.add.text(0, 0, text, {
      font: 'bold 24px Arial',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    });
    label.setOrigin(0.5);

    button.add([graphics, label]);
    button.setSize(240, 60);
    button.setData('graphics', graphics);

    // FIXED: Proper hitbox covering entire button
    button.setInteractive(
      new Phaser.Geom.Rectangle(-120, -30, 240, 60),
      Phaser.Geom.Rectangle.Contains
    );

    // Hover effects
    button.on('pointerover', () => {
      this.game.canvas.style.cursor = 'pointer';

      // Enlarge button
      this.tweens.add({
        targets: button,
        scale: 1.05,
        duration: 150,
        ease: 'Power2'
      });

      // Change color
      graphics.clear();
      graphics.fillGradientStyle(0xff8888, 0xff8888, 0xdd6666, 0xdd6666, 1, 1, 1, 1);
      graphics.fillRoundedRect(-120, -30, 240, 60, 12);
      graphics.lineStyle(4, 0xffffff, 1);
      graphics.strokeRoundedRect(-120, -30, 240, 60, 12);
    });

    button.on('pointerout', () => {
      this.game.canvas.style.cursor = 'default';

      // Return to normal size
      this.tweens.add({
        targets: button,
        scale: 1,
        duration: 150,
        ease: 'Power2'
      });

      // Reset color
      graphics.clear();
      graphics.fillGradientStyle(0xff6b6b, 0xff6b6b, 0xcc5555, 0xcc5555, 1, 1, 1, 1);
      graphics.fillRoundedRect(-120, -30, 240, 60, 12);
      graphics.lineStyle(3, 0xffffff, 1);
      graphics.strokeRoundedRect(-120, -30, 240, 60, 12);
    });

    button.on('pointerdown', () => {
      graphics.clear();
      graphics.fillGradientStyle(0xcc5555, 0xcc5555, 0xaa4444, 0xaa4444, 1, 1, 1, 1);
      graphics.fillRoundedRect(-120, -30, 240, 60, 12);
      graphics.lineStyle(3, 0xffffff, 1);
      graphics.strokeRoundedRect(-120, -30, 240, 60, 12);
    });

    button.on('pointerup', () => {
      callback();
    });

    // Idle pulse animation
    this.tweens.add({
      targets: button,
      alpha: { from: 0.9, to: 1 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    return button;
  }
}
