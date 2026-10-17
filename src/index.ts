import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'url';
import config from './config.json' with { type: "json" };
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js';

const __filename = fileURLToPath(import.meta.url);

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once(Events.ClientReady, (readyClient: Client<true>) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

// Command Loading
client.commands = new Collection();
const foldersPath = path.join(path.dirname(__filename), 'commands')
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[!] [Command Loading]: The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.login(config.token);