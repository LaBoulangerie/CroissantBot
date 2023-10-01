import { EmbedBuilder, hyperlink, time } from "@discordjs/builders";
import { Colors, inlineCode, SlashCommandBuilder } from "discord.js";
import { ApiResponse } from "@qdrant/openapi-typescript-fetch";
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
    async run(client, interaction) {
        await interaction.deferReply();

        const identifier = interaction.options.getString("identifier", true);
        const getNation = fetcher.path("/nation/{identifier}").method("get").create();
        let nation: ApiResponse;

        try {
            nation = await getNation({ identifier });
        } catch (e) {
            if (e instanceof getNation.Error) {
                const error = e.getActualType();
                if (error.status == 404) {
                    const errorEmbed = new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setTitle(`❌ Erreur ${error.status}`)
                        .setDescription(`Nation ${identifier} non trouvée`);

                    return await interaction.editReply({
                        embeds: [errorEmbed],
                    });
                }
            }
        }
        const nationEmbed = new EmbedBuilder()
            .setColor(parseInt(nation.data.mapColor, 16))
            .setTitle(
                "🚩 " + nation.data.formattedName + (nation.data.tag ? ` [${nation.data.tag}]` : "")
            );

        if (nation.data.spawn) {
            nationEmbed.addFields({
                name: "📍 Spawn",
                value:
                    "XYZ: " +
                    inlineCode(
                        `${nation.data.spawn.x} ${nation.data.spawn.y} ${nation.data.spawn.z}`
                    ),
                inline: true,
            });
        }

        if (nation.data.allies.length) {
            nationEmbed.addFields({
                name: "🤝 Alliés",
                value: nation.data.allies.map((x) => inlineCode(x.name)).join(", "),
            });
        }

        if (nation.data.enemies.length) {
            nationEmbed.addFields({
                name: "⚔️ Enemis",
                value: nation.data.enemies.map((x) => inlineCode(x.name)).join(", "),
            });
        }

        nationEmbed.addFields(
            {
                name: "👑 Capitale",
                value: nation.data.capital.name,
                inline: true,
            },
            {
                name: `🏘️ ${nation.data.towns.length} villes`,
                value: nation.data.towns.map((town) => inlineCode(town.name)).join(", "),
                inline: true,
            },
            {
                name: "💰 Banque",
                value: inlineCode(nation.data.balance) + "฿",
                inline: true,
            },
            {
                name: "📜 Nation board",
                value: nation.data.board,
                inline: true,
            },
            {
                name: "⏳ Date de création",
                value: time(Math.round(nation.data.registered / 1000)),
                inline: true,
            },
            {
                name: config.wikiEmoji + " Page wiki",
                value: hyperlink(nation.data.name, config.wikiBaseURL + "wiki/" + nation.data.name),
                inline: true,
            }
        );

        return await interaction.editReply({ embeds: [nationEmbed] });
    },
    async autocomplete(client, interaction) {
        const focusedValue = interaction.options.getFocused();
        const nations = await fetcher.path("/nation").method("get").create()({});

        const filtered = Array.from(nations.data)
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
