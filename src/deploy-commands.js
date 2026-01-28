import { REST, Routes, SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const commands = [
  new SlashCommandBuilder()
    .setName('config-beyondtheboard')
    .setDescription('Admin configuration (work in progress)')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

try {
  console.log(`🔄 Deploying ${commands.length} command(s)...`);
  
  const data = await rest.put(
    Routes.applicationCommands(process.env.CLIENT_ID),
    { body: commands.map(cmd => cmd.toJSON()) },
  );

  console.log(`✅ Successfully deployed ${data.length} command(s)!`);
} catch (error) {
  console.error('❌ Error:', error);
}
