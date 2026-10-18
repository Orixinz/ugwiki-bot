import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName('setsitenotice')
    .setDescription('Sets the site notice to the specified text.')
    .addStringOption((option) => option.setName('content').setDescription('The content of the site notice. If you do not pass this, the site notice will be cleared.'));
export async function execute(interaction: ChatInputCommandInteraction) {
    const bot = interaction.client.mwRt3;

    const content = interaction.options.getString('content') ?? '-';
    const name = interaction.user.globalName;
; 
    await interaction.deferReply(); 

    try {
        await bot.save('MediaWiki:Sitenotice', content, `This site notice was set by Discord user ${name}.`);
        await bot.save('MediaWiki:Sitenotice_id', Date.now().toString(), `This site notice was set by Discord user ${name}.`)
        await interaction.followUp(`🤖 I have set the site notice to ${interaction.options.getString('content') ?? 'nothing, I cleared it'}.`)
    } catch (error) {
        await interaction.followUp(`🤖 I wasn't able to set the site notice. *I have logged this.*`)
        console.log('[!] [SetSiteNotice]: Failed to set site notice. Got error: ' + error.message)
    }

};