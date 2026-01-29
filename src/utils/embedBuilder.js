import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

// Color Palette
const COLORS = {
  CYAN: 0x00FFFF,
  PURPLE: 0x9B59B6,
  SUCCESS: 0x00FF9F,
  ERROR: 0xFF1493,
  GOLD: 0xFFD700,
};

// Purple divider line
const DIVIDER = '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━';

export function createSubmissionEmbed() {
  const embed = new EmbedBuilder()
    .setColor(COLORS.CYAN)
    .setTitle('Achievement Submission')
    .setDescription(
      `${DIVIDER}\n` +
      '**📝 How It Works**\n' +
      '```\n' +
      '1 → Click the button below\n' +
      '2 → Select your game\n' +
      '3 → Choose an achievement\n' +
      '4 → Upload proof in thread\n' +
      '```\n' +
      `${DIVIDER}\n` +
      '**⚔️ Tier System**\n' +
      '```yaml\n' +
      'Tiers 1-8: Complete 100% to unlock next\n' +
      'Tier 9:    Live admin trial (costs tokens)\n' +
      'Tier 10:   Admin granted only\n' +
      '```\n' +
      `${DIVIDER}\n` +
      '**⚡ Rules**\n' +
      '```diff\n' +
      '+ Maximum 3 pending submissions\n' +
      '+ Cross-server progress tracking\n' +
      '+ 72-hour cooldown on Tier 9 denials\n' +
      '```'
    )
    .setFooter({ text: '『  』 • Ready to begin?' })
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
    .setColor(COLORS.PURPLE)
    .setTitle(`🏆 ${user.username} completed a challenge`)
    .setDescription(
      `${DIVIDER}\n` +
      `🎮 **Game:** ${gameName}\n` +
      `⭐ **Achievement:** ${achievement.name}\n` +
      `🛡️ **Tier:** ${achievement.tier}\n` +
      `${DIVIDER}\n` +
      `🪙 **Tokens Earned:** +${achievement.tokenReward}\n` +
      `💎 **Total Tokens:** ${totalTokens}\n` +
      `${DIVIDER}`
    )
    .setThumbnail(user.displayAvatarURL({ size: 256 }))
    .setFooter({ text: '『  』' })
    .setTimestamp();
}

export function createConfigEmbed(config) {
  return new EmbedBuilder()
    .setColor(COLORS.CYAN)
    .setTitle('⚙️ Server Configuration')
    .setDescription(
      `${DIVIDER}\n` +
      `📋 **Submission Channel:** ${config?.submission_channel_id ? `<#${config.submission_channel_id}>` : '`Not set`'}\n` +
      `📢 **Announcement Channel:** ${config?.announcement_channel_id ? `<#${config.announcement_channel_id}>` : '`Not set`'}\n` +
      `${DIVIDER}\n` +
      `👥 **Verifier Role:** ${config?.verifier_role_id ? `<@&${config.verifier_role_id}>` : '`Not set`'}\n` +
      `⭐ **Admin Role:** ${config?.admin_role_id ? `<@&${config.admin_role_id}>` : '`Not set`'}\n` +
      `${DIVIDER}`
    )
    .setFooter({ text: '『  』 • Select an action below' })
    .setTimestamp();
}

export function createProfileEmbed(user, allProgress) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.PURPLE)
    .setTitle(`${user.username}'s Profile`)
    .setThumbnail(user.displayAvatarURL({ size: 256 }));

  if (allProgress.length === 0) {
    embed.setDescription(
      `${DIVIDER}\n` +
      '**No active games**\n' +
      'Submit your first achievement to begin!\n' +
      `${DIVIDER}`
    );
  } else {
    let description = `${DIVIDER}\n`;
    
    for (const prog of allProgress) {
      const tierBar = '▰'.repeat(prog.current_tier) + '▱'.repeat(10 - prog.current_tier);
      
      description += `🎮 **${prog.game_name}**\n`;
      description += `🛡️ Tier: ${prog.current_tier}/10\n`;
      description += `${tierBar}\n`;
      description += `🪙 Tokens: ${prog.tokens}\n`;
      description += `${DIVIDER}\n`;
    }
    
    embed.setDescription(description);
  }

  embed.setFooter({ text: '『  』 • Select a game for details' })
    .setTimestamp();

  return embed;
}

