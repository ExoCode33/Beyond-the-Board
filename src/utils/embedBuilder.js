import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

// Color Palette
const COLORS = {
  CYAN: 0x00FFFF,
  PURPLE: 0x9B59B6,
  SUCCESS: 0x00FF9F,
  ERROR: 0xFF1493,
  GOLD: 0xFFD700,
};

// Purple ANSI divider
const DIVIDER = '```ansi\n\x1b[35m━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\x1b[0m\n```';

export function createSubmissionEmbed() {
  const embed = new EmbedBuilder()
    .setColor(COLORS.CYAN)
    .setTitle('**Beyond the Board - Achievements**')
    .setDescription(
      DIVIDER +
      '```ansi\n\x1b[36m📝 How It Works\x1b[0m\n```' +
      '```\n' +
      '1 → Click the button below\n' +
      '2 → Select your game\n' +
      '3 → Choose an achievement\n' +
      '4 → Upload proof in thread\n' +
      '```' +
      DIVIDER +
      '```ansi\n\x1b[36m⚔️ Tier System\x1b[0m\n```' +
      '```ansi\n' +
      '\x1b[36mTiers 1-8:\x1b[0m Complete 100% to unlock next\n' +
      '\x1b[36mTier 9:\x1b[0m    Live admin trial (costs tokens)\n' +
      '\x1b[36mTier 10:\x1b[0m   Game Master (admin granted)\n' +
      '```' +
      DIVIDER +
      '```ansi\n\x1b[36m⚡ Rules\x1b[0m\n```' +
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
    .setTitle('**Achievement Unlocked**')
    .setDescription(
      DIVIDER +
      '```ansi\n' +
      `\x1b[35m🏆 ${user.username} completed a challenge\x1b[0m\n` +
      '```' +
      '```ansi\n' +
      `\x1b[36m🎮 Game:\x1b[0m      ${gameName}\n` +
      `\x1b[36m⭐ Achievement:\x1b[0m ${achievement.name}\n` +
      `\x1b[36m🛡️ Tier:\x1b[0m      ${achievement.tier}\n` +
      '```' +
      DIVIDER +
      '```ansi\n' +
      `\x1b[33m🪙 Tokens Earned:\x1b[0m +${achievement.tokenReward}\n` +
      `\x1b[33m💎 Total Tokens:\x1b[0m  ${totalTokens}\n` +
      '```' +
      DIVIDER
    )
    .setThumbnail(user.displayAvatarURL({ size: 256 }))
    .setFooter({ text: '『  』' })
    .setTimestamp();
}

export function createConfigEmbed(config) {
  return new EmbedBuilder()
    .setColor(COLORS.CYAN)
    .setTitle('**Beyond the Board - Configuration**')
    .setDescription(
      DIVIDER +
      '```ansi\n\x1b[36m⚙️ Server Settings\x1b[0m\n```' +
      '```ansi\n' +
      `\x1b[36m📋 Submission Channel:\x1b[0m\n` +
      `   ${config?.submission_channel_id ? `<#${config.submission_channel_id}>` : 'Not set'}\n` +
      '\n' +
      `\x1b[36m📢 Announcement Channel:\x1b[0m\n` +
      `   ${config?.announcement_channel_id ? `<#${config.announcement_channel_id}>` : 'Not set'}\n` +
      '```' +
      DIVIDER +
      '```ansi\n' +
      `\x1b[36m👥 Verifier Role:\x1b[0m\n` +
      `   ${config?.verifier_role_id ? `<@&${config.verifier_role_id}>` : 'Not set'}\n` +
      '\n' +
      `\x1b[36m⭐ Admin Role:\x1b[0m\n` +
      `   ${config?.admin_role_id ? `<@&${config.admin_role_id}>` : 'Not set'}\n` +
      '```' +
      DIVIDER
    )
    .setFooter({ text: '『  』 • Select an action below' })
    .setTimestamp();
}

export function createProfileEmbed(user, allProgress) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.PURPLE)
    .setTitle(`**${user.username}'s Profile**`)
    .setThumbnail(user.displayAvatarURL({ size: 256 }));

  if (allProgress.length === 0) {
    embed.setDescription(
      DIVIDER +
      '```ansi\n\x1b[31mNo active games\x1b[0m\n```' +
      '```\nSubmit your first achievement to begin!\n```' +
      DIVIDER
    );
  } else {
    let description = DIVIDER;
    
    for (const prog of allProgress) {
      const tierBar = '▰'.repeat(prog.current_tier) + '▱'.repeat(10 - prog.current_tier);
      
      description += '```ansi\n';
      description += `\x1b[35m🎮 ${prog.game_name}\x1b[0m\n`;
      description += '```';
      description += '```ansi\n';
      description += `\x1b[36m🛡️ Tier:\x1b[0m   ${prog.current_tier}/10\n`;
      description += `\x1b[36m${tierBar}\x1b[0m\n`;
      description += `\x1b[33m🪙 Tokens:\x1b[0m ${prog.tokens}\n`;
      description += '```';
      description += DIVIDER;
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
    .setTitle(`**${game.displayName}**`)
    .setDescription(
      DIVIDER +
      '```ansi\n' +
      `\x1b[36m🛡️ Tier:\x1b[0m   ${progress.current_tier}/10\n` +
      `\x1b[33m🪙 Tokens:\x1b[0m ${progress.tokens}\n` +
      '```' +
      DIVIDER
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
    tierText += `\x1b[36mProgress:\x1b[0m ${completed}/${total} (${percentage}%)\n`;
    tierText += `${progressBar}\n`;
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

    tierText += DIVIDER;

    embed.addFields({
      name: `**Tier ${tier}**`,
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
    .setTitle(`**${game.displayName} - Achievements**`)
    .setDescription(
      DIVIDER +
      '```ansi\n' +
      `\x1b[36m🛡️ Your Tier:\x1b[0m ${progress.current_tier}/10\n` +
      `\x1b[33m🪙 Tokens:\x1b[0m   ${progress.tokens}\n` +
      '```' +
      DIVIDER
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
    submission: '**Beyond the Board - Setup Submission**',
    announcement: '**Beyond the Board - Setup Announcements**'
  };

  const descriptions = {
    submission: 
      DIVIDER +
      '```ansi\n\x1b[36m📋 Submission Channel\x1b[0m\n```' +
      '```\nSelect where the submission button will be posted.\n\nPlayers click this button to begin.\n```' +
      DIVIDER,
    announcement: 
      DIVIDER +
      '```ansi\n\x1b[36m📢 Announcement Channel\x1b[0m\n```' +
      '```\nSelect where achievements will be announced.\n\nCompleted achievements are celebrated here.\n```' +
      DIVIDER
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
    verifier: '**Beyond the Board - Setup Verifier Role**',
    admin: '**Beyond the Board - Setup Admin Role**'
  };

  const descriptions = {
    verifier: 
      DIVIDER +
      '```ansi\n\x1b[36m👥 Verifier Role - Tier 1-8\x1b[0m\n```' +
      '```\n' +
      '• View verification threads\n' +
      '• Approve or deny submissions\n' +
      '• Award tokens to players\n' +
      '```' +
      DIVIDER,
    admin: 
      DIVIDER +
      '```ansi\n\x1b[36m⭐ Admin Role - Tier 9+\x1b[0m\n```' +
      '```\n' +
      '• Conduct Tier 9 live trials\n' +
      '• Grant Game Master status (Tier 10)\n' +
      '• Override all verifications\n' +
      '```' +
      DIVIDER
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
      DIVIDER +
      '```ansi\n\x1b[32m✅ Submission button posted\x1b[0m\n```' +
      `Channel: ${target}\n` +
      DIVIDER,
    announcement_channel: 
      DIVIDER +
      '```ansi\n\x1b[32m✅ Announcement channel set\x1b[0m\n```' +
      `Channel: ${target}\n` +
      DIVIDER,
    verifier_role: 
      DIVIDER +
      '```ansi\n\x1b[32m✅ Verifier role configured\x1b[0m\n```' +
      `Role: ${target}\n` +
      `Access: Tier 1-8\n` +
      DIVIDER,
    admin_role: 
      DIVIDER +
      '```ansi\n\x1b[32m✅ Admin role configured\x1b[0m\n```' +
      `Role: ${target}\n` +
      `Access: Tier 9+ and Game Master\n` +
      DIVIDER
  };

  return new EmbedBuilder()
    .setColor(COLORS.SUCCESS)
    .setTitle('**Configuration Updated**')
    .setDescription(messages[type])
    .setFooter({ text: '『  』' })
    .setTimestamp();
}
