import { ChatInputCommandInteraction, MessageFlags, SlashCommandBuilder } from "discord.js";
import { isMemberModerator } from "../../permissionCheck.ts";

export const data = new SlashCommandBuilder()
    .setName('anonmessage')
    .setDescription('Allows you to send an anonymous "message from staff".')
    .addStringOption((option) => option.setName('user').setDescription('The username of the recipient.').setRequired(true))
    .addStringOption((option) => option.setName('content').setDescription('The content of the message.').setRequired(true));
export async function execute(interaction: ChatInputCommandInteraction) {
    if (!isMemberModerator) {
        await interaction.reply({ content: "🤖 I cannot let you run this command.",  flags: MessageFlags.Ephemeral })
        return;
    }
    const bot = interaction.client.mwRt3;

    const content = interaction.options.getString('content');
    const target = interaction.options.getString('user');
; 
    await interaction.deferReply(); 

    try {
        await bot.newSection(`User_talk:${target}`, '📨 Message From Staff', content);
        await interaction.followUp(`🤖 I have delivered your message.`)
    } catch (error) {
        await interaction.followUp(`🤖 I wasn't able to deliver this message. *I have logged this.*`)
        console.log('[!] [SetSiteNotice]: Failed to set site notice. Got error: ' + error.message)
    }

};