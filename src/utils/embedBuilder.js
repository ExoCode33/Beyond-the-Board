import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export function createSubmissionEmbed() {
  const embed = new EmbedBuilder()
    .setColor('#5865F2')
    .setTitle('🎮 Submit Achievement Proof')
    .setDescription(
      '**How it works:**\n' +
      '1. Click the button below\n' +
      '2. Select game and achievement\n' +
      '3. Upload screenshots in thread\n' +
      '4. Wait for verification\n\n' +
      '**Rules:**\n' +
      '• Max 3 pending submissions\n' +
      '• 100% tier completion unlocks next tier\n' +
      '• Tier 9 requires admin challenge'
    )
    .setTimestamp();

  const button = new ButtonBuilder()
    .setCustomId('submit_achievement')
    .setLabel('Submit Achievement Proof')
    .setStyle(ButtonStyle.Primary)
    .setEmoji('📸');

  const row = new ActionRowBuilder().addComponents(button);

  return { embeds: [embed], components: [row] };
}

export function createVerificationButtons(threadId) {
  const approve = new ButtonBuilder()
    .setCustomId(`verify_approve_${threadId}`)
    .setLabel('Approve')
    .setStyle(ButtonStyle.Success)
    .setEmoji('✅');

  const deny = new ButtonBuilder()
    .setCustomId(`verify_deny_${threadId}`)
    .setLabel('Deny')
    .setStyle(ButtonStyle.Danger)
    .setEmoji('❌');

  return new ActionRowBuilder().addComponents(approve, deny);
}

export function createAnnouncementEmbed(user, achievement, totalTokens, gameName) {
  return new EmbedBuilder()
    .setColor('#2ECC71')
    .setTitle('🎉 Achievement Unlocked!')
    .setDescription(
      `<@${user.id}> completed **${achievement.name}** in *${gameName}*!\n\n` +
      `**Tokens Earned:** ${achievement.tokenReward} 🪙\n` +
      `**Total Tokens:** ${totalTokens} 🪙`
    )
    .setThumbnail(user.displayAvatarURL())
    .setTimestamp();
}
