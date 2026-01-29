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
    .setTitle('━━━━━━━ Achievement Submission ━━━━━━━')
    .setDescription(
      'Submit proof of your achievements and progress through 10 tiers.\n\u200b'
    )
    .addFields(
      {
        name: '📝 Submission Process',
        value: 
          '**1.** Click the button below\n' +
          '**2.** Select your game from the list\n' +
          '**3.** Choose an available achievement\n' +
          '**4.** Upload proof screenshots in private thread\n' +
          '**5.** Await verification from staff\n\u200b',
        inline: false
      },
      {
        name: '⚔️ Tier System',
        value: 
          '**Tiers 1-8:** Complete all achievements to unlock next tier\n' +
          '**Tier 9:** Live challenge trial with admins (requires tokens)\n' +
          '**Tier 10:** Exclusive rank granted by administrators\n\u200b',
        inline: false
      },
      {
        name: '⚡ Important',
        value: 
          '• Maximum **3 pending** submissions at once\n' +
          '• Progress is **cross-server** (follows you everywhere)\n' +
          '• Tier 9 denials have a **72-hour cooldown**\n' +
          '• Each achievement awards **game-specific tokens**',
        inline: false
      }
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
    .setColor(COLORS.SUCCESS)
    .setAuthor({ 
      name: `${user.username} completed a challenge`,
      iconURL: user.displayAvatarURL()
    })
    .setTitle('━━━━━━━ Achievement Unlocked ━━━━━━━')
    .setDescription('\u200b')
    .addFields(
      {
        name: '🎮 Game',
        value: `\`\`\`${gameName}\`\`\``,
        inline: true
      },
      {
        name: '⭐ Achievement',
        value: `\`\`\`${achievement.name}\`\`\``,
        inline: true
      },
      {
        name: '🛡️ Tier',
        value: `\`\`\`Tier ${achievement.tier}\`\`\``,
        inline: true
      },
      {
        name: '🪙 Tokens Earned',
        value: `\`\`\`+${achievement.tokenReward}\`\`\``,
        inline: true
      },
      {
        name: '💎 Total Tokens',
        value: `\`\`\`${totalTokens}\`\`\``,
        inline: true
      },
      {
        name: '🔥 Status',
        value: `\`\`\`Completed\`\`\``,
        inline: true
      }
    )
    .setThumbnail(user.displayAvatarURL({ size: 256 }))
    .setFooter({ text: '『  』' })
    .setTimestamp();
}

export function createConfigEmbed(config) {
  return new EmbedBuilder()
    .setColor(COLORS.CYAN)
    .setTitle('━━━━━━━ Server Configuration ━━━━━━━')
    .setDescription('**Current Settings**\n\u200b')
    .addFields(
      {
        name: '📋 Submission Channel',
        value: config?.submission_channel_id 
          ? `<#${config.submission_channel_id}>\n\`Active\`` 
          : '```diff\n- Not configured\n```',
        inline: true
      },
      {
        name: '📢 Announcement Channel',
        value: config?.announcement_channel_id 
          ? `<#${config.announcement_channel_id}>\n\`Active\`` 
          : '```diff\n- Not configured\n```',
        inline: true
      },
      {
        name: '\u200b',
        value: '\u200b',
        inline: true
      },
      {
        name: '👥 Verifier Role',
        value: config?.verifier_role_id 
          ? `<@&${config.verifier_role_id}>\n\`Tier 1-8\`` 
          : '```diff\n- Not configured\n```',
        inline: true
      },
      {
        name: '⭐ Admin Role',
        value: config?.admin_role_id 
          ? `<@&${config.admin_role_id}>\n\`Tier 9+\`` 
          : '```diff\n- Not configured\n```',
        inline: true
      },
      {
        name: '\u200b',
        value: '\u200b',
        inline: true
      }
    )
    .setFooter({ text: '『  』 • Select an action below' })
    .setTimestamp();
}

export function createProfileEmbed(user, allProgress) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.PURPLE)
    .setAuthor({ 
      name: `${user.username}'s Profile`,
      iconURL: user.displayAvatarURL()
    })
    .setTitle('━━━━━━━ Player Statistics ━━━━━━━')
    .setDescription(`**Active Games:** ${allProgress.length}\n\u200b`)
    .setThumbnail(user.displayAvatarURL({ size: 256 }));

  if (allProgress.length === 0) {
    embed.addFields({
      name: '🎯 Getting Started',
      value: '```diff\n- No games in progress\n+ Submit your first achievement to begin\n```'
    });
  } else {
    for (const prog of allProgress) {
      const tierBar = '▰'.repeat(prog.current_tier) + '▱'.repeat(10 - prog.current_tier);
      const percentage = (prog.current_tier / 10) * 100;
      
      embed.addFields({
        name: `🎮 ${prog.game_name}`,
        value: 
          `**Tier:** ${prog.current_tier}/10 (${percentage}%)\n` +
          `${tierBar}\n` +
          `**Tokens:** ${prog.tokens} 🪙`,
        inline: true
      });
    }
  }

  embed.setFooter({ text: '『  』 • Select a game for details' })
    .setTimestamp();

  return embed;
}

