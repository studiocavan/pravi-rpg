# Pravi RPG — Turn-Based Combat Game

A web-based turn-based RPG game with combat mechanics inspired by **Magic: The Gathering** (card-based abilities) and **Baldur's Gate** (tactical turn-based combat), built with **Phaser 3** and **TypeScript**.

## Features

### ⚔️ Combat System
- **Turn-based combat** with player and enemy phases
- **Card-based ability system** similar to MTG:
  - Mana costs for abilities
  - Cooldowns
  - Ability types: Attack, Heal, Defend, Special
  - Strategic resource management

### 🎮 Game Mechanics
- **Character stats**: Health, Mana, Attack, Defense, Speed
- **Status effects**: Buffs and debuffs that affect combat
- **Dynamic turn order** based on character speed
- **Mana regeneration** each turn
- **Victory/Defeat conditions**

### 🃏 Ability Cards (Included)
- **Strike** - Basic melee attack (1 mana)
- **Fireball** - Powerful fire spell (3 mana, 1 turn cooldown)
- **Lightning Bolt** - Devastating lightning attack (4 mana, 2 turns cooldown)
- **Heal** - Restore health (2 mana, 1 turn cooldown)
- **Defend** - Increase defense temporarily (1 mana)
- **Power Attack** - High damage at health cost (2 mana, 3 turns cooldown)
- **Arcane Missiles** - Magic missile barrage (3 mana, 1 turn cooldown)

### 🤖 Enemy AI
- Intelligent enemy decision-making
- Random ability selection from usable abilities
- Resource management for enemies

### 🧪 UI Features
- Health and mana bars with real-time updates
- Interactive ability cards with hover effects
- Combat log showing recent actions
- Turn indicator
- Smooth animations for attacks and effects
- Victory/Defeat screens with restart option
