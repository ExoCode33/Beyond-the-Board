import { query } from './connection.js';

export class ServerModel {
  static async findByGuildId(guildId) {
    const result = await query('SELECT * FROM servers WHERE guild_id = $1', [guildId]);
    return result.rows[0] || null;
  }

  static async upsert(guildId, data) {
    const { submissionChannelId, submissionMessageId, announcementChannelId, verifierRoleId, adminRoleId } = data;
    
    const result = await query(
      `INSERT INTO servers (guild_id, submission_channel_id, submission_message_id, announcement_channel_id, verifier_role_id, admin_role_id, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
       ON CONFLICT (guild_id) 
       DO UPDATE SET 
         submission_channel_id = COALESCE($2, servers.submission_channel_id),
         submission_message_id = COALESCE($3, servers.submission_message_id),
         announcement_channel_id = COALESCE($4, servers.announcement_channel_id),
         verifier_role_id = COALESCE($5, servers.verifier_role_id),
         admin_role_id = COALESCE($6, servers.admin_role_id),
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [guildId, submissionChannelId, submissionMessageId, announcementChannelId, verifierRoleId, adminRoleId]
    );
    
    return result.rows[0];
  }

  static async updateSubmissionMessage(guildId, channelId, messageId) {
    const result = await query(
      `UPDATE servers 
       SET submission_channel_id = $2, submission_message_id = $3, updated_at = CURRENT_TIMESTAMP
       WHERE guild_id = $1
       RETURNING *`,
      [guildId, channelId, messageId]
    );
    return result.rows[0];
  }
}

export class UserModel {
  static async upsert(discordId, username) {
    const result = await query(
      `INSERT INTO users (discord_id, username, updated_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP)
       ON CONFLICT (discord_id)
       DO UPDATE SET username = $2, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [discordId, username]
    );
    return result.rows[0];
  }

  static async getGameProgress(userId, gameName) {
    const result = await query(
      'SELECT * FROM user_game_progress WHERE user_id = $1 AND game_name = $2',
      [userId, gameName]
    );
    return result.rows[0] || null;
  }

  static async getAllGameProgress(userId) {
    const result = await query(
      'SELECT * FROM user_game_progress WHERE user_id = $1 ORDER BY game_name',
      [userId]
    );
    return result.rows;
  }

  static async initializeGameProgress(userId, gameName) {
    const result = await query(
      `INSERT INTO user_game_progress (user_id, game_name, current_tier, tokens)
       VALUES ($1, $2, 1, 0)
       ON CONFLICT (user_id, game_name) DO NOTHING
       RETURNING *`,
      [userId, gameName]
    );
    return result.rows[0];
  }

  static async updateTier(userId, gameName, newTier) {
    const result = await query(
      `UPDATE user_game_progress 
       SET current_tier = $3, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $1 AND game_name = $2
       RETURNING *`,
      [userId, gameName, newTier]
    );
    return result.rows[0];
  }

  static async addTokens(userId, gameName, amount) {
    const result = await query(
      `UPDATE user_game_progress 
       SET tokens = tokens + $3, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $1 AND game_name = $2
       RETURNING *`,
      [userId, gameName, amount]
    );
    return result.rows[0];
  }
}

export class AchievementModel {
  static async create(data) {
    const { userId, achievementId, gameName, tier, threadId, guildId } = data;
    
    const result = await query(
      `INSERT INTO user_achievements 
       (user_id, achievement_id, game_name, tier, thread_id, guild_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING *`,
      [userId, achievementId, gameName, tier, threadId, guildId]
    );
    
    return result.rows[0];
  }

  static async findByUserAndAchievement(userId, achievementId) {
    const result = await query(
      'SELECT * FROM user_achievements WHERE user_id = $1 AND achievement_id = $2',
      [userId, achievementId]
    );
    return result.rows[0] || null;
  }

  static async getPendingCount(userId) {
    const result = await query(
      "SELECT COUNT(*) FROM user_achievements WHERE user_id = $1 AND status = 'pending'",
      [userId]
    );
    return parseInt(result.rows[0].count);
  }

  static async getCompletedForTier(userId, gameName, tier) {
    const result = await query(
      "SELECT * FROM user_achievements WHERE user_id = $1 AND game_name = $2 AND tier = $3 AND status = 'approved'",
      [userId, gameName, tier]
    );
    return result.rows;
  }

  static async approve(achievementId, verifierId) {
    const result = await query(
      `UPDATE user_achievements 
       SET status = 'approved', verified_by = $2, verified_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [achievementId, verifierId]
    );
    return result.rows[0];
  }

  static async reject(achievementId, verifierId, reason) {
    const result = await query(
      `UPDATE user_achievements 
       SET status = 'rejected', verified_by = $2, rejection_reason = $3, verified_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1
       RETURNING *`,
      [achievementId, verifierId, reason]
    );
    return result.rows[0];
  }

  static async findByThreadId(threadId) {
    const result = await query(
      'SELECT * FROM user_achievements WHERE thread_id = $1',
      [threadId]
    );
    return result.rows[0] || null;
  }
}

export class ThreadModel {
  static async create(data) {
    const { threadId, userId, achievementId, gameName, tier, guildId, isTierNine } = data;
    
    const result = await query(
      `INSERT INTO submission_threads 
       (thread_id, user_id, achievement_id, game_name, tier, guild_id, is_tier_nine, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
       RETURNING *`,
      [threadId, userId, achievementId, gameName, tier, guildId, isTierNine || false]
    );
    
    return result.rows[0];
  }

  static async findById(threadId) {
    const result = await query('SELECT * FROM submission_threads WHERE thread_id = $1', [threadId]);
    return result.rows[0] || null;
  }

  static async getPending() {
    const result = await query("SELECT * FROM submission_threads WHERE status = 'pending' ORDER BY created_at DESC");
    return result.rows;
  }

  static async updateStatus(threadId, status) {
    const result = await query(
      `UPDATE submission_threads 
       SET status = $2, updated_at = CURRENT_TIMESTAMP
       WHERE thread_id = $1
       RETURNING *`,
      [threadId, status]
    );
    return result.rows[0];
  }

  static async delete(threadId) {
    await query('DELETE FROM submission_threads WHERE thread_id = $1', [threadId]);
  }
}

export class TierNineCooldownModel {
  static async getCooldown(userId, gameName) {
    const result = await query(
      'SELECT * FROM tier_nine_cooldowns WHERE user_id = $1 AND game_name = $2 AND cooldown_until > CURRENT_TIMESTAMP',
      [userId, gameName]
    );
    return result.rows[0] || null;
  }

  static async setCooldown(userId, gameName, hours = 72) {
    const result = await query(
      `INSERT INTO tier_nine_cooldowns (user_id, game_name, cooldown_until)
       VALUES ($1, $2, CURRENT_TIMESTAMP + INTERVAL '${hours} hours')
       ON CONFLICT (user_id, game_name)
       DO UPDATE SET cooldown_until = CURRENT_TIMESTAMP + INTERVAL '${hours} hours'
       RETURNING *`,
      [userId, gameName]
    );
    return result.rows[0];
  }
}
