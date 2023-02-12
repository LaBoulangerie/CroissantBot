import { Colors, EmbedBuilder, Events, TextChannel } from "discord.js";
import config from "../config";
import { Event } from "../types/event";

const GuildMemberRemove: Event = {
    name: Events.GuildMemberRemove,
    once: false,
    run(client, member) {
        const logChannel = client.channels.cache.get(config.logChannelID) as TextChannel;

        const logEmbed = new EmbedBuilder()
            .setTitle(`← ${member.displayName}`)
            .setDescription(member.guild.memberCount + " membres sur " + member.guild.name)
            .setColor(Colors.Red);

        logChannel.send({ embeds: [logEmbed] });
    },
};

export default GuildMemberRemove;
