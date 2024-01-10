import { EmbedBuilder, inlineCode, SlashCommandBuilder, time, TimestampStyles } from "discord.js";
import config from "../config";
import { Command } from "../types/command";
import { DateTime } from "luxon";

const firstDay = DateTime.utc(2022, 9, 1); // 01/09/2022
const months = ["Gaiarkhè", "Tempopidum", "Quinésil", "Éposendre"];

const GDate: Command = {
    data: new SlashCommandBuilder()
        .setName("date")
        .setDescription("Donne une date donnée dans le calendrier Gaiartois.")
        .addStringOption((option) =>
            option.setName("date").setDescription("Date au format JJ/MM/AAAA").setRequired(false)
        )
        .toJSON(),
    run(client, interaction) {
        const dateOption = interaction.options.getString("date", false);

        const dateString = dateOption
            ? dateOption
            : DateTime.now().toLocaleString(DateTime.DATE_SHORT);
        const date = dateOption ? DateTime.fromFormat(dateOption, "dd/MM/yyyy") : DateTime.now();

        if (!date.isValid) {
            interaction.reply({
                ephemeral: true,
                content: "Date invalide: " + date.invalidExplanation,
            });
            return;
        }

        const day = date.day;
        const month = months[(date.month - 1) % months.length];
        const nMonthsSinceFirstDay =
            (date.year - firstDay.year) * 12 - firstDay.month + 1 + date.month;
        let year = Math.ceil(nMonthsSinceFirstDay / 4);
        if (year <= 0) year--; // year 0 doesn't exist in Gaiartian calendar

        const dateEmbed = new EmbedBuilder()
            .setTitle(`🗓️ Date Gaiartoise du ${dateString}`)
            .setColor(config.color)
            .setDescription(`${day} ${month} An ${year}`);

        interaction.reply({ embeds: [dateEmbed] });
    },
};

export default GDate;
