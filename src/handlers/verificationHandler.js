import { PermissionFlagsBits, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';
import { AchievementModel, ThreadModel, UserModel, TierNineCooldownModel, ServerModel } from '../database/models.js';
import gameLoader from '../utils/gameLoader.js';
import { createAnnouncementEmbed } from '../utils/embedBuilder.js';

export async function handleApprove(interaction, threadId, client) {
  await interaction.deferReply({ ephemeral: true });

  const verifierId = interaction.user.id;
  const threadData = await ThreadModel.findById(threadId);
  const config = await ServerModel.findByGuildId(interaction.guildId);

  const isTierNine = threadData.is_tier_nine;
  const requiredRole = isTierNine ? config.admin_role_id : config.verifier_role_id;

  if (!interaction.member.roles.cache.has(requiredRole) && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
    return interaction.editReply('❌ You need the proper role to verify.');
  }

  const achievement = await AchievementModel.findByThreadId(threadId);
  const achievementData = gameLoader.getAchievement(achievement.achievement_id);
  const game = gameLoader.getGame(achievement.game_name);

  await AchievementModel.approve(achievement.id, verifierId);

  const updatedProgress = await UserModel.addTokens(
    achievement.user_id,
    achievement.game_name,
    achievementData.tokenReward
  );

  const currentTier = updatedProgress.current_tier;
  const completed = await AchievementModel.getCompletedForTier(
    achievement.user_id,
    achievement.game_name,
    currentTier
  );
  const total = game.tiers[currentTier]?.length || 0;

  if (completed.length === total && currentTier < 10) {
    await UserModel.updateTier(achievement.user_id, achievement.game_name, currentTier + 1);
  }

  await ThreadModel.updateStatus(threadId, 'approved');

  if (config.announcement_channel_id) {
    const channel = interaction.guild.channels.cache.get(config.announcement_channel_id);
    if (channel) {
      const user = await client.users.fetch(achievement.user_id);
      const embed = createAnnouncementEmbed(user, achievementData, updatedProgress.tokens, game.displayName);
      await channel.send({ embeds: [embed] });
    }
  }

  await interaction.channel.send(`✅ **Approved!** <@${achievement.user_id}> earned **${achievementData.tokenReward} tokens** 🪙`);
  await interaction.editReply('✅ Achievement approved!');

  setTimeout(async () => {
    await interaction.channel.delete().catch(() => {});
    await ThreadModel.delete(threadId);
  }, 2000);
}

export function showDenyModal(interaction, threadId) {
  const modal = new ModalBuilder()
    .setCustomId(`denial_modal_${threadId}`)
    .setTitle('Denial Reason');

  const reasonInput = new TextInputBuilder()
    .setCustomId('denial_reason')
    .setLabel('Why deny this submission?')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(false)
    .setPlaceholder('Optional reason');

  const row = new ActionRowBuilder().addComponents(reasonInput);
  modal.addComponents(row);

  return interaction.showModal(modal);
}

export async function handleDenyModal(interaction, threadId) {
  await interaction.deferReply({ ephemeral: true });

  const reason = interaction.fields.getTextInputValue('denial_reason') || 'No reason provided';
  const verifierId = interaction.user.id;

  const threadData = await ThreadModel.findById(threadId);
  const achievement = await AchievementModel.findByThreadId(threadId);

  await AchievementModel.reject(achievement.id, verifierId, reason);
  await ThreadModel.updateStatus(threadId, 'rejected');

  if (threadData.is_tier_nine) {
    await TierNineCooldownModel.setCooldown(achievement.user_id, achievement.game_name, 72);
  }

  await interaction.channel.send(
    `❌ **Denied**\n\n<@${achievement.user_id}>, your submission was denied.\n\n**Reason:** ${reason}\n\nThread deletes in 24 hours.`
  );

  await interaction.editReply('✅ Submission denied.');

  setTimeout(async () => {
    await interaction.channel.delete().catch(() => {});
    await ThreadModel.delete(threadId);
  }, 24 * 60 * 60 * 1000);
}
