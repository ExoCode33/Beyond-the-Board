import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

// Color Palette
const COLORS = {
  CYAN: 0x00FFFF,
  PURPLE: 0x9B59B6,
  SUCCESS: 0x00FF9F,
  ERROR: 0xFF1493,
  GOLD: 0xFFD700,
};

export function createSubmissionEmbed() {
  const embed = new EmbedBuilder()
    .setColor(COLORS.CYAN)
    .setTitle('Beyond the Board - Achievements')
    .setDescription(
      '```ansi\n' +
      '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      '📝 How It Works\n' +
      '\n' +
      '1 → Click the button below\n' +
      '2 → Select your game\n' +
      '3 → Choose an achievement\n' +
      '4 → Upload proof in thread\n' +
      '\n' +
      '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      '⚔️ Tier System\n' +
      '\n' +
      '\x1b[36mTiers 1-8:\x1b[0m Complete 100% to unlock next\n' +
      '\x1b[36mTier 9:\x1b[0m    Live admin trial (costs tokens)\n' +
      '\x1b[36mTier 10:\x1b[0m   Game Master (admin granted)\n' +
      '\n' +
      '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      '⚡ Rules\n' +
      '\n' +
      '\x1b[32m+\x1b[0m Maximum 3 pending submissions\n' +
      '\x1b[32m+\x1b[0m Cross-server progress tracking\n' +
      '\x1b[32m+\x1b[0m 72-hour cooldown on Tier 9 denials\n' +
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
    .setTitle('Achievement Unlocked')
    .setDescription(
      '```ansi\n' +
      '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      `🏆 ${user.username} completed a challenge\n` +
      '\n' +
      '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      `\x1b[36m🎮 Game:\x1b[0m      ${gameName}\n` +
      `\x1b[36m⭐ Achievement:\x1b[0m ${achievement.name}\n` +
      `\x1b[36m🛡️ Tier:\x1b[0m      ${achievement.tier}\n` +
      '\n' +
      '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      `\x1b[33m🪙 Tokens Earned:\x1b[0m +${achievement.tokenReward}\n` +
      `\x1b[33m💎 Total Tokens:\x1b[0m  ${totalTokens}\n` +
      '\n' +
      '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '```'
    )
    .setThumbnail(user.displayAvatarURL({ size: 256 }))
    .setFooter({ text: '『  』' })
    .setTimestamp();
}

export function createConfigEmbed(config) {
  return new EmbedBuilder()
    .setColor(COLORS.CYAN)
    .setTitle('Beyond the Board - Configuration')
    .setDescription(
      '```ansi\n' +
      '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      '⚙️ Server Settings\n' +
      '\n' +
      `\x1b[36m📋 Submission Channel:\x1b[0m\n` +
      `   ${config?.submission_channel_id ? `<#${config.submission_channel_id}>` : 'Not set'}\n` +
      '\n' +
      `\x1b[36m📢 Announcement Channel:\x1b[0m\n` +
      `   ${config?.announcement_channel_id ? `<#${config.announcement_channel_id}>` : 'Not set'}\n` +
      '\n' +
      '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      `\x1b[36m👥 Verifier Role:\x1b[0m\n` +
      `   ${config?.verifier_role_id ? `<@&${config.verifier_role_id}>` : 'Not set'}\n` +
      '\n' +
      `\x1b[36m⭐ Admin Role:\x1b[0m\n` +
      `   ${config?.admin_role_id ? `<@&${config.admin_role_id}>` : 'Not set'}\n` +
      '\n' +
      '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '```'
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
      '```ansi\n' +
      '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      '\x1b[31mNo active games\x1b[0m\n' +
      '\n' +
      'Submit your first achievement to begin!\n' +
      '\n' +
      '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '```'
    );
  } else {
    let description = '```ansi\n\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n';
    
    for (const prog of allProgress) {
      const tierBar = '▰'.repeat(prog.current_tier) + '▱'.repeat(10 - prog.current_tier);
      
      description += '\n';
      description += `\x1b[35m🎮 ${prog.game_name}\x1b[0m\n`;
      description += '\n';
      description += `\x1b[36m🛡️ Tier:\x1b[0m   ${prog.current_tier}/10\n`;
      description += `${tierBar}\n`;
      description += `\x1b[33m🪙 Tokens:\x1b[0m ${prog.tokens}\n`;
      description += '\n';
      description += '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n';
    }
    
    description += '```';
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
      '```ansi\n' +
      '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      `\x1b[36m🛡️ Tier:\x1b[0m   ${progress.current_tier}/10\n` +
      `\x1b[33m🪙 Tokens:\x1b[0m ${progress.tokens}\n` +
      '\n' +
      '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '```'
    )
    .setThumbnail(user.displayAvatarURL());

  for (let tier = 1; tier <= 8; tier++) {
    const achievements = tierAchievements[tier] || [];
    if (achievements.length === 0) continue;

    const completed = achievements.filter(a => a.userStatus === 'approved').length;
    const total = achievements.length;
    const percentage = Math.floor((completed / total) * 100);
    const progressBar = '█'.repeat(Math.floor(percentage / 10)) + '░'.repeat(10 - Math.floor(percentage / 10));

    let tierText = '```ansi\n';
    tierText += `Progress: ${completed}/${total} (${percentage}%)\n`;
    tierText += `${progressBar}\n`;
    tierText += '\n';
    tierText += '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n';
    tierText += '```\n';

    for (const ach of achievements) {
      if (ach.locked) {
        tierText += `🔒 **${ach.name}:** Locked\n`;
      } else if (ach.userStatus === 'approved') {
        tierText += `✅ **${ach.name}:** Complete\n`;
      } else if (ach.userStatus === 'pending') {
        tierText += `⏳ **${ach.name}:** Pending\n`;
      } else if (ach.userStatus === 'rejected') {
        tierText += `❌ **${ach.name}:** Denied\n`;
      } else {
        tierText += `⭕ **${ach.name}:** ${ach.tokenReward} 🪙\n`;
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
      '```ansi\n' +
      '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      `\x1b[36m🛡️ Your Tier:\x1b[0m ${progress.current_tier}/10\n` +
      `\x1b[33m🪙 Tokens:\x1b[0m   ${progress.tokens}\n` +
      '\n' +
      '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '```'
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

    tierText += '```ansi\n\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n```';

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
    submission: 'Beyond the Board - Setup Submission',
    announcement: 'Beyond the Board - Setup Announcements'
  };

  const descriptions = {
    submission: 
      '```ansi\n' +
      '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      '📋 Submission Channel\n' +
      '\n' +
      'Select where the submission button will be posted.\n' +
      '\n' +
      'Players click this button to begin.\n' +
      '\n' +
      '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '```',
    announcement: 
      '```ansi\n' +
      '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      '📢 Announcement Channel\n' +
      '\n' +
      'Select where achievements will be announced.\n' +
      '\n' +
      'Completed achievements are celebrated here.\n' +
      '\n' +
      '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '```'
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
    verifier: 'Beyond the Board - Setup Verifier Role',
    admin: 'Beyond the Board - Setup Admin Role'
  };

  const descriptions = {
    verifier: 
      '```ansi\n' +
      '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      '👥 Verifier Role - Tier 1-8\n' +
      '\n' +
      '• View verification threads\n' +
      '• Approve or deny submissions\n' +
      '• Award tokens to players\n' +
      '\n' +
      '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '```',
    admin: 
      '```ansi\n' +
      '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      '⭐ Admin Role - Tier 9+\n' +
      '\n' +
      '• Conduct Tier 9 live trials\n' +
      '• Grant Game Master status (Tier 10)\n' +
      '• Override all verifications\n' +
      '\n' +
      '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '```'
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
    submission_channel: 
      '```ansi\n' +
      '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      '\x1b[32m✅ Submission button posted\x1b[0m\n' +
      '\n' +
      `Channel: ${target}\n` +
      '\n' +
      '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '```',
    announcement_channel: 
      '```ansi\n' +
      '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      '\x1b[32m✅ Announcement channel set\x1b[0m\n' +
      '\n' +
      `Channel: ${target}\n` +
      '\n' +
      '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '```',
    verifier_role: 
      '```ansi\n' +
      '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      '\x1b[32m✅ Verifier role configured\x1b[0m\n' +
      '\n' +
      `Role: ${target}\n` +
      'Access: Tier 1-8\n' +
      '\n' +
      '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '```',
    admin_role: 
      '```ansi\n' +
      '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      '\x1b[32m✅ Admin role configured\x1b[0m\n' +
      '\n' +
      `Role: ${target}\n` +
      'Access: Tier 9+ and Game Master\n' +
      '\n' +
      '\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '```'
  };

  return new EmbedBuilder()
    .setColor(COLORS.SUCCESS)
    .setTitle('Configuration Updated')
    .setDescription(messages[type])
    .setFooter({ text: '『  』' })
    .setTimestamp();
}