export function createDetailedProfileEmbed(user, game, progress, tierAchievements) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.PURPLE)
    .setTitle(`${game.displayName}`)
    .setDescription(
      `${DIVIDER}\n` +
      `🛡️ **Tier:** ${progress.current_tier}/10\n` +
      `🪙 **Tokens:** ${progress.tokens}\n` +
      `${DIVIDER}`
    )
    .setThumbnail(user.displayAvatarURL());

  for (let tier = 1; tier <= 8; tier++) {
    const achievements = tierAchievements[tier] || [];
    if (achievements.length === 0) continue;

    const completed = achievements.filter(a => a.userStatus === 'approved').length;
    const total = achievements.length;
    const percentage = Math.floor((completed / total) * 100);
    const progressBar = '█'.repeat(Math.floor(percentage / 10)) + '░'.repeat(10 - Math.floor(percentage / 10));

    let tierText = `**Progress:** ${completed}/${total} (${percentage}%)\n${progressBar}\n${DIVIDER}\n`;

    for (const ach of achievements) {
      let icon = '⭕';
      
      if (ach.locked) {
        icon = '🔒';
        tierText += `${icon} **${ach.name}:** Locked\n`;
      } else if (ach.userStatus === 'approved') {
        icon = '✅';
        tierText += `${icon} **${ach.name}:** Complete\n`;
      } else if (ach.userStatus === 'pending') {
        icon = '⏳';
        tierText += `${icon} **${ach.name}:** Pending\n`;
      } else if (ach.userStatus === 'rejected') {
        icon = '❌';
        tierText += `${icon} **${ach.name}:** Denied\n`;
      } else {
        tierText += `${icon} **${ach.name}:** ${ach.tokenReward} 🪙\n`;
      }
    }

    embed.addFields({
      name: `Tier ${tier}`,
      value: tierText,
      inline: false
    });
  }

  embed.setFooter({ text: '『  』 • Complete 100% to unlock next tier' })
    .setTimestamp();

  return embed;
}

export function createAchievementListEmbed(game, progress, achievements) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.CYAN)
    .setTitle(`${game.displayName} - Achievements`)
    .setDescription(
      `${DIVIDER}\n` +
      `🛡️ **Your Tier:** ${progress.current_tier}/10\n` +
      `🪙 **Tokens:** ${progress.tokens}\n` +
      `${DIVIDER}`
    );

  for (let tier = 1; tier <= 8; tier++) {
    const tierAchs = achievements.filter(a => a.tier === tier);
    if (tierAchs.length === 0) continue;

    let tierText = '';
    for (const ach of tierAchs) {
      let icon = '⭕';
      if (ach.locked) icon = '🔒';
      else if (ach.userStatus === 'approved') icon = '✅';
      else if (ach.userStatus === 'pending') icon = '⏳';
      else if (ach.userStatus === 'rejected') icon = '❌';

      tierText += `${icon} **${ach.name}** - ${ach.tokenReward} 🪙\n`;
      
      if (!ach.locked) {
        tierText += `└ ${ach.description}\n`;
      }
      tierText += '\n';
    }

    tierText += DIVIDER;

    embed.addFields({
      name: `Tier ${tier}`,
      value: tierText,
      inline: false
    });
  }

  embed.setFooter({ text: '『  』' })
    .setTimestamp();

  return embed;
}

export function createChannelSelectEmbed(type) {
  const titles = {
    submission: '📋 Setup Submission Embed',
    announcement: '📢 Set Announcement Channel'
  };

  const descriptions = {
    submission: 
      `${DIVIDER}\n` +
      'Select the channel where the submission button will be posted.\n' +
      '\n' +
      'Players will click this button to begin submitting achievements.\n' +
      `${DIVIDER}`,
    announcement: 
      `${DIVIDER}\n` +
      'Select the channel for achievement announcements.\n' +
      '\n' +
      'Completed achievements will be celebrated here publicly.\n' +
      `${DIVIDER}`
  };

  return new EmbedBuilder()
    .setColor(COLORS.CYAN)
    .setTitle(titles[type])
    .setDescription(descriptions[type])
    .setFooter({ text: '『  』 • Select from dropdown' })
    .setTimestamp();
}

export function createRoleSelectEmbed(type) {
  const titles = {
    verifier: '👥 Set Verifier Role',
    admin: '⭐ Set Admin Role'
  };

  const descriptions = {
    verifier: 
      `${DIVIDER}\n` +
      '**Verifier Role - Tier 1-8**\n' +
      '\n' +
      '• View verification threads\n' +
      '• Approve or deny submissions\n' +
      '• Award tokens to players\n' +
      `${DIVIDER}`,
    admin: 
      `${DIVIDER}\n` +
      '**Admin Role - Tier 9+**\n' +
      '\n' +
      '• Conduct Tier 9 live trials\n' +
      '• Grant Tier 10 status\n' +
      '• Override all verifications\n' +
      `${DIVIDER}`
  };

  return new EmbedBuilder()
    .setColor(COLORS.PURPLE)
    .setTitle(titles[type])
    .setDescription(descriptions[type])
    .setFooter({ text: '『  』 • Select from dropdown' })
    .setTimestamp();
}

export function createSuccessEmbed(type, target) {
  const messages = {
    submission_channel: `${DIVIDER}\nSubmission button posted in ${target}\n${DIVIDER}`,
    announcement_channel: `${DIVIDER}\nAnnouncements will be posted in ${target}\n${DIVIDER}`,
    verifier_role: `${DIVIDER}\n${target} can now verify Tier 1-8\n${DIVIDER}`,
    admin_role: `${DIVIDER}\n${target} can now verify Tier 9+\n${DIVIDER}`
  };

  return new EmbedBuilder()
    .setColor(COLORS.SUCCESS)
    .setTitle('✅ Configuration Updated')
    .setDescription(messages[type])
    .setFooter({ text: '『  』' })
    .setTimestamp();
}
