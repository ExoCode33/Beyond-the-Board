# Beyond the Board Bot

NGNL-inspired Discord achievement bot with 10-tier progression.

## Quick Start

```bash
npm install
cp .env.example .env
# Edit .env with your Discord token and PostgreSQL URL
npm run deploy
npm start
```

## Features

- 🎮 Multi-game achievement tracking
- 🏆 10-tier progression (Tier 1-8 achievements → Tier 9 admin challenge → Tier 10 Game Master)
- 🧵 Private thread verification
- 🪙 Game-specific tokens
- 🌐 Cross-server progress
- ⚡ Modern ES6 modules

## Setup

1. **Create Discord bot** at [Developer Portal](https://discord.com/developers/applications)
2. **Enable Message Content Intent**
3. **Invite bot:**
```
https://discord.com/api/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=2417246224&scope=bot%20applications.commands
```

4. **Configure .env:**
```
DISCORD_TOKEN=your_token
CLIENT_ID=your_client_id
DATABASE_URL=postgresql://...
NODE_ENV=production
```

## How It Works

**For Users:**
1. Click "Submit Achievement Proof" button
2. Select game → Select achievement
3. Upload screenshots in private thread
4. Wait for verification

**For Verifiers:**
1. Review screenshots in thread
2. Click ✅ Approve or ❌ Deny
3. Tokens awarded on approval

## Adding Games

Create folder: `src/games/your-game/tier1/` through `tier8/`

**Achievement template:**
```javascript
export default {
  id: 'game_t1_achievement',
  name: 'Achievement Name',
  description: 'What to accomplish',
  tier: 1,
  game: 'your-game',
  tokenReward: 10,
  requiredImages: 2,
  imageRequirements: [
    'Screenshot requirement 1',
    'Screenshot requirement 2'
  ],
  verificationHints: 'What to check'
};
```

Restart bot to load new games.

## Tier System

- **Tiers 1-8:** Complete achievements, earn tokens
- **Tier 9:** Live admin challenge (72hr cooldown on denial)
- **Tier 10:** Game Master (manually granted)

**Rules:**
- Max 3 pending submissions
- 100% tier completion to unlock next
- Each achievement claimable once

## Requirements

- Node.js 18+
- PostgreSQL
- Discord bot permissions

## Railway Deployment

1. Create Railway project
2. Add PostgreSQL database
3. Set environment variables
4. Deploy from GitHub
5. Run `npm run deploy` to register commands

---

**Modern ES6 • PostgreSQL • Discord.js v14**

*Inspired by No Game No Life* 🎮
