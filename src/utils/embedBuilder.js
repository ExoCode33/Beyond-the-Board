import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

export function createSubmissionEmbed() {
  const embed = new EmbedBuilder()
    .setColor('#00FFFF')
    .setTitle('🎮 Beyond the Board - Achievement Submissions')
    .setDescription(
      '**━━━━━━━ How to Submit ━━━━━━━**\n\n' +
      '**1.** Click the button below\n' +
      '**2.** Select your game\n' +
      '**3.** Choose an achievement\n' +
      '**4.** Upload proof screenshots in the private thread\n' +
      '**5.** Wait for verification\n\n' +
      '**━━━━━━━ Rules ━━━━━━━**\n\n' +
      '• Maximum **3 pending** submissions at once\n' +
      '• Complete **100% of tier** to unlock next\n' +
      '• **Tier 9** requires admin challenge trial\n' +
      '• **Tier 10** is Game Master (admin granted)\n\u200b'
    )
    .setFooter({ text: 'Cross-server progress • Persistent tokens' })
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
    .setColor('#00FFFF')
    .setTitle('🎉 Achievement Unlocked!')
    .setDescription(
      `**${user.username}** has completed an achievement!\n\u200b\n` +
      `**Game:** ${gameName}\n` +
      `**Achievement:** ${achievement.name}\n` +
      `**Tier:** ${achievement.tier}\n\u200b\n` +
      `**Tokens Earned:** +${achievement.tokenReward} 🪙\n` +
      `**Total Tokens:** ${totalTokens} 🪙`
    )
    .setThumbnail(user.displayAvatarURL())
    .setTimestamp();
}
