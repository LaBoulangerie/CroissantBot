import { EmbedBuilder, inlineCode, SlashCommandBuilder } from "discord.js";
import config from "../config";
import fetcher from "../fetcher";
import { Command } from "../types/command";

const Nations: Command = {
    data: new SlashCommandBuilder()
        .setName("nations")
        .setDescription("Donne la liste des nations présentes sur le serveur")
        .toJSON(),
    async run(_client, interaction) {
        const nations = await fetcher.GET("/nation");

        const nationsEmbed = new EmbedBuilder()
            .setColor(config.color)
            .setTitle(`🚩 ${nations.data.length} Nations`)
            .setDescription(nations.data.map((n) => inlineCode(n.name)).join(", "));

        interaction.reply({ embeds: [nationsEmbed] });
    },
};

export default Nations;
