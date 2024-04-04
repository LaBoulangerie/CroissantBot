import { SlashCommandBuilder } from "discord.js";
import { Command } from "../types/command";
import axios from "axios";
import config from "../config";

const Ask: Command = {
    data: new SlashCommandBuilder()
        .setName("ask")
        .setDescription("Demander quelque chose en rapport avec le wiki à Croissant IA.")
        .addStringOption((option) =>
            option.setName("question").setDescription("Question à poser").setRequired(true)
        )
        .toJSON(),

    async run(client, interaction) {
        await interaction.deferReply();

        const question = interaction.options.getString("question", true);

        const url = config.croissantIAURL + "/ask";
        const params = {
            request: question,
        };
        const headers = { accept: "application/json" };

        const username = config.croissantIASecret;
        const password = "";

        const response = await axios.post(
            url,
            {},
            {
                headers,
                auth: { username, password },
                params,
            }
        );

        if (response.status != 200) {
            await interaction.reply({
                content: `Erreur ${response.status} lors de la requête à l'IA.`,
                ephemeral: true,
            });
            return;
        }

        await interaction.reply(response.data["answer"]);
    },
};

export default Ask;