export function createDetailedProfileEmbed(user, game, progress, tierAchievements) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.PURPLE)
    .setTitle(`━━━━━━━ ${game.displayName} ━━━━━━━`)
    .setDescription(
      `**Current Tier:** ${progress.current_tier}/10\n` +
      `**Tokens:** ${progress.tokens} 🪙\n\u200b`
    )
    .setThumbnail(user.displayAvatarURL());

  // Add tier fields
  for (let tier = 1; tier <= 8; tier++) {
    const achievements = tierAchievements[tier] || [];
    if (achievements.length === 0) continue;

    const completed = achievements.filter(a => a.userStatus === 'approved').length;
    const total = achievements.length;
    const percentage = Math.floor((completed / total) * 100);
    const progressBar = '█'.repeat(Math.floor(percentage / 10)) + '░'.repeat(10 - Math.floor(percentage / 10));

    let tierText = `**Progress:** ${completed}/${total} (${percentage}%)\n${progressBar}\n\n`;

    for (const ach of achievements) {
      let icon = '⭕';
      let status = '';
      
      if (ach.locked) {
        icon = '🔒';
        status = ' *[Locked]*';
      } else if (ach.userStatus === 'approved') {
        icon = '✅';
      } else if (ach.userStatus === 'pending') {
        icon = '⏳';
        status = ' *[Pending]*';
      } else if (ach.userStatus === 'rejected') {
        icon = '❌';
        status = ' *[Denied]*';
      }

      tierText += `${icon} **${ach.name}**${status}\n`;
      if (!ach.locked) {
        tierText += `└ ${ach.description}\n`;
        tierText += `└ Reward: **${ach.tokenReward}** 🪙\n`;
      }
      tierText += '\n';
    }

    embed.addFields({
      name: `━━━ Tier ${tier} ━━━`,
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
    .setTitle(`━━━━━━━ ${game.displayName} ━━━━━━━`)
    .setDescription(
      `**Your Tier:** ${progress.current_tier}/10\n` +
      `**Tokens:** ${progress.tokens} 🪙\n\u200b`
    );

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

      tierText += `${statusEmoji} **${ach.name}** - ${ach.tokenReward} 🪙\n`;
      if (ach.locked) {
        tierText += `   └ *Complete Tier ${tier - 1} to unlock*\n`;
      } else {
        tierText += `   └ ${ach.description}\n`;
      }
      tierText += '\n';
    }

    embed.addFields({
      name: `━━━ Tier ${tier} ━━━`,
      value: tierText || 'No achievements',
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
    submission: 'Select the channel where the **"Submit Achievement Proof"** button will be posted.\n\nUsers will click this button to start their journey.',
    announcement: 'Select the channel where achievement completions will be announced.\n\nPublic celebrations happen here when someone conquers a challenge.'
  };

  return new EmbedBuilder()
    .setColor(COLORS.CYAN)
    .setTitle(titles[type])
    .setDescription(descriptions[type])
    .setFooter({ text: '『  』 • Select a channel from the dropdown' })
    .setTimestamp();
}

export function createRoleSelectEmbed(type) {
  const titles = {
    verifier: '👥 Set Verifier Role',
    admin: '⭐ Set Admin Role'
  };

  const descriptions = {
    verifier: 'Select the role that can verify **Tier 1-8** achievements.\n\n**Permissions:**\n• View verification threads\n• Approve or deny submissions\n• Award tokens to players',
    admin: 'Select the role that can verify **Tier 9+** challenges.\n\n**Permissions:**\n• Conduct Tier 9 live trials\n• Grant Tier 10 status\n• Override all verifications'
  };

  return new EmbedBuilder()
    .setColor(COLORS.PURPLE)
    .setTitle(titles[type])
    .setDescription(descriptions[type])
    .setFooter({ text: '『  』 • Select a role from the dropdown' })
    .setTimestamp();
}

export function createSuccessEmbed(type, target) {
  const messages = {
    submission_channel: `The submission button has been posted in ${target}\n\nPlayers can now begin their conquest.`,
    announcement_channel: `Achievement announcements will now be posted in ${target}`,
    verifier_role: `${target} can now verify **Tier 1-8** achievements`,
    admin_role: `${target} can now verify **Tier 9+** challenges and grant Tier 10 status`
  };

  return new EmbedBuilder()
    .setColor(COLORS.SUCCESS)
    .setTitle('✅ Configuration Updated')
    .setDescription(messages[type])
    .setFooter({ text: '『  』' })
    .setTimestamp();
}
