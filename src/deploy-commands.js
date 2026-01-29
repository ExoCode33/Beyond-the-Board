import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function deployCommands() {
  const commands = [];
  const commandsPath = path.join(__dirname, 'commands');
  
  if (!fs.existsSync(commandsPath)) {
    console.error('❌ Commands directory not found!');
    process.exit(1);
  }
  
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  console.log(`\n📂 Found ${commandFiles.length} command file(s)\n`);

  for (const file of commandFiles) {
    try {
      const filePath = path.join(commandsPath, file);
      const command = await import(`file://${filePath}`);
      
      if ('data' in command && command.data) {
        commands.push(command.data.toJSON());
        console.log(`  ✅ Loaded: ${command.data.name}`);
      } else {
        console.log(`  ⚠️  Skipped ${file}: missing 'data' export`);
      }
    } catch (error) {
      console.error(`  ❌ Error loading ${file}:`, error.message);
    }
  }

  if (commands.length === 0) {
    console.error('\n❌ No commands to deploy!');
    process.exit(1);
  }

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  try {
    console.log(`\n🔄 Deploying ${commands.length} command(s) to Discord...\n`);
    
    const data = await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );

    console.log(`✅ Successfully deployed ${data.length} command(s)!\n`);
    
    data.forEach(cmd => {
      console.log(`   • /${cmd.name}`);
    });
    
    console.log('');
  } catch (error) {
    console.error('\n❌ Deployment failed:', error);
    process.exit(1);
  }
}

deployCommands();
