import Phaser from 'phaser';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' });
  }

  create(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    // Title
    const title = this.add.text(width / 2, height / 3, 'PRAVI RPG', {
      font: 'bold 64px monospace',
      color: '#ff6b6b'
    });
    title.setOrigin(0.5);

    const subtitle = this.add.text(width / 2, height / 3 + 60, 'Turn-Based Combat System', {
      font: '24px monospace',
      color: '#4ecdc4'
    });
    subtitle.setOrigin(0.5);

    // Create animated title effect
    this.tweens.add({
      targets: title,
      scale: { from: 1, to: 1.05 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // Start button
    const startButton = this.createButton(width / 2, height / 2 + 50, 'Start Game', () => {
      this.scene.start('CombatScene');
    });

    // Instructions
    const instructions = this.add.text(width / 2, height - 100,
      'Click on ability cards to attack\nDefeat the enemy to win!', {
      font: '16px monospace',
      color: '#ffffff',
      align: 'center'
    });
    instructions.setOrigin(0.5);

    // Credits
    const credits = this.add.text(width / 2, height - 30,
      'Built with Phaser 3 + TypeScript', {
      font: '12px monospace',
      color: '#666666'
    });
    credits.setOrigin(0.5);
  }

  private createButton(
    x: number,
    y: number,
    text: string,
    callback: () => void
  ): Phaser.GameObjects.Container {
    const button = this.add.container(x, y);

    const bg = this.add.rectangle(0, 0, 200, 50, 0x4ecdc4);
    bg.setStrokeStyle(2, 0xffffff);

    const label = this.add.text(0, 0, text, {
      font: 'bold 20px monospace',
      color: '#1a1a2e'
    });
    label.setOrigin(0.5);

    button.add([bg, label]);
    button.setSize(200, 50);
    button.setInteractive(
      new Phaser.Geom.Rectangle(-100, -25, 200, 50),
      Phaser.Geom.Rectangle.Contains
    );

    // Hover effects
    button.on('pointerover', () => {
      bg.setFillStyle(0x5fded7);
      this.game.canvas.style.cursor = 'pointer';
    });

    button.on('pointerout', () => {
      bg.setFillStyle(0x4ecdc4);
      this.game.canvas.style.cursor = 'default';
    });

    button.on('pointerdown', () => {
      bg.setFillStyle(0x3dbdb6);
    });

    button.on('pointerup', () => {
      bg.setFillStyle(0x5fded7);
      callback();
    });

    return button;
  }
}
