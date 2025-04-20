import { EmbedBuilder, inlineCode, SlashCommandBuilder } from "discord.js";
import config from "../config";
import fetcher from "../fetcher";
import { Command } from "../types/command";

const Lands: Command = {
    data: new SlashCommandBuilder()
        .setName("lands")
        .setDescription("Donne la liste des villes présentes sur le serveur")
        .toJSON(),
    async run(_client, interaction) {
        const { data: lands } = await fetcher.GET("/land");

        const landsEmbed = new EmbedBuilder()
            .setColor(config.color)
            .setTitle(`🏡 ${lands.length} Villes`)
            .setDescription(lands.map((t) => inlineCode(t.name)).join(", "));

        interaction.reply({ embeds: [landsEmbed] });
    },
};

export default Lands;
