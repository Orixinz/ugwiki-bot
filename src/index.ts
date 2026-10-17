import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import config from './config.json' with { type: "json" };
import { Client, Collection, Events, GatewayIntentBits, SlashCommandBuilder } from 'discord.js';

const __filename = fileURLToPath(import.meta.url);

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, (readyClient: Client<true>) => {
  console.log(`[ClientReady]: Ready! Logged in as ${readyClient.user.tag}`);
});

// Command Loading
client.commands = new Collection();
const foldersPath = path.join(path.dirname(__filename), 'commands')
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.ts'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		var { data, execute } = await import(filePath)
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if (data && execute) {
			client.commands.set(data.name, execute);
      console.log(`[Command Loaded]: Loaded command ${data.name}`)
		} else {
			console.log(`[!] [Command Loading]: The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Command Handling
client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`[!] [Command Handling]: No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command(interaction);
	} catch (error) {
		console.error('[!] [Command Error]: ' + error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'An error occured while trying to run this command.',
				flags: MessageFlags.Ephemeral,
			});
		} else {
			await interaction.reply({
				content: 'An error occured while trying to run this command.',
				flags: MessageFlags.Ephemeral,
			});
		}
	}
});

client.login(config.token);