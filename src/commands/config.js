import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('config-beyondtheboard')
  .setDescription('Configure bot settings (Admin only)')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .setDMPermission(false);

export async function execute(interaction) {
  // Execution is handled in index.js
  // This file only provides the command structure for registration
}
