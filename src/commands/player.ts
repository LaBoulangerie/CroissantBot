import {
    bold,
    Colors,
    EmbedBuilder,
    hyperlink,
    inlineCode,
    SlashCommandBuilder,
    time,
} from "discord.js";
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

    async run(_client, interaction) {
        await interaction.deferReply();

        const identifier = interaction.options.getString("identifier");

        const { data: player, error } = await fetcher.GET("/player/{identifier}", {
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

        const playerEmbed = new EmbedBuilder()
            .setColor(config.color)
            .setTitle(
                (player.resident.isKing ? "👑" : player.resident.isMayor ? "🎖️" : "👤") +
                    inlineCode(`[${player.mmo.palier}]`) +
                    " " +
                    player.resident.roleName +
                    " " +
                    player.name +
                    " • " +
                    (player.isOnline ? "✅ En ligne" : "🔴 Hors ligne")
            )
            .setThumbnail(`https://visage.surgeplay.com/bust/${player.uuid.replace("-", "")}.png`);

        if (player.resident.land) {
            playerEmbed.addFields({
                name: "🏡 Ville",
                value: player.resident.land.name,
                inline: true,
            });
        }

        if (player.resident.nation) {
            playerEmbed.addFields({
                name: "🚩 Nation",
                value: player.resident.nation.name,
                inline: true,
            });
        }

        const talentEmojis = {
            farmer: "🌾",
            hunter: "🗡️",
            lumberjack: "🪓",
            miner: "⛏️",
        };

        player.mmo.talents.forEach((talent) => {
            const progress = (talent.xp - talent.minLevelXp) / talent.xpToNextLevel;
            const progressBarSize = 20;
            const progressBar =
                "[" +
                "=".repeat(Math.round(progress * progressBarSize)) +
                "-".repeat(progressBarSize - Math.round(progress * progressBarSize)) +
                "]";

            const maxLvl = 100;

            let fieldValue: string;

            if (talent.level == maxLvl) {
                fieldValue = bold(`✨ NIVEAU ${talent.level} ✨`);
            } else {
                fieldValue = inlineCode(
                    Math.round(progress * 100) +
                        "% " +
                        progressBar +
                        `(${(talent.xp - talent.minLevelXp).toFixed(
                            2
                        )}/${talent.xpToNextLevel.toFixed(2)})xp`
                );
            }

            playerEmbed.addFields({
                name: [
                    talentEmojis[talent.name] ? talentEmojis[talent.name] : "",
                    talent.name[0].toUpperCase() + talent.name.slice(1),
                    "lvl",
                    inlineCode(talent.level.toString()),
                ].join(" "),
                value: fieldValue,
            });
        });

        playerEmbed.addFields(
            {
                name: "⏳ Dernière connexion",
                value: time(Math.round(player.lastSeen / 1000)),
                inline: true,
            },
            {
                name: "⏳ Première connexion",
                value: time(Math.round(player.firstPlayed / 1000)),
                inline: true,
            },
            {
                name: config.wikiEmoji + " Page wiki",
                value: hyperlink(player.name, config.wikiBaseURL + "wiki/" + player.name),
                inline: true,
            }
        );

        return await interaction.editReply({ embeds: [playerEmbed] });
    },
    async autocomplete(_client, interaction) {
        const focusedValue = interaction.options.getFocused();
        const { data: players } = await fetcher.GET("/player");

        const filtered = Array.from(players)
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

export default Player;
