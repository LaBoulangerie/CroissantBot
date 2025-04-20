import { EmbedBuilder, hyperlink } from "@discordjs/builders";
import { Colors, inlineCode, SlashCommandBuilder } from "discord.js";
import config from "../config";
import fetcher from "../fetcher";
import { Command } from "../types/command";

const Nation: Command = {
    data: new SlashCommandBuilder()
        .setName("nation")
        .setDescription("Donne des infos sur une nation")
        .addStringOption((option) =>
            option
                .setName("identifier")
                .setDescription("Nom ou UUID de la nation")
                .setRequired(true)
                .setAutocomplete(true)
        )
        .toJSON(),
    async run(_client, interaction) {
        await interaction.deferReply();

        const identifier = interaction.options.getString("identifier", true);
        const { data: nation, error } = await fetcher.GET("/nation/{identifier}", {
            params: {
                path: {
                    identifier,
                },
            },
        });

        if (error) {
            const errorEmbed = new EmbedBuilder()
                .setColor(Colors.Red)
                .setTitle(`❌ Erreur ${error.status}`)
                .setDescription(error.message);

            return await interaction.editReply({
                embeds: [errorEmbed],
            });
        }

        const nationEmbed = new EmbedBuilder()
            .setColor(parseInt(nation.color, 16))
            .setTitle("🚩 " + nation.name);

        if (nation.allies.length) {
            nationEmbed.addFields({
                name: "🤝 Alliés",
                value: nation.allies.map((x) => inlineCode(x.name)).join(", "),
            });
        }

        if (nation.enemies.length) {
            nationEmbed.addFields({
                name: "⚔️ Enemis",
                value: nation.enemies.map((x) => inlineCode(x.name)).join(", "),
            });
        }

        nationEmbed.addFields(
            {
                name: "👑 Capitale",
                value: nation.capital.name,
                inline: true,
            },
            {
                name: `🏘️ ${nation.lands.length} villes`,
                value: nation.lands.map((land) => inlineCode(land.name)).join(", "),
                inline: true,
            },
            {
                name: "💰 Banque",
                value: inlineCode(nation.balance.toString()) + "฿",
                inline: true,
            },
            {
                name: config.wikiEmoji + " Page wiki",
                value: hyperlink(nation.name, config.wikiBaseURL + "wiki/" + nation.name),
                inline: true,
            }
        );

        return await interaction.editReply({ embeds: [nationEmbed] });
    },
    async autocomplete(_client, interaction) {
        const focusedValue = interaction.options.getFocused();
        const { data: nations } = await fetcher.GET("/nation");

        const filtered = Array.from(nations)
            .filter((choice) => choice.name.toLowerCase().startsWith(focusedValue.toLowerCase()))
            .slice(0, 25); // Discord limit
        await interaction.respond(
            filtered.map((choice) => ({
                name: choice.name,
                value: choice.name,
            }))
        );
    },
};

export default Nation;
