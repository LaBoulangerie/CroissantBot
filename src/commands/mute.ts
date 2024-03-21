import {
    Colors,
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder,
    TextChannel,
    userMention,
} from "discord.js";
import { Command } from "../types/command";
import config from "../config";

const Mute: Command = {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Mute un utilisateur pendant une durée définie")
        .addUserOption((option) =>
            option.setName("user").setDescription("Utilisateur a mute").setRequired(true)
        )
        .addIntegerOption((option) =>
            option.setName("duration").setDescription("Durée du mute en minutes").setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
        .toJSON(),

    async run(client, interaction) {
        const muter = interaction.user;
        const user = interaction.options.getUser("user");
        const duration = interaction.options.getInteger("duration"); // minutes

        const guildMember = client.guilds.cache.get(config.guildID).members.cache.get(user.id);

        if (!guildMember) {
            await interaction.reply({ content: "Utilisateur non trouvé sur le serveur." });
        }

        guildMember.voice.setMute(true);

        const muteEmbed = new EmbedBuilder()
            .setTitle("🤐 Mute automatique")
            .setColor(Colors.Blurple)
            .setDescription(
                `${userMention(muter.id)} a mute ${userMention(user.id)} pour ${duration} minutes.`
            );

        const modChannel = client.channels.cache.get(config.modChannelID) as TextChannel;
        modChannel.send({ embeds: [muteEmbed] });
        setTimeout(() => {
            guildMember.voice.setMute(false);
            const endMuteEmbed = muteEmbed.setDescription(
                `${userMention(user.id)} a fini sa période de mute (par ${userMention(muter.id)}).`
            );
            modChannel.send({ embeds: [endMuteEmbed] });
        }, duration * 1000 * 60);
    },
};

export default Mute;
