import Phaser from 'phaser';
import { GameConfig } from './config/GameConfig';

// Initialize the game when DOM is ready
window.addEventListener('load', () => {
  new Phaser.Game(GameConfig);
});
