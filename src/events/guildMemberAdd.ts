import { Colors, EmbedBuilder, Events, GuildMember, TextChannel } from "discord.js";
import config from "../config";
import { Event } from "../types/event";

const GuildMemberAdd: Event = {
    name: Events.GuildMemberAdd,
    once: false,
    run(client, member: GuildMember) {
        const logChannel = client.channels.cache.get(config.logChannelID) as TextChannel;

        const logEmbed = new EmbedBuilder()
            .setTitle(`➡ ${member.displayName}`)
            .setDescription(member.guild.memberCount + " membres sur " + member.guild.name)
            .setColor(Colors.Green);
        logChannel.send({ embeds: [logEmbed] });
    },
};

export default GuildMemberAdd;
