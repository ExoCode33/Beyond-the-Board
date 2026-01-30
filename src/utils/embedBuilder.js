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
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\x1b[1;37m📝 How It Works\x1b[0m\n' +
      '\x1b[0;37m1\x1b[0m → Click button below\n' +
      '\x1b[0;37m2\x1b[0m → Select your game\n' +
      '\x1b[0;37m3\x1b[0m → Choose achievement\n' +
      '\x1b[0;37m4\x1b[0m → Upload proof\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\x1b[1;37m⚔️ Tier System\x1b[0m\n' +
      '\x1b[1;36mTiers 1-8:\x1b[0m  Complete 100% to unlock\n' +
      '\x1b[1;35mTier 9:\x1b[0m     Live trial \x1b[2;37m(costs tokens)\x1b[0m\n' +
      '\x1b[1;33mTier 10:\x1b[0m    Game Master \x1b[2;37m(admin only)\x1b[0m\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\x1b[1;37m⚡ Rules\x1b[0m\n' +
      '\x1b[1;32m+\x1b[0m Max \x1b[1;33m3\x1b[0m pending submissions\n' +
      '\x1b[1;32m+\x1b[0m Cross-server progress\n' +
      '\x1b[1;32m+\x1b[0m \x1b[1;33m72h\x1b[0m cooldown on Tier 9 denials\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
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
    .setTitle('🏆 Achievement Unlocked')
    .setDescription(
      '```ansi\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      `\x1b[1;35m${user.username}\x1b[0m completed a challenge!\n` +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      `\x1b[1;36m🎮 Game:\x1b[0m       ${gameName}\n` +
      `\x1b[1;36m⭐ Achievement:\x1b[0m ${achievement.name}\n` +
      `\x1b[1;36m🛡️ Tier:\x1b[0m       ${achievement.tier}\n` +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      `\x1b[1;33m🪙 Earned:\x1b[0m  \x1b[1;32m+${achievement.tokenReward}\x1b[0m\n` +
      `\x1b[1;33m💎 Total:\x1b[0m   \x1b[1;37m${totalTokens}\x1b[0m\n` +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
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
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\x1b[1;37m⚙️ Server Settings\x1b[0m\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      `\x1b[1;36m📋 Submission:\x1b[0m\n` +
      `   ${config?.submission_channel_id ? `<#${config.submission_channel_id}>` : '\x1b[2;31mNot set\x1b[0m'}\n` +
      '\n' +
      `\x1b[1;36m📢 Announcements:\x1b[0m\n` +
      `   ${config?.announcement_channel_id ? `<#${config.announcement_channel_id}>` : '\x1b[2;31mNot set\x1b[0m'}\n` +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      `\x1b[1;35m👥 Verifier:\x1b[0m \x1b[2;37m(Tier 1-8)\x1b[0m\n` +
      `   ${config?.verifier_role_id ? `<@&${config.verifier_role_id}>` : '\x1b[2;31mNot set\x1b[0m'}\n` +
      '\n' +
      `\x1b[1;33m⭐ Admin:\x1b[0m \x1b[2;37m(Tier 9+)\x1b[0m\n` +
      `   ${config?.admin_role_id ? `<@&${config.admin_role_id}>` : '\x1b[2;31mNot set\x1b[0m'}\n` +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '```'
    )
    .setFooter({ text: '『  』 • Select action below' })
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
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\x1b[1;31mNo active games\x1b[0m\n' +
      '\n' +
      'Submit first achievement to begin!\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '```'
    );
  } else {
    let description = '```ansi\n\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n';
    
    for (const prog of allProgress) {
      const tierBar = '\x1b[1;35m▰\x1b[0m'.repeat(prog.current_tier) + '\x1b[2;37m▱\x1b[0m'.repeat(10 - prog.current_tier);
      
      description += `\x1b[1;35m🎮 Game:\x1b[0m ${prog.game_name}\n`;
      description += `\x1b[1;36m🛡️ Tier:\x1b[0m  \x1b[1;37m${prog.current_tier}\x1b[0m/10\n`;
      description += `${tierBar}\n`;
      description += `\x1b[1;33m🪙 Tokens:\x1b[0m \x1b[1;37m${prog.tokens}\x1b[0m\n`;
      description += '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n';
    }
    
    description += '```';
    embed.setDescription(description);
  }

  embed.setFooter({ text: '『  』 • Select game for details' })
    .setTimestamp();

  return embed;
}

export function createDetailedProfileEmbed(user, game, progress, tierAchievements) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.PURPLE)
    .setTitle(`${game.displayName}`)
    .setDescription(
      '```ansi\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      `\x1b[1;36m🛡️ Tier:\x1b[0m  \x1b[1;37m${progress.current_tier}\x1b[0m/10\n` +
      `\x1b[1;33m🪙 Tokens:\x1b[0m \x1b[1;37m${progress.tokens}\x1b[0m\n` +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '```'
    )
    .setThumbnail(user.displayAvatarURL());

  for (let tier = 1; tier <= 8; tier++) {
    const achievements = tierAchievements[tier] || [];
    if (achievements.length === 0) continue;

    const completed = achievements.filter(a => a.userStatus === 'approved').length;
    const total = achievements.length;
    const percentage = Math.floor((completed / total) * 100);
    const progressBar = '\x1b[1;32m█\x1b[0m'.repeat(Math.floor(percentage / 10)) + '\x1b[2;37m░\x1b[0m'.repeat(10 - Math.floor(percentage / 10));

    let tierText = '```ansi\n';
    tierText += `\x1b[1;37mProgress:\x1b[0m ${completed}/${total} \x1b[2;37m(${percentage}%)\x1b[0m\n`;
    tierText += `${progressBar}\n`;
    tierText += '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n';
    tierText += '```\n';

    for (const ach of achievements) {
      if (ach.locked) {
        tierText += `🔒 **${ach.name}** \x1b[2;37m• Locked\x1b[0m\n`;
      } else if (ach.userStatus === 'approved') {
        tierText += `✅ **${ach.name}** \x1b[1;32m• Done\x1b[0m\n`;
      } else if (ach.userStatus === 'pending') {
        tierText += `⏳ **${ach.name}** \x1b[1;33m• Pending\x1b[0m\n`;
      } else if (ach.userStatus === 'rejected') {
        tierText += `❌ **${ach.name}** \x1b[1;31m• Denied\x1b[0m\n`;
      } else {
        tierText += `⭕ **${ach.name}** \x1b[1;33m• ${ach.tokenReward} 🪙\x1b[0m\n`;
      }
    }

    embed.addFields({
      name: `**Tier ${tier}**`,
      value: tierText,
      inline: false
    });
  }

  embed.setFooter({ text: '『  』 • Complete 100% to unlock next' })
    .setTimestamp();

  return embed;
}

export function createAchievementListEmbed(game, progress, achievements) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.CYAN)
    .setTitle(`${game.displayName} - Achievements`)
    .setDescription(
      '```ansi\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      `\x1b[1;36m🛡️ Tier:\x1b[0m  \x1b[1;37m${progress.current_tier}\x1b[0m/10\n` +
      `\x1b[1;33m🪙 Tokens:\x1b[0m \x1b[1;37m${progress.tokens}\x1b[0m\n` +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '```'
    );

  for (let tier = 1; tier <= 8; tier++) {
    const tierAchs = achievements.filter(a => a.tier === tier);
    if (tierAchs.length === 0) continue;

    let tierText = '';
    for (const ach of tierAchs) {
      let icon = '⭕';
      let status = '';
      
      if (ach.locked) {
        icon = '🔒';
        status = ' \x1b[2;37m• Locked\x1b[0m';
      } else if (ach.userStatus === 'approved') {
        icon = '✅';
        status = ' \x1b[1;32m• Done\x1b[0m';
      } else if (ach.userStatus === 'pending') {
        icon = '⏳';
        status = ' \x1b[1;33m• Pending\x1b[0m';
      } else if (ach.userStatus === 'rejected') {
        icon = '❌';
        status = ' \x1b[1;31m• Denied\x1b[0m';
      } else {
        status = ` \x1b[1;33m• ${ach.tokenReward} 🪙\x1b[0m`;
      }

      tierText += `${icon} **${ach.name}**${status}\n`;
      
      if (!ach.locked) {
        tierText += `   └ ${ach.description}\n`;
      }
      tierText += '\n';
    }

    tierText += '```ansi\n\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n```';

    embed.addFields({
      name: `**Tier ${tier}**`,
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
    submission: 'Beyond the Board - Setup',
    announcement: 'Beyond the Board - Setup'
  };

  const descriptions = {
    submission: 
      '```ansi\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\x1b[1;37m📋 Submission Channel\x1b[0m\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      'Select channel for submission button.\n' +
      '\n' +
      'Players click to submit achievements.\n' +
      '\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '```',
    announcement: 
      '```ansi\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\x1b[1;37m📢 Announcement Channel\x1b[0m\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      'Select channel for announcements.\n' +
      '\n' +
      'Achievements celebrated here.\n' +
      '\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
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
    verifier: 'Beyond the Board - Setup',
    admin: 'Beyond the Board - Setup'
  };

  const descriptions = {
    verifier: 
      '```ansi\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\x1b[1;35m👥 Verifier Role\x1b[0m \x1b[2;37m(Tier 1-8)\x1b[0m\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      '\x1b[1;32m•\x1b[0m View verification threads\n' +
      '\x1b[1;32m•\x1b[0m Approve/deny submissions\n' +
      '\x1b[1;32m•\x1b[0m Award tokens\n' +
      '\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '```',
    admin: 
      '```ansi\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\x1b[1;33m⭐ Admin Role\x1b[0m \x1b[2;37m(Tier 9+)\x1b[0m\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      '\x1b[1;32m•\x1b[0m Conduct Tier 9 trials\n' +
      '\x1b[1;32m•\x1b[0m Grant Game Master status\n' +
      '\x1b[1;32m•\x1b[0m Override verifications\n' +
      '\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
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
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\x1b[1;32m✅ Submission button posted\x1b[0m\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      `\x1b[1;36mChannel:\x1b[0m ${target}\n` +
      '\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '```',
    announcement_channel: 
      '```ansi\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\x1b[1;32m✅ Announcement channel set\x1b[0m\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      `\x1b[1;36mChannel:\x1b[0m ${target}\n` +
      '\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '```',
    verifier_role: 
      '```ansi\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\x1b[1;32m✅ Verifier role set\x1b[0m\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      `\x1b[1;36mRole:\x1b[0m   ${target}\n` +
      `\x1b[1;36mAccess:\x1b[0m Tier 1-8\n` +
      '\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '```',
    admin_role: 
      '```ansi\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\x1b[1;32m✅ Admin role set\x1b[0m\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      `\x1b[1;36mRole:\x1b[0m   ${target}\n` +
      `\x1b[1;36mAccess:\x1b[0m Tier 9 + Game Master\n` +
      '\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '```'
  };

  return new EmbedBuilder()
    .setColor(COLORS.SUCCESS)
    .setTitle('Configuration Updated')
    .setDescription(messages[type])
    .setFooter({ text: '『  』' })
    .setTimestamp();
}
