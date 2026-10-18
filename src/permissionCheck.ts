import { GuildMember, PermissionsBitField } from "discord.js";

export function isMemberModerator(member: GuildMember): boolean {
    return member.permissions.has([PermissionsBitField.Flags.ManageMessages]);
}