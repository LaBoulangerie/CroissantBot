import { EmbedBuilder, inlineCode, SlashCommandBuilder } from "discord.js";
import config from "../config";
import { Command } from "../types/command";

const coins = [4096, 64, 1];
const emojis = [
    config.moneyBaguetteEmoji,
    config.moneyCroissantEmoji,
    config.moneyBriocheEmoji,
];

const Converter: Command = {
    data: new SlashCommandBuilder()
        .setName("converter")
        .setDescription(
            "Convertit un montant en pièces baguette, croissant et brioche."
        )
        .addIntegerOption((option) =>
            option.setName("amount").setDescription("Montant").setRequired(true)
        )
        .toJSON(),
    run(client, interaction) {
        const amount = interaction.options.getInteger("amount", true);
        const coinsForAmount = converter(amount);

        const converterEmbed = new EmbedBuilder()
            .setTitle("💰 Convertisseur")
            .setColor(config.color)
            .setDescription(
                inlineCode(amount.toString()) +
                    "฿ : " +
                    coinsForAmount
                        .map((c, i) =>
                            c != 0 ? inlineCode(c) + emojis[i] : ""
                        )
                        .join(" ")
            );

        interaction.reply({ embeds: [converterEmbed] });
    },
};

function converter(amount: number) {
    let coinsAmount = new Array(coins.length);
    for (let i = 0; i < coins.length; i++) {
        const quotient = Math.floor(amount / coins[i]);
        coinsAmount[i] = quotient;
        if (quotient == 0) continue;
        amount -= quotient * coins[i];
    }
    return coinsAmount;
}

export default Converter;
