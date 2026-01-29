import { Client, GatewayIntentBits, Collection, Events, REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initializeDatabase } from './database/schema.js';
import { ServerModel, ThreadModel, AchievementModel } from './database/models.js';
import gameLoader from './utils/gameLoader.js';
import { createSubmissionEmbed } from './utils/embedBuilder.js';

// Import handlers
import { showConfigPanel, handleConfigAction, handleSubmissionChannelSelect, handleAnnouncementChannelSelect, handleRoleSelect } from './handlers/configHandler.js';
import { handleSubmitButton, handleGameSelect, handleAchievementSelect } from './handlers/submissionHandler.js';
import { handleApprove, showDenyModal, handleDenyModal } from './handlers/verificationHandler.js';

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
    
    console.log(`  🔄 Deploying ${commands.length} command(s) to Discord...`);
    
    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );
    
    console.log(`  ✅ Successfully deployed ${data.length} command(s):`);
    data.forEach(cmd => {
      console.log(`     • /${cmd.name}`);
    });
  } catch (error) {
    console.error('  ❌ Command deployment failed:', error.message);
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

// Interaction router
client.on(Events.InteractionCreate, async (interaction) => {
  try {
    // Slash commands
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === 'config-beyondtheboard') {
        await interaction.deferReply({ ephemeral: true });
        return await showConfigPanel(interaction);
      }
      
      const command = client.commands.get(interaction.commandName);
      if (command) {
        return await command.execute(interaction);
      }
    }

    // Config handlers
    if (interaction.customId === 'admin_config_action') {
      return await handleConfigAction(interaction);
    }
    if (interaction.customId === 'select_submission_channel') {
      return await handleSubmissionChannelSelect(interaction);
    }
    if (interaction.customId === 'select_announcement_channel') {
      return await handleAnnouncementChannelSelect(interaction);
    }
    if (interaction.customId === 'select_verifier_role' || interaction.customId === 'select_admin_role') {
      return await handleRoleSelect(interaction);
    }

    // Submission handlers
    if (interaction.customId === 'submit_achievement') {
      return await handleSubmitButton(interaction);
    }
    if (interaction.customId === 'select_game') {
      return await handleGameSelect(interaction);
    }
    if (interaction.customId?.startsWith('select_achievement_')) {
      const gameName = interaction.customId.replace('select_achievement_', '');
      return await handleAchievementSelect(interaction, gameName);
    }

    // Verification handlers
    if (interaction.customId?.startsWith('verify_approve_')) {
      const threadId = interaction.customId.replace('verify_approve_', '');
      return await handleApprove(interaction, threadId, client);
    }
    if (interaction.customId?.startsWith('verify_deny_')) {
      const threadId = interaction.customId.replace('verify_deny_', '');
      return showDenyModal(interaction, threadId);
    }
    if (interaction.customId?.startsWith('denial_modal_')) {
      const threadId = interaction.customId.replace('denial_modal_', '');
      return await handleDenyModal(interaction, threadId);
    }

  } catch (error) {
    console.error('Interaction error:', error);
    const msg = { content: '❌ An error occurred!', ephemeral: true };
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(msg).catch(() => {});
    } else {
      await interaction.reply(msg).catch(() => {});
    }
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
    await loadCommands();
    await deployCommands();

    console.log('\n🔐 Logging in...');
    await client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

init();

export default client;
