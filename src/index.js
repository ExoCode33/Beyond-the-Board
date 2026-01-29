import { Client, GatewayIntentBits, Collection, Events, ActionRowBuilder, StringSelectMenuBuilder, ChannelType, ModalBuilder, TextInputBuilder, TextInputStyle, PermissionFlagsBits, REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initializeDatabase } from './database/schema.js';
import { ServerModel, UserModel, AchievementModel, ThreadModel, TierNineCooldownModel } from './database/models.js';
import gameLoader from './utils/gameLoader.js';
import { createSubmissionEmbed, createVerificationButtons, createAnnouncementEmbed } from './utils/embedBuilder.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

// Load commands
async function loadCommands() {
  const commandsPath = path.join(__dirname, 'commands');
  if (!fs.existsSync(commandsPath)) {
    console.log('  ⚠️  No commands directory found');
    return;
  }
  
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(`file://${filePath}`);
    
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      console.log(`  ✅ Loaded: ${command.data.name}`);
    }
  }
}

// Auto-deploy commands
async function deployCommands() {
  try {
    const commands = Array.from(client.commands.values()).map(cmd => cmd.data.toJSON());
    
    if (commands.length === 0) {
      console.log('  ⚠️  No commands to deploy');
      return;
    }
    
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    
    console.log(`  🔄 Deploying ${commands.length} command(s)...`);
    
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );
    
    console.log(`  ✅ Commands deployed!`);
  } catch (error) {
    console.error('  ❌ Command deployment failed:', error);
  }
}

// Ready event
client.once(Events.ClientReady, async () => {
  console.log(`✅ Bot ready! Logged in as ${client.user.tag}`);
  
  // Restore static embeds
  for (const [guildId, guild] of client.guilds.cache) {
    const config = await ServerModel.findByGuildId(guildId);
    if (config?.submission_channel_id && config?.submission_message_id) {
      const channel = guild.channels.cache.get(config.submission_channel_id);
      if (channel) {
        try {
          await channel.messages.fetch(config.submission_message_id);
        } catch {
          const msg = await channel.send(createSubmissionEmbed());
          await ServerModel.updateSubmissionMessage(guildId, channel.id, msg.id);
        }
      }
    }
  }

  // Check pending threads every 5 minutes
  setInterval(async () => {
    const pending = await ThreadModel.getPending();
    for (const threadData of pending) {
      const guild = client.guilds.cache.get(threadData.guild_id);
      if (!guild) continue;
      
      const thread = guild.channels.cache.get(threadData.thread_id);
      if (!thread) {
        await ThreadModel.updateStatus(threadData.thread_id, 'rejected');
        const ach = await AchievementModel.findByThreadId(threadData.thread_id);
        if (ach) {
          await AchievementModel.reject(ach.id, null, 'Thread deleted');
        }
      }
    }
  }, 5 * 60 * 1000);
});

