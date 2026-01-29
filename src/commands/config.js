import { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, StringSelectMenuBuilder, EmbedBuilder } from 'discord.js';
import { ServerModel } from '../database/models.js';
import { createSubmissionEmbed } from '../utils/embedBuilder.js';

export const data = new SlashCommandBuilder()
  .setName('config-beyondtheboard')
  .setDescription('Configure bot settings (admin only)')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .setDMPermission(false);

export async function execute(interaction) {
  await interaction.deferReply({ ephemeral: true });

  const config = await ServerModel.findByGuildId(interaction.guildId);

  const embed = new EmbedBuilder()
    .setColor('#5865F2')
    .setTitle('🎮 Beyond the Board - Admin Panel')
    .setDescription('**Current Configuration:**')
    .addFields(
      {
        name: 'Submission Channel',
        value: config?.submission_channel_id ? `<#${config.submission_channel_id}>` : '❌ Not set',
        inline: true
      },
      {
        name: 'Announcement Channel',
        value: config?.announcement_channel_id ? `<#${config.announcement_channel_id}>` : '❌ Not set',
        inline: true
      },
      {
        name: '\u200b',
        value: '\u200b',
        inline: true
      },
      {
        name: 'Verifier Role',
        value: config?.verifier_role_id ? `<@&${config.verifier_role_id}>` : '❌ Not set',
        inline: true
      },
      {
        name: 'Admin Role',
        value: config?.admin_role_id ? `<@&${config.admin_role_id}>` : '❌ Not set',
        inline: true
      }
    )
    .setFooter({ text: 'Use the select menu to configure settings' })
    .setTimestamp();

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('admin_config_action')
    .setPlaceholder('Select an action')
    .addOptions([
      {
        label: '⚙️ Setup Submission Embed',
        description: 'Post the static submission button here',
        value: 'setup_embed'
      },
      {
        label: '📢 Set Announcement Channel',
        description: 'Where achievements are announced',
        value: 'set_announcement_channel'
      },
      {
        label: '👥 Set Verifier Role',
        description: 'Role that verifies Tier 1-8',
        value: 'set_verifier_role'
      },
      {
        label: '⭐ Set Admin Role',
        description: 'Role that verifies Tier 9+',
        value: 'set_admin_role'
      }
    ]);

  const row = new ActionRowBuilder().addComponents(selectMenu);

  await interaction.editReply({
    embeds: [embed],
    components: [row]
  });

  const collector = interaction.channel.createMessageComponentCollector({
    filter: i => i.user.id === interaction.user.id && i.customId === 'admin_config_action',
    time: 300000
  });

  collector.on('collect', async i => {
    const action = i.values[0];

    if (action === 'setup_embed') {
      await i.deferUpdate();
      
      const msg = await interaction.channel.send(createSubmissionEmbed());
      await ServerModel.upsert(interaction.guildId, {
        submissionChannelId: interaction.channel.id,
        submissionMessageId: msg.id
      });

      await i.followUp({
        content: '✅ Submission embed posted!',
        ephemeral: true
      });
    }

    else if (action === 'set_announcement_channel') {
      await i.reply({
        content: '📢 Mention the channel for announcements (e.g., #achievements):',
        ephemeral: true
      });

      const msgFilter = m => m.author.id === interaction.user.id;
      const msgCollector = interaction.channel.createMessageCollector({ filter: msgFilter, time: 60000, max: 1 });

      msgCollector.on('collect', async msg => {
        const channel = msg.mentions.channels.first();
        if (!channel) {
          return msg.reply({ content: '❌ Please mention a valid channel.' });
        }

        await ServerModel.upsert(interaction.guildId, {
          announcementChannelId: channel.id
        });

        await msg.reply(`✅ Announcement channel set to ${channel}!`);
      });
    }

    else if (action === 'set_verifier_role') {
      await i.reply({
        content: '👥 Mention the role for Tier 1-8 verifiers (e.g., @Verifier):',
        ephemeral: true
      });

      const msgFilter = m => m.author.id === interaction.user.id;
      const msgCollector = interaction.channel.createMessageCollector({ filter: msgFilter, time: 60000, max: 1 });

      msgCollector.on('collect', async msg => {
        const role = msg.mentions.roles.first();
        if (!role) {
          return msg.reply({ content: '❌ Please mention a valid role.' });
        }

        await ServerModel.upsert(interaction.guildId, {
          verifierRoleId: role.id
        });

        await msg.reply(`✅ Verifier role set to ${role}!`);
      });
    }

    else if (action === 'set_admin_role') {
      await i.reply({
        content: '⭐ Mention the role for Tier 9+ admins (e.g., @Admin):',
        ephemeral: true
      });

      const msgFilter = m => m.author.id === interaction.user.id;
      const msgCollector = interaction.channel.createMessageCollector({ filter: msgFilter, time: 60000, max: 1 });

      msgCollector.on('collect', async msg => {
        const role = msg.mentions.roles.first();
        if (!role) {
          return msg.reply({ content: '❌ Please mention a valid role.' });
        }

        await ServerModel.upsert(interaction.guildId, {
          adminRoleId: role.id
        });

        await msg.reply(`✅ Admin role set to ${role}!`);
      });
    }
  });

  collector.on('end', () => {
    interaction.editReply({ components: [] }).catch(() => {});
  });
}
