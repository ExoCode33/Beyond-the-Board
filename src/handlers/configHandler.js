import { ActionRowBuilder, ChannelSelectMenuBuilder, RoleSelectMenuBuilder, ChannelType, StringSelectMenuBuilder } from 'discord.js';
import { ServerModel } from '../database/models.js';
import { createSubmissionEmbed, createConfigEmbed, createChannelSelectEmbed, createRoleSelectEmbed, createSuccessEmbed } from '../utils/embedBuilder.js';

export async function showConfigPanel(interaction, isUpdate = false) {
  const config = await ServerModel.findByGuildId(interaction.guildId);
  const embed = createConfigEmbed(config);

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
        label: 'Refresh Configuration',
        description: 'View current settings',
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
      .setPlaceholder('📋 Select Channel')
      .setChannelTypes(ChannelType.GuildText);

    const row = new ActionRowBuilder().addComponents(channelSelect);
    const embed = createChannelSelectEmbed('submission');

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
      .setPlaceholder('📢 Select Channel')
      .setChannelTypes(ChannelType.GuildText);

    const row = new ActionRowBuilder().addComponents(channelSelect);
    const embed = createChannelSelectEmbed('announcement');

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
      .setPlaceholder('👥 Select Role');

    const row = new ActionRowBuilder().addComponents(roleSelect);
    const embed = createRoleSelectEmbed('verifier');

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
      .setPlaceholder('⭐ Select Role');

    const row = new ActionRowBuilder().addComponents(roleSelect);
    const embed = createRoleSelectEmbed('admin');

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

  const successEmbed = createSuccessEmbed('submission_channel', channel);

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

  const successEmbed = createSuccessEmbed('announcement_channel', channel);

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

    const successEmbed = createSuccessEmbed('verifier_role', role);

    await interaction.followUp({
      embeds: [successEmbed],
      ephemeral: true
    });
  } else if (interaction.customId === 'select_admin_role') {
    await ServerModel.upsert(interaction.guildId, {
      adminRoleId: role.id
    });

    const successEmbed = createSuccessEmbed('admin_role', role);

    await interaction.followUp({
      embeds: [successEmbed],
      ephemeral: true
    });
  }

  await showConfigPanel(interaction, true);
}