// Interaction handler
client.on(Events.InteractionCreate, async (interaction) => {
  // Handle slash commands
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    
    if (!command) {
      console.error(`Command ${interaction.commandName} not found`);
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error executing ${interaction.commandName}:`, error);
      const msg = { content: '❌ Command error!', ephemeral: true };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(msg);
      } else {
        await interaction.reply(msg);
      }
    }
    return;
  }

  // Button: Submit achievement
  if (interaction.isButton() && interaction.customId === 'submit_achievement') {
    await interaction.deferReply({ ephemeral: true });

    const userId = interaction.user.id;
    await UserModel.upsert(userId, interaction.user.tag);

    const pending = await AchievementModel.getPendingCount(userId);
    if (pending >= 3) {
      return interaction.editReply('❌ You have 3 pending submissions already.');
    }

    const games = gameLoader.getAllGames();
    if (games.length === 0) {
      return interaction.editReply('❌ No games available.');
    }

    const gameOptions = games.map(g => ({
      label: g.displayName,
      value: g.name,
      description: `${g.totalAchievements} achievements`
    }));

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('select_game')
      .setPlaceholder('Select a game')
      .addOptions(gameOptions);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    return interaction.editReply({
      content: '**Select a game:**',
      components: [row]
    });
  }

  // Select: Game selection
  if (interaction.isStringSelectMenu() && interaction.customId === 'select_game') {
    await interaction.deferUpdate();

    const gameName = interaction.values[0];
    const userId = interaction.user.id;

    let progress = await UserModel.getGameProgress(userId, gameName);
    if (!progress) {
      progress = await UserModel.initializeGameProgress(userId, gameName);
    }

    const game = gameLoader.getGame(gameName);
    const tier = progress.current_tier;
    const available = game.tiers[tier] || [];

    const unclaimed = [];
    for (const ach of available) {
      const existing = await AchievementModel.findByUserAndAchievement(userId, ach.id);
      if (!existing || existing.status === 'rejected') {
        unclaimed.push(ach);
      }
    }

    if (unclaimed.length === 0) {
      return interaction.editReply({
        content: `✅ All Tier ${tier} achievements claimed!`,
        components: []
      });
    }

    const achOptions = unclaimed.map(a => ({
      label: a.name,
      value: a.id,
      description: `Tier ${a.tier} • ${a.tokenReward} tokens`
    }));

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId(`select_achievement_${gameName}`)
      .setPlaceholder('Select achievement')
      .addOptions(achOptions);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    return interaction.editReply({
      content: `**Select achievement (Tier ${tier}):**`,
      components: [row]
    });
  }

  // Select: Achievement selection - creates thread
  if (interaction.isStringSelectMenu() && interaction.customId.startsWith('select_achievement_')) {
    await interaction.deferUpdate();

    const gameName = interaction.customId.replace('select_achievement_', '');
    const achievementId = interaction.values[0];
    const userId = interaction.user.id;

    const achievement = gameLoader.getAchievement(achievementId);
    const game = gameLoader.getGame(gameName);
    const config = await ServerModel.findByGuildId(interaction.guildId);

    if (!config?.verifier_role_id) {
      return interaction.editReply({
        content: '❌ Server not configured. Ask admin to run /config-beyondtheboard',
        components: []
      });
    }

    const threadName = `[${game.displayName}] ${achievement.name} - ${interaction.user.username}`;
    
    const thread = await interaction.channel.threads.create({
      name: threadName.substring(0, 100),
      type: ChannelType.PrivateThread,
    });

    await thread.members.add(userId);

    // Add verifiers and admins
    const guild = interaction.guild;
    const verifiers = guild.members.cache.filter(m => m.roles.cache.has(config.verifier_role_id));
    for (const [, member] of verifiers) {
      await thread.members.add(member.id).catch(() => {});
    }
    if (config.admin_role_id) {
      const admins = guild.members.cache.filter(m => m.roles.cache.has(config.admin_role_id));
      for (const [, member] of admins) {
        await thread.members.add(member.id).catch(() => {});
      }
    }

    await AchievementModel.create({
      userId,
      achievementId,
      gameName,
      tier: achievement.tier,
      threadId: thread.id,
      guildId: interaction.guildId
    });

    await ThreadModel.create({
      threadId: thread.id,
      userId,
      achievementId,
      gameName,
      tier: achievement.tier,
      guildId: interaction.guildId,
      isTierNine: false
    });

    await thread.send({
      content: `<@${userId}>\n\n**${achievement.name}**\n${achievement.description}\n\n**Required:** Upload **${achievement.requiredImages}** screenshot(s) showing:\n${achievement.imageRequirements.map((req, i) => `${i + 1}. ${req}`).join('\n')}\n\n${achievement.verificationHints ? `*Verification hints: ${achievement.verificationHints}*` : ''}`
    });

    const buttons = createVerificationButtons(thread.id);
    await thread.send({
      content: `**Verifiers:** Review and verify`,
      components: [buttons]
    });

    return interaction.editReply({
      content: `✅ Thread created: <#${thread.id}>`,
      components: []
    });
  }

  // Button: Approve
  if (interaction.isButton() && interaction.customId.startsWith('verify_approve_')) {
    await interaction.deferReply({ ephemeral: true });

    const threadId = interaction.customId.replace('verify_approve_', '');
    const verifierId = interaction.user.id;

    const threadData = await ThreadModel.findById(threadId);
    const config = await ServerModel.findByGuildId(interaction.guildId);

    const isTierNine = threadData.is_tier_nine;
    const requiredRole = isTierNine ? config.admin_role_id : config.verifier_role_id;

    if (!interaction.member.roles.cache.has(requiredRole) && !interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.editReply('❌ You need the proper role to verify.');
    }

    const achievement = await AchievementModel.findByThreadId(threadId);
    const achievementData = gameLoader.getAchievement(achievement.achievement_id);
    const game = gameLoader.getGame(achievement.game_name);

    await AchievementModel.approve(achievement.id, verifierId);

    const updatedProgress = await UserModel.addTokens(
      achievement.user_id,
      achievement.game_name,
      achievementData.tokenReward
    );

    const currentTier = updatedProgress.current_tier;
    const completed = await AchievementModel.getCompletedForTier(
      achievement.user_id,
      achievement.game_name,
      currentTier
    );
    const total = game.tiers[currentTier]?.length || 0;

    if (completed.length === total && currentTier < 10) {
      await UserModel.updateTier(achievement.user_id, achievement.game_name, currentTier + 1);
    }

    await ThreadModel.updateStatus(threadId, 'approved');

    if (config.announcement_channel_id) {
      const channel = interaction.guild.channels.cache.get(config.announcement_channel_id);
      if (channel) {
        const user = await client.users.fetch(achievement.user_id);
        const embed = createAnnouncementEmbed(user, achievementData, updatedProgress.tokens, game.displayName);
        await channel.send({ embeds: [embed] });
      }
    }

    await interaction.channel.send(`✅ **Approved!** <@${achievement.user_id}> earned **${achievementData.tokenReward} tokens** 🪙`);
    await interaction.editReply('✅ Achievement approved!');

    setTimeout(async () => {
      await interaction.channel.delete().catch(() => {});
      await ThreadModel.delete(threadId);
    }, 2000);
  }

  // Button: Deny - show modal
  if (interaction.isButton() && interaction.customId.startsWith('verify_deny_')) {
    const threadId = interaction.customId.replace('verify_deny_', '');

    const modal = new ModalBuilder()
      .setCustomId(`denial_modal_${threadId}`)
      .setTitle('Denial Reason');

    const reasonInput = new TextInputBuilder()
      .setCustomId('denial_reason')
      .setLabel('Why deny this submission?')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(false)
      .setPlaceholder('Optional reason');

    const row = new ActionRowBuilder().addComponents(reasonInput);
    modal.addComponents(row);

    await interaction.showModal(modal);
  }

  // Modal: Denial reason
  if (interaction.isModalSubmit() && interaction.customId.startsWith('denial_modal_')) {
    await interaction.deferReply({ ephemeral: true });

    const threadId = interaction.customId.replace('denial_modal_', '');
    const reason = interaction.fields.getTextInputValue('denial_reason') || 'No reason provided';
    const verifierId = interaction.user.id;

    const threadData = await ThreadModel.findById(threadId);
    const achievement = await AchievementModel.findByThreadId(threadId);

    await AchievementModel.reject(achievement.id, verifierId, reason);
    await ThreadModel.updateStatus(threadId, 'rejected');

    if (threadData.is_tier_nine) {
      await TierNineCooldownModel.setCooldown(achievement.user_id, achievement.game_name, 72);
    }

    await interaction.channel.send(
      `❌ **Denied**\n\n<@${achievement.user_id}>, your submission was denied.\n\n**Reason:** ${reason}\n\nThread deletes in 24 hours.`
    );

    await interaction.editReply('✅ Submission denied.');

    setTimeout(async () => {
      await interaction.channel.delete().catch(() => {});
      await ThreadModel.delete(threadId);
    }, 24 * 60 * 60 * 1000);
  }
});

// Initialize
async function init() {
  try {
    console.log('🚀 Starting bot...\n');

    console.log('📊 Database:');
    await initializeDatabase();

    console.log('\n🎮 Games:');
    await gameLoader.loadGames();

    console.log('\n⚙️  Commands:');
    await loadCommand
