import { ActionRowBuilder, ChannelSelectMenuBuilder, RoleSelectMenuBuilder, EmbedBuilder, ChannelType, StringSelectMenuBuilder } from 'discord.js';
import { ServerModel } from '../database/models.js';
import { createSubmissionEmbed } from '../utils/embedBuilder.js';

export async function showConfigPanel(interaction, isUpdate = false) {
  const config = await ServerModel.findByGuildId(interaction.guildId);

  const embed = new EmbedBuilder()
    .setColor('#00FFFF')
    .setTitle('🎮 Beyond the Board - Configuration Panel')
    .setDescription('**Current Server Configuration**\n\u200b')
    .addFields(
      {
        name: '📋 Submission Channel',
        value: config?.submission_channel_id ? `<#${config.submission_channel_id}>` : '`Not configured`',
        inline: true
      },
      {
        name: '📢 Announcement Channel',
        value: config?.announcement_channel_id ? `<#${config.announcement_channel_id}>` : '`Not configured`',
        inline: true
      },
      {
        name: '\u200b',
        value: '\u200b',
        inline: true
      },
      {
        name: '👥 Verifier Role',
        value: config?.verifier_role_id ? `<@&${config.verifier_role_id}>` : '`Not configured`',
        inline: true
      },
      {
        name: '⭐ Admin Role',
        value: config?.admin_role_id ? `<@&${config.admin_role_id}>` : '`Not configured`',
        inline: true
      },
      {
        name: '\u200b',
        value: '\u200b',
        inline: true
      }
    )
    .setFooter({ text: 'Select an action below to configure the bot' })
    .setTimestamp();

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('admin_config_action')
    .setPlaceholder('⚙️ Select Configuration Action')
    .addOptions([
      {
        label: 'Setup Submission Embed',
        description: 'Post the achievement submission button',
        value: 'setup_embed',
        emoji: '📋'
      },
      {
        label: 'Set Announcement Channel',
        description: 'Configure where achievements are announced',
        value: 'set_announcement_channel',
        emoji: '📢'
      },
      {
        label: 'Set Verifier Role',
        description: 'Role that can verify Tier 1-8 achievements',
        value: 'set_verifier_role',
        emoji: '👥'
      },
      {
        label: 'Set Admin Role',
        description: 'Role that can verify Tier 9+ challenges',
        value: 'set_admin_role',
        emoji: '⭐'
      },
      {
        label: 'View Current Configuration',
        description: 'Refresh and view current settings',
        value: 'refresh_config',
        emoji: '🔄'
      }
    ]);

  const row = new ActionRowBuilder().addComponents(selectMenu);

  await interaction.editReply({
    embeds: [embed],
    components: [row]
  });
}

