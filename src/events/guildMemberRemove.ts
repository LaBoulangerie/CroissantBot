import {
    Client,
    EmbedBuilder,
    Events,
    GuildMember,
    TextChannel,
} from "discord.js";
import config from "../config";
import { Event } from "../types/event";

const GuildMemberRemove: Event = {
    name: Events.GuildMemberRemove,
    once: false,
    run(client: Client, member: GuildMember) {
        const logChannel = client.channels.cache.get(
            config.logChannelID
        ) as TextChannel;

        const logEmbed = new EmbedBuilder()
            .setTitle(`← ${member.displayName}`)
            .setDescription(
                member.guild.memberCount + " membres sur " + member.guild.name
            )
            .setColor("#ff0000");

        logChannel.send({ embeds: [logEmbed] });
    },
};

export default GuildMemberRemove;
