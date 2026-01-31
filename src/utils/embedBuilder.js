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
    .setColor(COLORS.PURPLE)
    .setTitle('**𝓢𝓾𝓫𝓶𝓲𝓽 𝓐𝓬𝓱𝓲𝓮𝓿𝓮𝓶𝓮𝓷𝓽𝓼**')
    .setDescription(
      '```ansi\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      '\x1b[1;36m📝 Game Start\x1b[0m\n' +
      '\n' +
      '\x1b[0;37m1\x1b[0m → Click button below\n' +
      '\x1b[0;37m2\x1b[0m → Select your game\n' +
      '\x1b[0;37m3\x1b[0m → Choose achievement\n' +
      '\x1b[0;37m4\x1b[0m → Upload proof\n' +
      '\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      '\x1b[1;36m⚔️ Ascension Path\x1b[0m\n' +
      '\n' +
      '\x1b[0;37mTier 1:\x1b[0m  Novice\n' +
      '\x1b[0;37mTier 2:\x1b[0m  Thinker\n' +
      '\x1b[0;32mTier 3:\x1b[0m  Planner\n' +
      '\x1b[0;32mTier 4:\x1b[0m  Analyst\n' +
      '\x1b[0;36mTier 5:\x1b[0m  Tactician\n' +
      '\x1b[0;36mTier 6:\x1b[0m  Strategist\n' +
      '\x1b[1;35mTier 7:\x1b[0m  Master Tactician\n' +
      '\x1b[1;35mTier 8:\x1b[0m  Grandmaster\n' +
      '\x1b[1;33mTier 9:\x1b[0m  Blank \x1b[2;37m(Undefeated)\x1b[0m\n' +
      '\x1b[1;33mTier 10:\x1b[0m Game Master \x1b[2;37m(God of Games)\x1b[0m\n' +
      '\n' +
      '\x1b[2;37mComplete 100% to unlock next tier\x1b[0m\n' +
      '\n' +
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
    .setTitle('**🏆 𝓐𝓬𝓱𝓲𝓮𝓿𝓮𝓶𝓮𝓷𝓽 𝓤𝓷𝓵𝓸𝓬𝓴𝓮𝓭**')
    .setDescription(
      '```ansi\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      `\x1b[1;35m${user.username}\x1b[0m completed a challenge!\n` +
      '\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      `\x1b[1;36m🎮 Game:\x1b[0m       ${gameName}\n` +
      `\x1b[1;36m⭐ Achievement:\x1b[0m ${achievement.name}\n` +
      `\x1b[1;36m🛡️ Tier:\x1b[0m       ${achievement.tier}\n` +
      '\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      `\x1b[1;33m🪙 Earned:\x1b[0m  \x1b[1;32m+${achievement.tokenReward}\x1b[0m\n` +
      `\x1b[1;33m💎 Total:\x1b[0m   \x1b[1;37m${totalTokens}\x1b[0m\n` +
      '\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '```'
    )
    .setThumbnail(user.displayAvatarURL({ size: 256 }))
    .setFooter({ text: '『  』' })
    .setTimestamp();
}

export function createConfigEmbed(config) {
  return new EmbedBuilder()
    .setColor(COLORS.PURPLE)
    .setTitle('**𝓑𝓮𝔂𝓸𝓷𝓭 𝓽𝓱𝓮 𝓑𝓸𝓪𝓻𝓭 - 𝓒𝓸𝓷𝓯𝓲𝓰𝓾𝓻𝓪𝓽𝓲𝓸𝓷**')
    .setDescription(
      '```ansi\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      '\x1b[1;36m⚙️ Server Settings\x1b[0m\n' +
      '\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      `\x1b[1;36m📋 Submission:\x1b[0m\n` +
      `   ${config?.submission_channel_id ? `<#${config.submission_channel_id}>` : '\x1b[2;31mNot set\x1b[0m'}\n` +
      '\n' +
      `\x1b[1;36m📢 Announcements:\x1b[0m\n` +
      `   ${config?.announcement_channel_id ? `<#${config.announcement_channel_id}>` : '\x1b[2;31mNot set\x1b[0m'}\n` +
      '\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      `\x1b[1;35m👥 Verifier:\x1b[0m \x1b[2;37m(Tier 1-8)\x1b[0m\n` +
      `   ${config?.verifier_role_id ? `<@&${config.verifier_role_id}>` : '\x1b[2;31mNot set\x1b[0m'}\n` +
      '\n' +
      `\x1b[1;33m⭐ Admin:\x1b[0m \x1b[2;37m(Tier 9+)\x1b[0m\n` +
      `   ${config?.admin_role_id ? `<@&${config.admin_role_id}>` : '\x1b[2;31mNot set\x1b[0m'}\n` +
      '\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '```'
    )
    .setFooter({ text: '『  』 • Select action below' })
    .setTimestamp();
}

export function createProfileEmbed(user, allProgress) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.PURPLE)
    .setTitle(`**${user.username}'𝓼 𝓟𝓻𝓸𝓯𝓲𝓵𝓮**`)
    .setThumbnail(user.displayAvatarURL({ size: 256 }));

  if (allProgress.length === 0) {
    embed.setDescription(
      '```ansi\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      '\x1b[1;31mNo active games\x1b[0m\n' +
      '\n' +
      'Submit first achievement to begin!\n' +
      '\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '```'
    );
  } else {
    let description = '```ansi\n\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n';
    
    for (const prog of allProgress) {
      const tierBar = '\x1b[1;35m▰\x1b[0m'.repeat(prog.current_tier) + '\x1b[2;37m▱\x1b[0m'.repeat(10 - prog.current_tier);
      
      description += '\n';
      description += `\x1b[1;35m🎮 Game:\x1b[0m ${prog.game_name}\n`;
      description += `\x1b[1;36m🛡️ Tier:\x1b[0m  \x1b[1;37m${prog.current_tier}\x1b[0m/10\n`;
      description += `${tierBar}\n`;
      description += `\x1b[1;33m🪙 Tokens:\x1b[0m \x1b[1;37m${prog.tokens}\x1b[0m\n`;
      description += '\n';
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
    .setTitle(`**${game.displayName} - 𝓟𝓻𝓸𝓰𝓻𝓮𝓼𝓼**`)
    .setDescription(
      '```ansi\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      `\x1b[1;36m🛡️ Tier:\x1b[0m  \x1b[1;37m${progress.current_tier}\x1b[0m/10\n` +
      `\x1b[1;33m🪙 Tokens:\x1b[0m \x1b[1;37m${progress.tokens}\x1b[0m\n` +
      '\n' +
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
      name: `**𝓣𝓲𝓮𝓻 ${tier}**`,
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
    .setColor(COLORS.PURPLE)
    .setTitle(`**${game.displayName} - 𝓐𝓬𝓱𝓲𝓮𝓿𝓮𝓶𝓮𝓷𝓽𝓼**`)
    .setDescription(
      '```ansi\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      `\x1b[1;36m🛡️ Tier:\x1b[0m  \x1b[1;37m${progress.current_tier}\x1b[0m/10\n` +
      `\x1b[1;33m🪙 Tokens:\x1b[0m \x1b[1;37m${progress.tokens}\x1b[0m\n` +
      '\n' +
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
      name: `**𝓣𝓲𝓮𝓻 ${tier}**`,
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
    submission: '**𝓑𝓮𝔂𝓸𝓷𝓭 𝓽𝓱𝓮 𝓑𝓸𝓪𝓻𝓭 - 𝓢𝓮𝓽𝓾𝓹**',
    announcement: '**𝓑𝓮𝔂𝓸𝓷𝓭 𝓽𝓱𝓮 𝓑𝓸𝓪𝓻𝓭 - 𝓢𝓮𝓽𝓾𝓹**'
  };

  const descriptions = {
    submission: 
      '```ansi\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      '\x1b[1;36m📋 Submission Channel\x1b[0m\n' +
      '\n' +
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
      '\n' +
      '\x1b[1;36m📢 Announcement Channel\x1b[0m\n' +
      '\n' +
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
    .setColor(COLORS.PURPLE)
    .setTitle(titles[type])
    .setDescription(descriptions[type])
    .setFooter({ text: '『  』 • Select from dropdown' })
    .setTimestamp();
}

export function createRoleSelectEmbed(type) {
  const titles = {
    verifier: '**𝓑𝓮𝔂𝓸𝓷𝓭 𝓽𝓱𝓮 𝓑𝓸𝓪𝓻𝓭 - 𝓢𝓮𝓽𝓾𝓹**',
    admin: '**𝓑𝓮𝔂𝓸𝓷𝓭 𝓽𝓱𝓮 𝓑𝓸𝓪𝓻𝓭 - 𝓢𝓮𝓽𝓾𝓹**'
  };

  const descriptions = {
    verifier: 
      '```ansi\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      '\x1b[1;35m👥 Verifier Role\x1b[0m \x1b[2;37m(Tier 1-8)\x1b[0m\n' +
      '\n' +
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
      '\n' +
      '\x1b[1;33m⭐ Admin Role\x1b[0m \x1b[2;37m(Tier 9+)\x1b[0m\n' +
      '\n' +
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
      '\n' +
      '\x1b[1;32m✅ Submission button posted\x1b[0m\n' +
      '\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      `\x1b[1;36mChannel:\x1b[0m ${target}\n` +
      '\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '```',
    announcement_channel: 
      '```ansi\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      '\x1b[1;32m✅ Announcement channel set\x1b[0m\n' +
      '\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      `\x1b[1;36mChannel:\x1b[0m ${target}\n` +
      '\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '```',
    verifier_role: 
      '```ansi\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      '\x1b[1;32m✅ Verifier role set\x1b[0m\n' +
      '\n' +
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
      '\n' +
      '\x1b[1;32m✅ Admin role set\x1b[0m\n' +
      '\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      `\x1b[1;36mRole:\x1b[0m   ${target}\n` +
      `\x1b[1;36mAccess:\x1b[0m Tier 9 + Game Master\n` +
      '\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '```'
  };

  return new EmbedBuilder()
    .setColor(COLORS.PURPLE)
    .setTitle('**𝓒𝓸𝓷𝓯𝓲𝓰𝓾𝓻𝓪𝓽𝓲𝓸𝓷 𝓤𝓹𝓭𝓪𝓽𝓮𝓭**')
    .setDescription(messages[type])
    .setFooter({ text: '『  』' })
    .setTimestamp();
}

// Additional embeds
export function createGameSelectionEmbed(games) {
  return new EmbedBuilder()
    .setColor(COLORS.PURPLE)
    .setTitle('**𝓢𝓮𝓵𝓮𝓬𝓽 𝓪 𝓖𝓪𝓶𝓮**')
    .setDescription(
      '```ansi\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      '\x1b[1;36m🎮 Available Games\x1b[0m\n' +
      '\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '```\n' +
      'Choose a game to view or submit achievements.'
    )
    .setFooter({ text: '『  』 • Select from dropdown' })
    .setTimestamp();
}

export function createAchievementSelectionEmbed(game, tierAchievements) {
  return new EmbedBuilder()
    .setColor(COLORS.PURPLE)
    .setTitle(`**${game.displayName} - 𝓢𝓮𝓵𝓮𝓬𝓽 𝓐𝓬𝓱𝓲𝓮𝓿𝓮𝓶𝓮𝓷𝓽**`)
    .setDescription(
      '```ansi\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      '\x1b[1;36m⭐ Available Achievements\x1b[0m\n' +
      '\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '```\n' +
      `${tierAchievements.length} achievement(s) available in your current tier.`
    )
    .setFooter({ text: '『  』 • Select from dropdown' })
    .setTimestamp();
}

export function createVerificationEmbed(achievement, game, user) {
  return new EmbedBuilder()
    .setColor(COLORS.PURPLE)
    .setTitle(`**𝓥𝓮𝓻𝓲𝓯𝓲𝓬𝓪𝓽𝓲𝓸𝓷 𝓡𝓮𝓺𝓾𝓲𝓻𝓮𝓭**`)
    .setDescription(
      '```ansi\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '\n' +
      `\x1b[1;37m${achievement.name}\x1b[0m\n` +
      '\n' +
      '\x1b[1;36m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n' +
      '```\n' +
      `**User:** ${user.username}\n` +
      `**Game:** ${game.displayName}\n` +
      `**Tier:** ${achievement.tier}\n` +
      `**Reward:** ${achievement.tokenReward} 🪙\n\n` +
      `**Description:**\n${achievement.description}\n\n` +
      `**Requirements:**\n${achievement.imageRequirements.map((req, i) => `${i + 1}. ${req}`).join('\n')}`
    )
    .setFooter({ text: '『  』 • Review and verify' })
    .setTimestamp();
}
