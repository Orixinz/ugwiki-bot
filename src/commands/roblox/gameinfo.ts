import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { warn } from "../../log.ts";
import config from '../../config.json' with { type: "json" };

const RT3 = 119048529960596;

export const data = new SlashCommandBuilder()
    .setName('gameinfo')
    .setDescription('View information on a specified Roblox game.')
    .addIntegerOption((option) => option.setName('placeid').setDescription('The PlaceId of the game.'));
export async function execute(interaction: ChatInputCommandInteraction) {
    const placeId = interaction.options.getInteger('placeid') ?? RT3;
    await interaction.deferReply(); 

    try {
        const placeInfoResponse = await fetch(`https://games.roblox.com/v1/games/multiget-place-details?placeIds=${placeId}`, {
            headers: {
                Cookie: ".ROBLOSECURITY=" + config.robloxCookie
            }
        });
        if (!placeInfoResponse.ok) {
            await interaction.followUp(`🤖 I wasn't able to get this game's information.`);
            return;
        }

        const placeInfoJson = await placeInfoResponse.json();
        if (!placeInfoJson) {
            await interaction.followUp(`🤖 I wasn't able to get this game's information.`);
            return;
        }
        const universeId = placeInfoJson[0].universeId;

        const url = `https://games.roblox.com/v1/games?universeIds=${universeId}`;
        const response = await fetch(url);

        if (!response.ok) {
            return;
        }

        const json = await response.json();
        const data = json.data[0];
        
        await interaction.followUp({
            components: [
                {
                    "type": 10,
                    "content": "🤖 Here you go:"
                },
                {
                    "type": 17,
                    "components": [
                        {
                            "type": 10,
                            "content": `# ${data.name}\n${data.description}`
                        },
                        {
                            "type": 10,
                            "content": `Playing: ${data.playing}\nVisits: ${data.visits}\nFavourites: ${data.favoritedCount}\n`
                        },
                        {
                            "type": 10,
                            "content": `Created: ${data.created}\nLast Updated: ${data.updated}\nUniverse ID: ${universeId}`
                        },
                        {
                            "type": 1,
                            "components": [
                                {
                                    "type": 2,
                                    "style": 5,
                                    "url": "https://www.roblox.com/games/" + placeId.toString(),
                                    "label": "View on Roblox",
                                }
                            ]
                        }
                    ]
                }
            ],
            flags: [MessageFlags.IsComponentsV2]
        });
    } catch (error) {
        await interaction.followUp(`🤖 I wasn't able to get this game's information. *I have logged this.*`);
        warn('[SetSiteNotice]: Failed to get game info. Got error: ' + error.message);
    }
};