import { Colors, EmbedBuilder, hyperlink, inlineCode, SlashCommandBuilder, time } from "discord.js";
import { ApiResponse } from "@qdrant/openapi-typescript-fetch";
import config from "../config";
import fetcher from "../fetcher";
import { Command } from "../types/command";

const Town: Command = {
    data: new SlashCommandBuilder()
        .setName("town")
        .setDescription("Donne des infos sur une ville")
        .addStringOption((option) =>
            option
                .setName("identifier")
                .setDescription("Nom ou UUID de la ville")
                .setRequired(true)
                .setAutocomplete(true)
        )
        .toJSON(),

    async run(client, interaction) {
        await interaction.deferReply();

        const identifier = interaction.options.getString("identifier");
        const getTown = fetcher.path("/town/{identifier}").method("get").create();
        let town: ApiResponse;

        try {
            town = await getTown({ identifier });
        } catch (e) {
            if (e instanceof getTown.Error) {
                const error = e.getActualType();
                if (error.status == 404) {
                    const errorEmbed = new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setTitle(`❌ Erreur ${error.status}`)
                        .setDescription(`Ville ${identifier} non trouvée`);

                    return await interaction.editReply({
                        embeds: [errorEmbed],
                    });
                }
            }
        }

        const townEmbed = new EmbedBuilder()
            .setColor(config.color)
            .setTitle(
                "🏡 " + town.data.formattedName + (town.data.tag ? ` [${town.data.tag}]` : "")
            );

        if (town.data.nation)
            townEmbed.addFields({
                name: "🚩 Nation",
                value: town.data.nation.name,
                inline: true,
            });

        townEmbed.addFields(
            {
                name: "👨‍💼 Maire",
                value: inlineCode(town.data.mayor.name),
                inline: true,
            },
            {
                name: `👥 ${town.data.residents.length} résidents`,
                value: town.data.residents.map((res) => inlineCode(res.name)).join(", "),
                inline: true,
            },
            {
                name: "💰 Banque",
                value: inlineCode(town.data.balance) + "฿",
                inline: true,
            },
            {
                name: "📍 Spawn",
                value:
                    "XYZ: " +
                    inlineCode(
                        `${town.data.spawn.x.toFixed(2)} ${town.data.spawn.y.toFixed(
                            2
                        )} ${town.data.spawn.z.toFixed(2)}`
                    ),
                inline: true,
            },
            {
                name: "🌐 Nombre de parcelles",
                value: inlineCode(town.data.townBlocks.length.toString()),
            },
            {
                name: "📜 Town board",
                value: town.data.board ? town.data.board : "Aucun",
                inline: true,
            },
            {
                name: "⏳ Date de création",
                value: time(Math.round(town.data.registered / 1000)),
                inline: true,
            },
            {
                name: config.wikiEmoji + " Page wiki",
                value: hyperlink(town.data.name, config.wikiBaseURL + "wiki/" + town.data.name),
                inline: true,
            }
        );

        return await interaction.editReply({ embeds: [townEmbed] });
    },

    async autocomplete(client, interaction) {
        const focusedValue = interaction.options.getFocused();
        const towns = await fetcher.path("/town").method("get").create()({});

        const filtered = Array.from(towns.data)
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

export default Town;
