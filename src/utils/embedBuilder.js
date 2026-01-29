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
      '```ansi\n' +
      '\x1b[36m╔═════════════════════════════════╗\n' +
      '\x1b[36m║  ALL ACCORDING TO KEIKAKU       ║\n' +
      '\x1b[36m╚═════════════════════════════════╝\x1b[0m\n' +
      '```\n' +
      '**HOW IT WORKS**\n' +
      '```\n' +
      '1 → Click the button below\n' +
      '2 → Select your game\n' +
      '3 → Choose an achievement\n' +
      '4 → Upload proof in the private thread\n' +
      '5 → Wait for verification\n' +
      '```\n' +
      '**THE RULES**\n' +
      '```diff\n' +
      '+ Maximum 3 pending submissions\n' +
      '+ Complete 100% of tier to unlock next\n' +
      '+ Tier 9 requires live trial with admins\n' +
      '- Tier 10 is reserved for Game Masters\n' +
      '```\n'
    )
    .addFields(
      {
        name: '💎 Cross-Server Progress',
        value: '> Your achievements follow you everywhere',
        inline: true
      },
      {
        name: '🪙 Token Economy',
        value: '> Earn tokens for each completion',
        inline: true
      },
      {
        name: '🏆 Global Ranks',
        value: '> Compete with the best',
        inline: true
      }
    )
    .setFooter({ text: '『  』 • Blank' })
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
    .setTitle('━━━━━━━ ACHIEVEMENT UNLOCKED ━━━━━━━')
    .setDescription(
      '```ansi\n' +
      '\x1b[35m╔═════════════════════════════════╗\n' +
      '\x1b[35m║     VICTORY IS ABSOLUTE         ║\n' +
      '\x1b[35m╚═════════════════════════════════╝\x1b[0m\n' +
      '```'
    )
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
        name: '🪙 Reward',
        value: `\`\`\`+${achievement.tokenReward}\`\`\``,
        inline: true
      },
      {
        name: '💎 Total',
        value: `\`\`\`${totalTokens}\`\`\``,
        inline: true
      },
      {
        name: '🔥 Status',
        value: `\`\`\`Complete\`\`\``,
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
    .setDescription(
      '```ansi\n' +
      '\x1b[36m╔═════════════════════════════════╗\n' +
      '\x1b[36m║    MASTER THE SYSTEM            ║\n' +
      '\x1b[36m╚═════════════════════════════════╝\x1b[0m\n' +
      '```\n' +
      '**Current Settings**\n\u200b'
    )
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
    .setDescription(
      '```ansi\n' +
      '\x1b[35m╔═════════════════════════════════╗\n' +
      '\x1b[35m║    KNOWLEDGE IS POWER           ║\n' +
      '\x1b[35m╚═════════════════════════════════╝\x1b[0m\n' +
      '```\n' +
      `**Active Games:** ${allProgress.length}\n\u200b`
    )
    .setThumbnail(user.displayAvatarURL({ size: 256 }));

  if (allProgress.length === 0) {
    embed.addFields({
      name: '🎯 Getting Started',
      value: '```diff\n- No games in progress\n+ Submit your first achievement to begin\n```'
    });
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
      '```ansi\n' +
      '\x1b[35m╔═════════════════════════════════╗\n' +
      `\x1b[35m║  TIER ${progress.current_tier}/10 • ${progress.tokens} TOKENS 🪙       ║\n` +
      '\x1b[35m╚═════════════════════════════════╝\x1b[0m\n' +
      '```'
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
        status = '';
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

export function createAchievementListEmbed(game, progress) {
  const embed = new EmbedBuilder()
    .setColor(COLORS.CYAN)
    .setTitle(`━━━━━━━ ${game.displayName} ━━━━━━━`)
    .setDescription(
      '```ansi\n' +
      '\x1b[36m╔═════════════════════════════════╗\n' +
      `\x1b[36m║  YOUR TIER: ${progress.current_tier}/10               ║\n` +
      `\x1b[36m║  TOKENS: ${progress.tokens} 🪙                   ║\n` +
      '\x1b[36m╚═════════════════════════════════╝\x1b[0m\n' +
      '```\n\u200b'
    );

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
    admin: 'Select the role that can verify **Tier 9+** challenges.\n\n**Permissions:**\n• Conduct Tier 9 live trials\n• Grant Tier 10 (Game Master) status\n• Override all verifications'
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
    admin_role: `${target} can now verify **Tier 9+** challenges and grant Game Master status`
  };

  return new EmbedBuilder()
    .setColor(COLORS.SUCCESS)
    .setTitle('✅ Configuration Updated')
    .setDescription(messages[type])
    .setFooter({ text: '『  』' })
    .setTimestamp();
}