export async function handleConfigAction(interaction) {
  const action = interaction.values[0];

  if (action === 'refresh_config') {
    await interaction.deferUpdate();
    await showConfigPanel(interaction, true);
    return;
  }

  if (action === 'setup_embed') {
    await interaction.deferUpdate();

    const channelSelect = new ChannelSelectMenuBuilder()
      .setCustomId('select_submission_channel')
      .setPlaceholder('📋 Select Submission Channel')
      .setChannelTypes(ChannelType.GuildText);

    const row = new ActionRowBuilder().addComponents(channelSelect);

    const embed = new EmbedBuilder()
      .setColor('#00FFFF')
      .setTitle('📋 Setup Submission Embed')
      .setDescription('Select the channel where the **"Submit Achievement Proof"** button will be posted.\n\nUsers will click this button to start submitting their achievements.')
      .setTimestamp();

    await interaction.editReply({
      embeds: [embed],
      components: [row]
    });
    return;
  }

  if (action === 'set_announcement_channel') {
    await interaction.deferUpdate();

    const channelSelect = new ChannelSelectMenuBuilder()
      .setCustomId('select_announcement_channel')
      .setPlaceholder('📢 Select Announcement Channel')
      .setChannelTypes(ChannelType.GuildText);

    const row = new ActionRowBuilder().addComponents(channelSelect);

    const embed = new EmbedBuilder()
      .setColor('#00FFFF')
      .setTitle('📢 Set Announcement Channel')
      .setDescription('Select the channel where achievement completions will be announced.\n\nThis is where users will see public announcements when someone completes an achievement.')
      .setTimestamp();

    await interaction.editReply({
      embeds: [embed],
      components: [row]
    });
    return;
  }

  if (action === 'set_verifier_role') {
    await interaction.deferUpdate();

    const roleSelect = new RoleSelectMenuBuilder()
      .setCustomId('select_verifier_role')
      .setPlaceholder('👥 Select Verifier Role');

    const row = new ActionRowBuilder().addComponents(roleSelect);

    const embed = new EmbedBuilder()
      .setColor('#00FFFF')
      .setTitle('👥 Set Verifier Role')
      .setDescription('Select the role that can verify **Tier 1-8** achievements.\n\nMembers with this role will:\n• See verification threads\n• Approve or deny submissions\n• Award tokens to users')
      .setTimestamp();

    await interaction.editReply({
      embeds: [embed],
      components: [row]
    });
    return;
  }

  if (action === 'set_admin_role') {
    await interaction.deferUpdate();

    const roleSelect = new RoleSelectMenuBuilder()
      .setCustomId('select_admin_role')
      .setPlaceholder('⭐ Select Admin Role');

    const row = new ActionRowBuilder().addComponents(roleSelect);

    const embed = new EmbedBuilder()
      .setColor('#00FFFF')
      .setTitle('⭐ Set Admin Role')
      .setDescription('Select the role that can verify **Tier 9+** challenges.\n\nMembers with this role will:\n• Handle Tier 9 live trials\n• Grant Tier 10 (Game Master) status\n• Override all verifications')
      .setTimestamp();

    await interaction.editReply({
      embeds: [embed],
      components: [row]
    });
    return;
  }
}

export async function handleSubmissionChannelSelect(interaction) {
  await interaction.deferUpdate();

  const channel = interaction.channels.first();

  const msg = await channel.send(createSubmissionEmbed());
  await ServerModel.upsert(interaction.guildId, {
    submissionChannelId: channel.id,
    submissionMessageId: msg.id
  });

  const successEmbed = new EmbedBuilder()
    .setColor('#00FFFF')
    .setTitle('✅ Submission Embed Posted')
    .setDescription(`The achievement submission button has been posted in ${channel}\n\nUsers can now click the button to start submitting achievements!`)
    .setTimestamp();

  await interaction.followUp({
    embeds: [successEmbed],
    ephemeral: true
  });

  await showConfigPanel(interaction, true);
}

export async function handleAnnouncementChannelSelect(interaction) {
  await interaction.deferUpdate();

  const channel = interaction.channels.first();

  await ServerModel.upsert(interaction.guildId, {
    announcementChannelId: channel.id
  });

  const successEmbed = new EmbedBuilder()
    .setColor('#00FFFF')
    .setTitle('✅ Announcement Channel Set')
    .setDescription(`Achievement announcements will now be posted in ${channel}`)
    .setTimestamp();

  await interaction.followUp({
    embeds: [successEmbed],
    ephemeral: true
  });

  await showConfigPanel(interaction, true);
}

export async function handleRoleSelect(interaction) {
  await interaction.deferUpdate();

  const role = interaction.roles.first();

  if (interaction.customId === 'select_verifier_role') {
    await ServerModel.upsert(interaction.guildId, {
      verifierRoleId: role.id
    });

    const successEmbed = new EmbedBuilder()
      .setColor('#00FFFF')
      .setTitle('✅ Verifier Role Set')
      .setDescription(`${role} can now verify **Tier 1-8** achievements`)
      .setTimestamp();

    await interaction.followUp({
      embeds: [successEmbed],
      ephemeral: true
    });
  } else if (interaction.customId === 'select_admin_role') {
    await ServerModel.upsert(interaction.guildId, {
      adminRoleId: role.id
    });

    const successEmbed = new EmbedBuilder()
      .setColor('#00FFFF')
      .setTitle('✅ Admin Role Set')
      .setDescription(`${role} can now verify **Tier 9+** challenges and grant Game Master status`)
      .setTimestamp();

    await interaction.followUp({
      embeds: [successEmbed],
      ephemeral: true
    });
  }

  await showConfigPanel(interaction, true);
}
