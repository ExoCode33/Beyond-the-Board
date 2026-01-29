import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';
import gameLoader from '../utils/gameLoader.js';
import { UserModel, AchievementModel } from '../database/models.js';

export const data = new SlashCommandBuilder()
  .setName('view-achievements')
  .setDescription('Browse available achievements for a game')
  .setDMPermission(false);

export async function execute(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const games = gameLoader.getAllGames();
  
  if (games.length === 0) {
    return interaction.editReply('❌ No games available yet.');
  }

  const gameOptions = games.map(g => ({
    label: g.displayName,
    value: g.name,
    description: `${g.totalAchievements} achievements`
  }));

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('viewach_select_game')
    .setPlaceholder('Select a game')
    .addOptions(gameOptions);

  const row = new ActionRowBuilder().addComponents(selectMenu);

  const embed = new EmbedBuilder()
    .setColor('#5865F2')
    .setTitle('🎮 View Achievements')
    .setDescription('Select a game to browse its achievements:')
    .setTimestamp();

  await interaction.editReply({
    embeds: [embed],
    components: [row]
  });

  const collector = interaction.channel.createMessageComponentCollector({
    filter: i => i.user.id === interaction.user.id && i.customId === 'viewach_select_game',
    time: 60000
  });

  collector.on('collect', async i => {
    await i.deferUpdate();

    const gameName = i.values[0];
    const game = gameLoader.getGame(gameName);
    const userId = interaction.user.id;

    await UserModel.upsert(userId, interaction.user.tag);
    let progress = await UserModel.getGameProgress(userId, gameName);
    
    if (!progress) {
      progress = await UserModel.initializeGameProgress(userId, gameName);
    }

    const currentTier = progress.current_tier;
    const achievements = [];

    for (let tier = 1; tier <= 8; tier++) {
      const tierAchs = game.tiers[tier] || [];
      
      for (const ach of tierAchs) {
        const userAch = await AchievementModel.findByUserAndAchievement(userId, ach.id);
        const status = userAch?.status || 'available';
        const locked = tier > currentTier;

        achievements.push({
          ...ach,
          userStatus: status,
          locked
        });
      }
    }

    const embed = new EmbedBuilder()
      .setColor('#5865F2')
      .setTitle(`🎮 ${game.displayName} - Achievements`)
      .setDescription(`**Your Tier:** ${currentTier}\n**Tokens:** ${progress.tokens} 🪙\n\n`)
      .setTimestamp();

    for (let tier = 1; tier <= 8; tier++) {
      const tierAchs = achievements.filter(a => a.tier === tier);
      if (tierAchs.length === 0) continue;

      let tierText = '';
      for (const ach of tierAchs) {
        let statusEmoji = '⭕';
        if (ach.locked) statusEmoji = '🔒';
        else if (ach.userStatus === 'approved') statusEmoji = '✅';
        else if (ach.userStatus === 'pending') statusEmoji = '⏳';
        else if (ach.userStatus === 'rejected') statusEmoji = '❌';

        tierText += `${statusEmoji} **${ach.name}** - ${ach.tokenReward} tokens\n`;
        if (ach.locked) {
          tierText += `   🔒 *Locked*\n`;
        } else {
          tierText += `   ${ach.description}\n`;
        }
      }

      embed.addFields({
        name: `Tier ${tier}`,
        value: tierText || 'No achievements',
        inline: false
      });
    }

    await i.editReply({
      embeds: [embed],
      components: []
    });
  });

  collector.on('end', () => {
    interaction.editReply({ components: [] }).catch(() => {});
  });
}
