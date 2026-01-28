import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class GameLoader {
  constructor() {
    this.games = new Map();
    this.achievements = new Map();
  }

  async loadGames() {
    const gamesPath = path.join(__dirname, '../games');
    
    if (!fs.existsSync(gamesPath)) {
      console.warn('⚠️  Games directory not found');
      return;
    }

    const gameFolders = fs.readdirSync(gamesPath).filter(file => {
      const filePath = path.join(gamesPath, file);
      return fs.statSync(filePath).isDirectory();
    });

    for (const gameFolder of gameFolders) {
      try {
        await this.loadGame(gameFolder);
      } catch (error) {
        console.error(`❌ Error loading game '${gameFolder}':`, error);
      }
    }

    console.log(`✅ Loaded ${this.games.size} games with ${this.achievements.size} achievements`);
  }

  async loadGame(gameName) {
    const gamePath = path.join(__dirname, '../games', gameName);
    
    const gameData = {
      name: gameName,
      displayName: this.formatGameName(gameName),
      tiers: {},
      totalAchievements: 0,
    };

    for (let tier = 1; tier <= 8; tier++) {
      const tierPath = path.join(gamePath, `tier${tier}`);
      
      if (!fs.existsSync(tierPath)) continue;

      const achievementFiles = fs.readdirSync(tierPath).filter(file => file.endsWith('.js'));
      gameData.tiers[tier] = [];

      for (const file of achievementFiles) {
        try {
          const achievementPath = path.join(tierPath, file);
          const achievementModule = await import(`file://${achievementPath}`);
          const achievement = achievementModule.default;

          if (this.validateAchievement(achievement, gameName, tier)) {
            gameData.tiers[tier].push(achievement);
            gameData.totalAchievements++;
            this.achievements.set(achievement.id, achievement);
          }
        } catch (error) {
          console.error(`Error loading achievement ${file}:`, error);
        }
      }
    }

    this.games.set(gameName, gameData);
    console.log(`  📁 ${gameData.displayName} (${gameData.totalAchievements} achievements)`);
  }

  validateAchievement(achievement, gameName, tier) {
    const required = ['id', 'name', 'description', 'tier', 'game', 'tokenReward', 'requiredImages'];
    
    for (const field of required) {
      if (!(field in achievement)) return false;
    }

    if (achievement.game !== gameName) return false;
    if (achievement.tier !== tier) return false;
    if (achievement.requiredImages < 1 || achievement.requiredImages > 8) return false;

    return true;
  }

  formatGameName(folderName) {
    return folderName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  getAllGames() {
    return Array.from(this.games.values());
  }

  getGame(gameName) {
    return this.games.get(gameName);
  }

  getAchievement(achievementId) {
    return this.achievements.get(achievementId);
  }

  getAchievementsForTier(gameName, tier) {
    const game = this.games.get(gameName);
    if (!game) return [];
    return game.tiers[tier] || [];
  }
}

export default new GameLoader();
