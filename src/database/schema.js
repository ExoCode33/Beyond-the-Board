import { pool } from './connection.js';

export async function initializeDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Initializing database...');

    await client.query(`
      CREATE TABLE IF NOT EXISTS servers (
        guild_id VARCHAR(20) PRIMARY KEY,
        submission_channel_id VARCHAR(20),
        submission_message_id VARCHAR(20),
        announcement_channel_id VARCHAR(20),
        verifier_role_id VARCHAR(20),
        admin_role_id VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        discord_id VARCHAR(20) PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS user_game_progress (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(20) REFERENCES users(discord_id) ON DELETE CASCADE,
        game_name VARCHAR(100) NOT NULL,
        current_tier INTEGER DEFAULT 1 CHECK (current_tier >= 1 AND current_tier <= 10),
        tokens INTEGER DEFAULT 0 CHECK (tokens >= 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, game_name)
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS user_achievements (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(20) REFERENCES users(discord_id) ON DELETE CASCADE,
        achievement_id VARCHAR(255) NOT NULL,
        game_name VARCHAR(100) NOT NULL,
        tier INTEGER NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        thread_id VARCHAR(20),
        guild_id VARCHAR(20),
        submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        verified_by VARCHAR(20),
        verified_at TIMESTAMP,
        rejection_reason TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, achievement_id)
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS submission_threads (
        thread_id VARCHAR(20) PRIMARY KEY,
        user_id VARCHAR(20) REFERENCES users(discord_id) ON DELETE CASCADE,
        achievement_id VARCHAR(255) NOT NULL,
        game_name VARCHAR(100) NOT NULL,
        tier INTEGER NOT NULL,
        guild_id VARCHAR(20) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
        is_tier_nine BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS tier_nine_cooldowns (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(20) REFERENCES users(discord_id) ON DELETE CASCADE,
        game_name VARCHAR(100) NOT NULL,
        cooldown_until TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, game_name)
      )
    `);

    await client.query('CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_user_achievements_status ON user_achievements(status)');
    await client.query('CREATE INDEX IF NOT EXISTS idx_submission_threads_status ON submission_threads(status)');

    console.log('✅ Database initialized');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  } finally {
    client.release();
  }
}
