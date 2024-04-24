import { EmbedBuilder, SlashCommandBuilder, hyperlink } from "discord.js";
import { Command } from "../types/command";
import fetcher from "../fetcher";
import config from "../config";

const Vote: Command = {
    data: new SlashCommandBuilder()
        .setName("vote")
        .setDescription("Votez pour La Boulangerie !")
        .toJSON(),
    async run(client, interaction) {
        const votes = await fetcher.path("/vote").method("get").create()({});
        const domains = votes.data.map((v) => new URL(v).hostname);

        const votesEmbed = new EmbedBuilder()
            .setColor(config.color)
            .setTitle("🗳️ Votez pour La Boulangerie !")
            .setDescription(votes.data.map((v, i) => hyperlink(domains[i], v)).join("\n"));

        interaction.reply({ embeds: [votesEmbed] });
    },
};

export default Vote;
