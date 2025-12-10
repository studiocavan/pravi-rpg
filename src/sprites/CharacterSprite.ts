import Phaser from 'phaser';

export class CharacterSprite {
  private scene: Phaser.Scene;
  private container: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene, x: number, y: number, isPlayer: boolean) {
    this.scene = scene;
    this.container = scene.add.container(x, y);

    if (isPlayer) {
      this.createHero();
    } else {
      this.createDarkKnight();
    }
  }

  private createHero(): void {
    // Body (torso with gradient effect)
    const body = this.scene.add.ellipse(0, 10, 60, 80, 0x4ecdc4);
    body.setStrokeStyle(3, 0x3dbdb6);

    // Cape
    const cape = this.scene.add.triangle(
      -5, 0,
      -30, -10,
      -35, 60,
      -20, 70,
      0x2a9d8f
    );
    cape.setStrokeStyle(2, 0x264653);

    // Legs
    const leftLeg = this.scene.add.ellipse(-15, 55, 20, 50, 0x3dbdb6);
    const rightLeg = this.scene.add.ellipse(15, 55, 20, 50, 0x3dbdb6);

    // Head
    const head = this.scene.add.circle(0, -35, 22, 0xf4a261);
    head.setStrokeStyle(2, 0xe76f51);

    // Eyes
    const leftEye = this.scene.add.circle(-8, -38, 4, 0x264653);
    const rightEye = this.scene.add.circle(8, -38, 4, 0x264653);

    // Mouth (smile)
    const mouth = this.scene.add.arc(0, -28, 8, 0, 180, false, 0x264653);
    mouth.setStrokeStyle(2, 0x264653);
    mouth.isFilled = false;

    // Helmet/Crown
    const helmet = this.scene.add.polygon(
      0, -50,
      [
        [-18, 0],
        [-15, -15],
        [0, -20],
        [15, -15],
        [18, 0]
      ],
      0xffd700
    );
    helmet.setStrokeStyle(2, 0xffa500);

    // Sword
    const swordHandle = this.scene.add.rectangle(35, 20, 8, 30, 0x8b4513);
    const swordBlade = this.scene.add.polygon(
      35, -10,
      [
        [-6, 20],
        [0, -30],
        [6, 20]
      ],
      0xc0c0c0
    );
    swordBlade.setStrokeStyle(2, 0xffffff);

    // Shield
    const shield = this.scene.add.ellipse(-35, 15, 25, 35, 0x2a9d8f);
    shield.setStrokeStyle(3, 0xffd700);
    const shieldCross = this.scene.add.star(-35, 15, 4, 8, 12, 0xffd700);

    // Assemble
    this.container.add([
      cape, leftLeg, rightLeg, shield, body, swordHandle, swordBlade,
      head, leftEye, rightEye, mouth, helmet, shieldCross
    ]);

    // Add idle animation
    this.scene.tweens.add({
      targets: this.container,
      y: this.container.y - 5,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  private createDarkKnight(): void {
    // Shadow/aura
    const aura = this.scene.add.circle(0, 20, 70, 0x4a0e4e, 0.3);
    this.scene.tweens.add({
      targets: aura,
      scale: { from: 1, to: 1.2 },
      alpha: { from: 0.3, to: 0.1 },
      duration: 2000,
      yoyo: true,
      repeat: -1
    });

    // Legs
    const leftLeg = this.scene.add.ellipse(-15, 55, 22, 50, 0x1a1a2e);
    leftLeg.setStrokeStyle(2, 0xff6b6b);
    const rightLeg = this.scene.add.ellipse(15, 55, 22, 50, 0x1a1a2e);
    rightLeg.setStrokeStyle(2, 0xff6b6b);

    // Body (armored)
    const body = this.scene.add.ellipse(0, 10, 65, 85, 0x2d2d44);
    body.setStrokeStyle(4, 0x8b0000);

    // Armor plates
    const chestPlate = this.scene.add.ellipse(0, 0, 45, 50, 0x4a0e4e);
    chestPlate.setStrokeStyle(2, 0xff6b6b);

    // Cape
    const cape = this.scene.add.polygon(
      5, 0,
      [
        [0, -20],
        [40, -15],
        [45, 65],
        [35, 75],
        [5, 40]
      ],
      0x1a0a1a
    );
    cape.setStrokeStyle(2, 0x8b0000);

    // Head/Helmet
    const head = this.scene.add.ellipse(0, -35, 28, 30, 0x1a1a2e);
    head.setStrokeStyle(3, 0x8b0000);

    // Helmet horns
    const leftHorn = this.scene.add.polygon(
      -20, -50,
      [
        [0, 0],
        [-5, -20],
        [5, -18]
      ],
      0x4a0e4e
    );
    const rightHorn = this.scene.add.polygon(
      20, -50,
      [
        [0, 0],
        [5, -20],
        [-5, -18]
      ],
      0x4a0e4e
    );

    // Glowing eyes
    const leftEye = this.scene.add.circle(-10, -35, 5, 0xff0000);
    leftEye.setStrokeStyle(2, 0xff6b6b);
    const rightEye = this.scene.add.circle(10, -35, 5, 0xff0000);
    rightEye.setStrokeStyle(2, 0xff6b6b);

    // Eye glow effect
    this.scene.tweens.add({
      targets: [leftEye, rightEye],
      alpha: { from: 1, to: 0.4 },
      duration: 1000,
      yoyo: true,
      repeat: -1
    });

    // Large sword
    const swordHandle = this.scene.add.rectangle(40, 30, 10, 35, 0x4a0e4e);
    swordHandle.setStrokeStyle(2, 0xff0000);
    const swordBlade = this.scene.add.polygon(
      40, -20,
      [
        [-8, 35],
        [-4, -40],
        [0, -45],
        [4, -40],
        [8, 35]
      ],
      0x8b0000
    );
    swordBlade.setStrokeStyle(3, 0xff0000);

    // Blade glow
    this.scene.tweens.add({
      targets: swordBlade,
      alpha: { from: 1, to: 0.7 },
      duration: 1500,
      yoyo: true,
      repeat: -1
    });

    // Assemble (order matters for layering)
    this.container.add([
      aura, cape, leftLeg, rightLeg, body, chestPlate,
      swordHandle, swordBlade, head, leftHorn, rightHorn,
      leftEye, rightEye
    ]);

    // Menacing idle animation
    this.scene.tweens.add({
      targets: this.container,
      y: this.container.y - 8,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }

  public getContainer(): Phaser.GameObjects.Container {
    return this.container;
  }

  public playAttackAnimation(onComplete?: () => void): void {
    const originalX = this.container.x;
    const direction = this.container.x < 500 ? 1 : -1;

    this.scene.tweens.add({
      targets: this.container,
      x: this.container.x + (direction * 80),
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 250,
      ease: 'Power2',
      yoyo: true,
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });
  }

  public playHitAnimation(): void {
    this.scene.tweens.add({
      targets: this.container,
      alpha: 0.3,
      x: this.container.x + (this.container.x < 500 ? -15 : 15),
      duration: 100,
      yoyo: true,
      repeat: 3,
      onComplete: () => {
        this.container.setAlpha(1);
      }
    });
  }

  public playDeathAnimation(): void {
    this.scene.tweens.add({
      targets: this.container,
      alpha: 0,
      y: this.container.y + 50,
      scaleX: 0.5,
      scaleY: 0.5,
      duration: 800,
      ease: 'Power2'
    });
  }
}
