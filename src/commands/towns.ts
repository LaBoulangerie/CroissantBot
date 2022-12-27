import { EmbedBuilder, inlineCode, SlashCommandBuilder } from "discord.js";
import config from "../config";
import fetcher from "../fetcher";
import { Command } from "../types/command";

const Towns: Command = {
    data: new SlashCommandBuilder()
        .setName("towns")
        .setDescription("Donne la liste des villes présentes sur le serveur")
        .toJSON(),
    async run(interaction) {
        const towns = await fetcher.path("/town").method("get").create()({});

        const townsEmbed = new EmbedBuilder()
            .setColor(config.color)
            .setTitle(`🏡 ${towns.data.length} Villes`)
            .setDescription(
                towns.data.map((t) => inlineCode(t.name)).join(", ")
            );

        interaction.reply({ embeds: [townsEmbed] });
    },
};

export default Towns;
