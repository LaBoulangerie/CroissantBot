import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
} from "discord.js";
import config from "../config";
import { Command } from "../types/command";

const Ping: Command = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pong ! Renvoie la latence du bot en ms")
        .toJSON(),
    run(client, interaction) {
        const pingEmbed = new EmbedBuilder()
            .setColor(config.color)
            .setTitle("🏓 Pong")
            .setDescription(interaction.client.ws.ping + "ms");

        interaction.reply({ embeds: [pingEmbed] });
    },
};

export default Ping;
