import Phaser from 'phaser';

export class ParticleEffects {
  static createFireballEffect(
    scene: Phaser.Scene,
    startX: number,
    startY: number,
    targetX: number,
    targetY: number,
    onComplete?: () => void
  ): void {
    // Create fireball projectile
    const fireball = scene.add.circle(startX, startY, 15, 0xff6b00);
    fireball.setStrokeStyle(3, 0xff0000);

    // Fire particles trailing behind
    const particles: Phaser.GameObjects.Arc[] = [];
    for (let i = 0; i < 8; i++) {
      const particle = scene.add.circle(startX, startY, 5, 0xff6b00, 0.8);
      particles.push(particle);

      scene.tweens.add({
        targets: particle,
        alpha: 0,
        scale: 0,
        duration: 500,
        delay: i * 50
      });
    }

    // Fireball movement
    scene.tweens.add({
      targets: fireball,
      x: targetX,
      y: targetY,
      duration: 400,
      ease: 'Power2',
      onUpdate: () => {
        // Update particle trail
        particles.forEach((p, i) => {
          scene.tweens.add({
            targets: p,
            x: fireball.x + Phaser.Math.Between(-10, 10),
            y: fireball.y + Phaser.Math.Between(-10, 10),
            duration: 100
          });
        });
      },
      onComplete: () => {
        // Explosion
        ParticleEffects.createExplosion(scene, targetX, targetY, 0xff6b00);
        fireball.destroy();
        particles.forEach(p => p.destroy());
        if (onComplete) onComplete();
      }
    });
  }

  static createLightningEffect(
    scene: Phaser.Scene,
    targetX: number,
    targetY: number,
    onComplete?: () => void
  ): void {
    const graphics = scene.add.graphics();

    const drawLightning = () => {
      graphics.clear();
      graphics.lineStyle(4, 0x00ffff, 1);

      let currentX = targetX;
      let currentY = -50;

      graphics.beginPath();
      graphics.moveTo(currentX, currentY);

      while (currentY < targetY) {
        currentX += Phaser.Math.Between(-30, 30);
        currentY += Phaser.Math.Between(20, 40);
        graphics.lineTo(currentX, currentY);
      }

      graphics.lineTo(targetX, targetY);
      graphics.strokePath();
    };

    // Flash effect
    let flashCount = 0;
    const flashInterval = scene.time.addEvent({
      delay: 80,
      repeat: 5,
      callback: () => {
        flashCount++;
        if (flashCount % 2 === 0) {
          drawLightning();
        } else {
          graphics.clear();
        }
      }
    });

    scene.time.delayedCall(500, () => {
      graphics.destroy();
      ParticleEffects.createExplosion(scene, targetX, targetY, 0x00ffff);
      if (onComplete) onComplete();
    });
  }

  static createHealEffect(
    scene: Phaser.Scene,
    x: number,
    y: number
  ): void {
    // Rising healing particles
    for (let i = 0; i < 15; i++) {
      const particle = scene.add.circle(
        x + Phaser.Math.Between(-40, 40),
        y + 40,
        Phaser.Math.Between(3, 8),
        0x00ff88,
        0.8
      );

      scene.tweens.add({
        targets: particle,
        y: y - 60,
        alpha: 0,
        scale: 0.2,
        duration: 1500,
        delay: i * 50,
        ease: 'Power2',
        onComplete: () => particle.destroy()
      });
    }

    // Healing circle
    const circle = scene.add.circle(x, y, 5, 0x00ff88, 0);
    circle.setStrokeStyle(3, 0x00ff88);

    scene.tweens.add({
      targets: circle,
      scale: 8,
      alpha: 0,
      duration: 800,
      ease: 'Power2',
      onComplete: () => circle.destroy()
    });
  }

  static createDefendEffect(
    scene: Phaser.Scene,
    x: number,
    y: number
  ): void {
    // Shield particles
    const shield = scene.add.circle(x, y, 50, 0x4ecdc4, 0);
    shield.setStrokeStyle(4, 0x4ecdc4);

    scene.tweens.add({
      targets: shield,
      scale: 1.5,
      alpha: 0,
      duration: 600,
      ease: 'Power2',
      onComplete: () => shield.destroy()
    });

    // Sparkles
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const distance = 60;
      const sparkle = scene.add.star(
        x + Math.cos(angle) * distance,
        y + Math.sin(angle) * distance,
        4, 4, 8,
        0x4ecdc4
      );

      scene.tweens.add({
        targets: sparkle,
        alpha: 0,
        scale: 0,
        duration: 500,
        delay: i * 30,
        onComplete: () => sparkle.destroy()
      });
    }
  }

  static createExplosion(
    scene: Phaser.Scene,
    x: number,
    y: number,
    color: number = 0xff6b00
  ): void {
    // Expanding ring
    const ring = scene.add.circle(x, y, 10, color, 0);
    ring.setStrokeStyle(4, color);

    scene.tweens.add({
      targets: ring,
      scale: 3,
      alpha: 0,
      duration: 400,
      ease: 'Power2',
      onComplete: () => ring.destroy()
    });

    // Explosion particles
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * Math.PI * 2;
      const distance = Phaser.Math.Between(30, 60);
      const particle = scene.add.circle(x, y, Phaser.Math.Between(3, 7), color);

      scene.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        alpha: 0,
        scale: 0,
        duration: 500,
        ease: 'Power2',
        onComplete: () => particle.destroy()
      });
    }
  }

  static createSlashEffect(
    scene: Phaser.Scene,
    x: number,
    y: number
  ): void {
    const graphics = scene.add.graphics();
    graphics.lineStyle(6, 0xffffff, 1);

    // Draw slash arc
    graphics.beginPath();
    graphics.arc(x - 30, y - 20, 40, -Math.PI / 4, Math.PI / 2, false);
    graphics.strokePath();

    scene.tweens.add({
      targets: graphics,
      alpha: 0,
      duration: 300,
      onComplete: () => graphics.destroy()
    });

    // Slash particles
    for (let i = 0; i < 8; i++) {
      const particle = scene.add.rectangle(
        x + Phaser.Math.Between(-30, 30),
        y + Phaser.Math.Between(-30, 30),
        Phaser.Math.Between(3, 6),
        Phaser.Math.Between(15, 25),
        0xffffff
      );
      particle.setRotation(Phaser.Math.FloatBetween(0, Math.PI));

      scene.tweens.add({
        targets: particle,
        alpha: 0,
        y: particle.y + Phaser.Math.Between(20, 40),
        duration: 400,
        delay: i * 30,
        onComplete: () => particle.destroy()
      });
    }
  }
}
