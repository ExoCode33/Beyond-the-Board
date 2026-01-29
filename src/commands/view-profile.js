import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { UserModel, AchievementModel } from '../database/models.js';
import gameLoader from '../utils/gameLoader.js';

export const data = new SlashCommandBuilder()
  .setName('view-profile')
  .setDescription('View your achievement progress and tokens')
  .setDMPermission(false);

export async function execute(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const userId = interaction.user.id;
  await UserModel.upsert(userId, interaction.user.tag);

  const allProgress = await UserModel.getAllGameProgress(userId);

  if (allProgress.length === 0) {
    const embed = new EmbedBuilder()
      .setColor('#00FFFF')
      .setTitle('🎮 Your Profile')
      .setDescription('You haven\'t started any games yet!\n\nClick the **"Submit Achievement Proof"** button in the submissions channel to begin your journey.')
      .setThumbnail(interaction.user.displayAvatarURL())
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  }

  const embed = new EmbedBuilder()
    .setColor('#00FFFF')
    .setTitle(`🎮 ${interaction.user.username}'s Profile`)
    .setDescription('**━━━━━━━ Your Progress ━━━━━━━**\n\u200b')
    .setThumbnail(interaction.user.displayAvatarURL())
    .setTimestamp();

  for (const prog of allProgress) {
    const game = gameLoader.getGame(prog.game_name);
    const displayName = game ? game.displayName : prog.game_name;
    
    const tierBar = '█'.repeat(prog.current_tier) + '░'.repeat(10 - prog.current_tier);
    
    embed.addFields({
      name: `${displayName}`,
      value: 
        `**Tier:** ${prog.current_tier}/10\n` +
        `${tierBar}\n` +
        `**Tokens:** ${prog.tokens} 🪙`,
      inline: true
    });
  }

  embed.setFooter({ text: 'Select a game below for detailed progress' });

  const gameOptions = allProgress.map(prog => {
    const game = gameLoader.getGame(prog.game_name);
    const displayName = game ? game.displayName : prog.game_name;
    
    return {
      label: displayName,
      value: prog.game_name,
      description: `Tier ${prog.current_tier}/10 • ${prog.tokens} tokens`,
      emoji: '🎮'
    };
  });

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('profile_select_game')
    .setPlaceholder('🎮 Select game for detailed view')
    .addOptions(gameOptions);

  const row = new ActionRowBuilder().addComponents(selectMenu);

  await interaction.editReply({
    embeds: [embed],
    components: [row]
  });

  const collector = interaction.channel.createMessageComponentCollector({
    filter: i => i.user.id === interaction.user.id && i.customId === 'profile_select_game',
    time: 300000
  });

  collector.on('collect', async i => {
    await i.deferUpdate();

    const gameName = i.values[0];
    const game = gameLoader.getGame(gameName);
    const progress = await UserModel.getGameProgress(userId, gameName);

    const detailEmbed = new EmbedBuilder()
      .setColor('#00FFFF')
      .setTitle(`🎮 ${game.displayName} - Detailed Progress`)
      .setDescription(
        `**━━━━━━━ Your Stats ━━━━━━━**\n` +
        `**Current Tier:** ${progress.current_tier}/10\n` +
        `**Tokens Earned:** ${progress.tokens} 🪙\n\u200b`
      )
      .setTimestamp();

    for (let tier = 1; tier <= 8; tier++) {
      const tierAchs = game.tiers[tier] || [];
      if (tierAchs.length === 0) continue;

      const completed = await AchievementModel.getCompletedForTier(userId, gameName, tier);
      const completionRate = `${completed.length}/${tierAchs.length}`;
      const percentage = tierAchs.length > 0 ? Math.floor((completed.length / tierAchs.length) * 100) : 0;
      
      const progressBar = '█'.repeat(Math.floor(percentage / 10)) + '░'.repeat(10 - Math.floor(percentage / 10));

      let tierText = `**Progress:** ${completionRate} (${percentage}%)\n${progressBar}\n\u200b\n`;

      for (const ach of tierAchs) {
        const userAch = await AchievementModel.findByUserAndAchievement(userId, ach.id);
        
        if (userAch?.status === 'approved') {
          tierText += `✅ **${ach.name}** - ${ach.tokenReward} 🪙\n`;
        } else if (userAch?.status === 'pending') {
          tierText += `⏳ **${ach.name}** - *Pending Verification*\n`;
        } else if (userAch?.status === 'rejected') {
          tierText += `❌ **${ach.name}** - *Denied*\n`;
        } else if (tier > progress.current_tier) {
          tierText += `🔒 **${ach.name}** - *Locked*\n`;
        } else {
          tierText += `⭕ **${ach.name}** - *Available*\n`;
        }
      }

      detailEmbed.addFields({
        name: `═══ Tier ${tier} ═══`,
        value: tierText,
        inline: false
      });
    }

    const backButton = new ButtonBuilder()
      .setCustomId('profile_back')
      .setLabel('← Back to Overview')
      .setStyle(ButtonStyle.Secondary);

    const backRow = new ActionRowBuilder().addComponents(backButton);

    await i.editReply({
      embeds: [detailEmbed],
      components: [backRow]
    });
  });

  collector.on('end', () => {
    interaction.editReply({ components: [] }).catch(() => {});
  });

  // Handle back button
  const backCollector = interaction.channel.createMessageComponentCollector({
    filter: i => i.user.id === interaction.user.id && i.customId === 'profile_back',
    time: 300000
  });

  backCollector.on('collect', async i => {
    await i.deferUpdate();
    
    const allProgress = await UserModel.getAllGameProgress(userId);
    
    const embed = new EmbedBuilder()
      .setColor('#00FFFF')
      .setTitle(`🎮 ${interaction.user.username}'s Profile`)
      .setDescription('**━━━━━━━ Your Progress ━━━━━━━**\n\u200b')
      .setThumbnail(interaction.user.displayAvatarURL())
      .setTimestamp();

    for (const prog of allProgress) {
      const game = gameLoader.getGame(prog.game_name);
      const displayName = game ? game.displayName : prog.game_name;
      
      const tierBar = '█'.repeat(prog.current_tier) + '░'.r
