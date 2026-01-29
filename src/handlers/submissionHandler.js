import { ActionRowBuilder, StringSelectMenuBuilder, ChannelType } from 'discord.js';
import { UserModel, AchievementModel, ThreadModel } from '../database/models.js';
import { ServerModel } from '../database/models.js';
import gameLoader from '../utils/gameLoader.js';
import { createVerificationButtons } from '../utils/embedBuilder.js';

export async function handleSubmitButton(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const userId = interaction.user.id;
  await UserModel.upsert(userId, interaction.user.tag);

  const pending = await AchievementModel.getPendingCount(userId);
  if (pending >= 3) {
    return interaction.editReply('❌ You have 3 pending submissions already.');
  }

  const games = gameLoader.getAllGames();
  if (games.length === 0) {
    return interaction.editReply('❌ No games available.');
  }

  const gameOptions = games.map(g => ({
    label: g.displayName,
    value: g.name,
    description: `${g.totalAchievements} achievements`
  }));

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('select_game')
    .setPlaceholder('Select a game')
    .addOptions(gameOptions);

  const row = new ActionRowBuilder().addComponents(selectMenu);

  return interaction.editReply({
    content: '**Select a game:**',
    components: [row]
  });
}

export async function handleGameSelect(interaction) {
  await interaction.deferUpdate();

  const gameName = interaction.values[0];
  const userId = interaction.user.id;

  let progress = await UserModel.getGameProgress(userId, gameName);
  if (!progress) {
    progress = await UserModel.initializeGameProgress(userId, gameName);
  }

  const game = gameLoader.getGame(gameName);
  const tier = progress.current_tier;
  const available = game.tiers[tier] || [];

  const unclaimed = [];
  for (const ach of available) {
    const existing = await AchievementModel.findByUserAndAchievement(userId, ach.id);
    if (!existing || existing.status === 'rejected') {
      unclaimed.push(ach);
    }
  }

  if (unclaimed.length === 0) {
    return interaction.editReply({
      content: `✅ All Tier ${tier} achievements claimed!`,
      components: []
    });
  }

  const achOptions = unclaimed.map(a => ({
    label: a.name,
    value: a.id,
    description: `Tier ${a.tier} • ${a.tokenReward} tokens`
  }));

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId(`select_achievement_${gameName}`)
    .setPlaceholder('Select achievement')
    .addOptions(achOptions);

  const row = new ActionRowBuilder().addComponents(selectMenu);

  return interaction.editReply({
    content: `**Select achievement (Tier ${tier}):**`,
    components: [row]
  });
}

export async function handleAchievementSelect(interaction, gameName) {
  await interaction.deferUpdate();

  const achievementId = interaction.values[0];
  const userId = interaction.user.id;

  const achievement = gameLoader.getAchievement(achievementId);
  const game = gameLoader.getGame(gameName);
  const config = await ServerModel.findByGuildId(interaction.guildId);

  if (!config?.verifier_role_id) {
    return interaction.editReply({
      content: '❌ Server not configured. Ask admin to run /config-beyondtheboard',
      components: []
    });
  }

  const threadName = `[${game.displayName}] ${achievement.name} - ${interaction.user.username}`;
  
  const thread = await interaction.channel.threads.create({
    name: threadName.substring(0, 100),
    type: ChannelType.PrivateThread,
  });

  await thread.members.add(userId);

  // Add verifiers and admins
  const guild = interaction.guild;
  const verifiers = guild.members.cache.filter(m => m.roles.cache.has(config.verifier_role_id));
  for (const [, member] of verifiers) {
    await thread.members.add(member.id).catch(() => {});
  }
  if (config.admin_role_id) {
    const admins = guild.members.cache.filter(m => m.roles.cache.has(config.admin_role_id));
    for (const [, member] of admins) {
      await thread.members.add(member.id).catch(() => {});
    }
  }

  await AchievementModel.create({
    userId,
    achievementId,
    gameName,
    tier: achievement.tier,
    threadId: thread.id,
    guildId: interaction.guildId
  });

  await ThreadModel.create({
    threadId: thread.id,
    userId,
    achievementId,
    gameName,
    tier: achievement.tier,
    guildId: interaction.guildId,
    isTierNine: false
  });

  await thread.send({
    content: `<@${userId}>\n\n**${achievement.name}**\n${achievement.description}\n\n**Required:** Upload **${achievement.requiredImages}** screenshot(s) showing:\n${achievement.imageRequirements.map((req, i) => `${i + 1}. ${req}`).join('\n')}\n\n${achievement.verificationHints ? `*Verification hints: ${achievement.verificationHints}*` : ''}`
  });

  const buttons = createVerificationButtons(thread.id);
  await thread.send({
    content: `**Verifiers:** Review and verify`,
    components: [buttons]
  });

  return interaction.editReply({
    content: `✅ Thread created: <#${thread.id}>`,
    components: []
  });
}
