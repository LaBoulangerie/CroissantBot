import { Colors, EmbedBuilder, hyperlink, inlineCode, SlashCommandBuilder } from "discord.js";
import config from "../config";
import fetcher from "../fetcher";
import { Command } from "../types/command";

const Land: Command = {
    data: new SlashCommandBuilder()
        .setName("land")
        .setDescription("Donne des infos sur une ville")
        .addStringOption((option) =>
            option
                .setName("identifier")
                .setDescription("Nom ou UUID de la ville")
                .setRequired(true)
                .setAutocomplete(true)
        )
        .toJSON(),

    async run(_client, interaction) {
        await interaction.deferReply();

        const identifier = interaction.options.getString("identifier");
        const { data: land, error } = await fetcher.GET("/land/{identifier}", {
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

        const landEmbed = new EmbedBuilder()
            .setColor(config.color)
            .setTitle("🏡 " + land.levelName + " " + land.name);

        if (land.nation)
            landEmbed.addFields({
                name: "🚩 Nation",
                value: land.nation.name,
                inline: true,
            });

        landEmbed.addFields(
            {
                name: "👨‍💼 Maire",
                value: inlineCode(land.mayor.name),
                inline: true,
            },
            {
                name: `👥 ${land.residents.length} résidents`,
                value: land.residents.map((res) => inlineCode(res.name)).join(", "),
                inline: true,
            },
            {
                name: "💰 Banque",
                value: inlineCode(land.balance.toString()) + "฿",
                inline: true,
            },
            {
                name: "📍 Spawn",
                value:
                    "XYZ: " +
                    inlineCode(
                        `${land.spawn.x.toFixed(2)} 
                        ${land.spawn.y.toFixed(2)} 
                        ${land.spawn.z.toFixed(2)}`
                    ),
                inline: true,
            },
            {
                name: "🌐 Nombre de parcelles",
                value: inlineCode(land.chunksCoordinates.length.toString()),
            },
            {
                name: "📜 Titre",
                value: land.titleMessage,
                inline: true,
            },
            {
                name: config.wikiEmoji + " Page wiki",
                value: hyperlink(land.name, config.wikiBaseURL + "wiki/" + land.name),
                inline: true,
            }
        );

        return await interaction.editReply({ embeds: [landEmbed] });
    },

    async autocomplete(_client, interaction) {
        const focusedValue = interaction.options.getFocused();
        const { data: lands } = await fetcher.GET("/land");

        const filtered = Array.from(lands)
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

export default Land;
