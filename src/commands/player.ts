import {
    AutocompleteInteraction,
    Colors,
    EmbedBuilder,
    hyperlink,
    inlineCode,
    SlashCommandBuilder,
    time,
} from "discord.js";
import { ApiResponse } from "openapi-typescript-fetch";
import config from "../config";
import fetcher from "../fetcher";
import { Command } from "../types/command";

const Player: Command = {
    data: new SlashCommandBuilder()
        .setName("player")
        .setDescription("Donne des infos sur un joueur")
        .addStringOption((option) =>
            option
                .setName("identifier")
                .setDescription("Nom ou UUID du joueur")
                .setRequired(true)
                .setAutocomplete(true)
        )
        .toJSON(),

    async run(client, interaction) {
        await interaction.deferReply();

        const identifier = interaction.options.getString("identifier");

        const getPlayer = fetcher
            .path("/player/{identifier}")
            .method("get")
            .create();

        let player: ApiResponse;

        try {
            player = await getPlayer({ identifier });
        } catch (e) {
            if (e instanceof getPlayer.Error) {
                const error = e.getActualType();

                if (error.status == 404) {
                    const errorEmbed = new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setTitle(`❌ Erreur ${error.status}`)
                        .setDescription(`Joueur ${identifier} non trouvé`);

                    return await interaction.editReply({
                        embeds: [errorEmbed],
                    });
                }
            }
        }

        const playerEmbed = new EmbedBuilder()
            .setColor(config.color)
            .setTitle(
                (player.data.resident.isKing
                    ? "👑"
                    : player.data.resident.isMayor
                    ? "🎖️"
                    : "👤") +
                    inlineCode(`[${player.data.mmo.palier}] `) +
                    player.data.resident.formattedName +
                    " • " +
                    (player.data.isOnline ? "✅ En ligne" : "🔴 Hors ligne")
            )
            .setThumbnail(
                `https://visage.surgeplay.com/bust/${player.data.uuid.replace(
                    "-",
                    ""
                )}.png`
            );

        if (player.data.resident.town) {
            playerEmbed.addFields({
                name: "🏡 Ville",
                value: player.data.resident.town.name,
                inline: true,
            });
        }

        if (player.data.resident.townRanks.length) {
            playerEmbed.addFields({
                name: "🏡 Rangs de ville",
                value: player.data.resident.townRanks
                    .map((x) => inlineCode(x))
                    .join(", "),
                inline: true,
            });
        }

        if (player.data.resident.nationRanks.length) {
            playerEmbed.addFields({
                name: "🚩 Rangs de nation",
                value: player.data.resident.nationRanks
                    .map((x) => inlineCode(x))
                    .join(", "),
                inline: true,
            });
        }

        if (player.data.resident.friends.length) {
            playerEmbed.addFields({
                name: "🙌 Amis",
                value: player.data.resident.friends
                    .map((x) => inlineCode(x.name))
                    .join(", "),
                inline: true,
            });
        }

        const talentEmojis = {
            farmer: "🌾",
            hunter: "🗡️",
            lumberjack: "🪓",
            miner: "⛏️",
        };

        player.data.mmo.talents.forEach((talent) => {
            const progress =
                (talent.xp - talent.minLevelXp) /
                (talent.xp + talent.xpToNextLevel - talent.minLevelXp);
            const progressBarSize = 20;
            const progressBar =
                "[" +
                "=".repeat(Math.round(progress * progressBarSize)) +
                "-".repeat(
                    progressBarSize - Math.round(progress * progressBarSize)
                ) +
                "]";

            playerEmbed.addFields({
                name: [
                    talentEmojis[talent.name] ? talentEmojis[talent.name] : "",
                    talent.name[0].toUpperCase() + talent.name.slice(1),
                    "lvl",
                    inlineCode(talent.level.toString()),
                ].join(" "),
                value: inlineCode(
                    Math.round(progress * 100) +
                        "% " +
                        progressBar +
                        `(${talent.xp.toFixed(2)}/${(
                            talent.xpToNextLevel + talent.minLevelXp
                        ).toFixed(2)})xp`
                ),
            });
        });

        playerEmbed.addFields(
            {
                name: "⏳ Dernière connexion",
                value: time(Math.round(player.data.lastSeen / 1000)),
                inline: true,
            },
            {
                name: "⏳ Première connexion",
                value: time(Math.round(player.data.firstPlayed / 1000)),
                inline: true,
            },
            {
                name: config.wikiEmoji + " Page wiki",
                value: hyperlink(
                    player.data.name,
                    config.wikiBaseURL + "wiki/" + player.data.name
                ),
                inline: true,
            }
        );

        return await interaction.editReply({ embeds: [playerEmbed] });
    },
    async autocomplete(client, interaction) {
        const focusedValue = interaction.options.getFocused();
        const players = await fetcher.path("/player").method("get").create()(
            {}
        );

        const filtered = Array.from(players.data)
            .filter((choice) =>
                choice.name.toLowerCase().startsWith(focusedValue.toLowerCase())
            )
            .slice(0, 25); // Discord limit
        await interaction.respond(
            filtered.map((choice) => ({
                name: choice.name,
                value: choice.name,
            }))
        );
    },
};

export default Player;
