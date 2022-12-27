import { EmbedBuilder, Events, GuildMember, TextChannel } from "discord.js";
import config from "../config";
import { Event } from "../types/event";
import { ExtendedClient } from "../types/extendedClient";

const GuildMemberAdd: Event = {
    name: Events.GuildMemberAdd,
    once: false,
    run(client: ExtendedClient, member: GuildMember) {
        const welcomeChannel = client.channels.cache.get(
            config.welcomeChannelID
        ) as TextChannel;

        const logChannel = client.channels.cache.get(
            config.logChannelID
        ) as TextChannel;

        const welcomeEmbed = new EmbedBuilder()
            .setTitle(`👋 Bienvenue ${member.displayName} !`)
            .setColor("#00bf00");

        welcomeChannel.send({ embeds: [welcomeEmbed] });

        const logEmbed = new EmbedBuilder()
            .setTitle(`➡ ${member.displayName}`)
            .setDescription(
                member.guild.memberCount + " membres sur " + member.guild.name
            )
            .setColor("#00bf00");
        logChannel.send({ embeds: [logEmbed] });
    },
};

export default GuildMemberAdd;
