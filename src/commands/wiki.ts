import config from "../config";
import wiki, { Page } from "wikijs";
import translate from "@wakeful-cloud/html-translator";
import { Command } from "../types/command";
import {
    ChatInputCommandInteraction,
    Colors,
    EmbedBuilder,
    hyperlink,
    SlashCommandBuilder,
    time,
} from "discord.js";
import { DateTime } from "luxon";
const wikiApi = wiki({ apiUrl: config.wikiBaseURL + "api.php" });

const Wiki: Command = {
    data: new SlashCommandBuilder()
        .setName("wiki")
        .setDescription("Fournit des pages du wiki depuis Discord")
        .addSubcommand((subCommand) =>
            subCommand
                .setName("search")
                .setDescription("Chercher une page sur le wiki")
                .addStringOption((option) =>
                    option
                        .setName("page")
                        .setDescription("Nom de la page")
                        .setRequired(true)
                )
        )
        .addSubcommand((subCommand) =>
            subCommand
                .setName("get")
                .setDescription("Donne un aperçu d'une page sur le wiki")
                .addStringOption((option) =>
                    option
                        .setName("page")
                        .setDescription("Nom précis de la page")
                        .setRequired(true)
                )
        )
        .addSubcommand((subCommand) =>
            subCommand
                .setName("random")
                .setDescription(
                    "Renvoie une page aléatoirement choisie du wiki"
                )
        )
        .toJSON(),

    async run(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();

        switch (interaction.options.getSubcommand()) {
            case "search":
                const page = interaction.options.getString("page", true);
                const results = (await wikiApi.search(page, 10)).results;

                if (!results.length) {
                    const noResultEmbed = new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(`Aucun résultat trouvé pour "${page}"`);

                    return await interaction.editReply({
                        embeds: [noResultEmbed],
                    });
                }

                const wikiPages = results.map(
                    (p) =>
                        `• ` +
                        hyperlink(
                            p,
                            config.wikiBaseURL + "wiki/" + encodeURI(p)
                        )
                );

                const searchResultsEmbed = new EmbedBuilder()
                    .setColor(config.color)
                    .setTitle(`🔎 ${results.length} résultats pour "${page}"`)
                    .setDescription(wikiPages.join("\n"));

                return await interaction.editReply({
                    embeds: [searchResultsEmbed],
                });

            case "get":
                const specifiedPage = interaction.options.getString(
                    "page",
                    true
                );
                let resultPage: Page;

                try {
                    resultPage = await wikiApi.page(specifiedPage);
                } catch (error) {
                    const pageNotFoundEmbed = new EmbedBuilder()
                        .setColor(Colors.Red)
                        .setDescription(
                            `Page intitulée "${specifiedPage}" non trouvée. Vérifiez bien l'orthographe du nom de la page.`
                        );

                    return await interaction.editReply({
                        embeds: [pageNotFoundEmbed],
                    });
                }

                const pageEmbed = new EmbedBuilder()
                    .setColor(config.color)
                    .setTitle(`${config.wikiEmoji} ${resultPage.raw.title}`)
                    .setDescription(
                        translate(
                            (await resultPage.html())
                                .replace(/<aside(.)*?>(.|\n)*?<\/aside>/g, "") // Infobox
                                .replace(
                                    /<div id="toc"(.)*?>(.|\n)*?<\/ul>(.|\n)*?<\/div>/g,
                                    ""
                                ) // Sommaire
                                .replace(/<figure(.)*?>(.|\n)*?<\/figure>/g, "") // Images next to text
                        ).markdown.substring(0, 1021) + "..."
                    )

                    .addFields(
                        {
                            name: "📝 Dernier changement",
                            value: time(
                                DateTime.fromISO(
                                    resultPage.raw.touched
                                ).toUnixInteger()
                            ),
                            inline: true,
                        },
                        {
                            name: "🖇️ Lien wiki",
                            value: hyperlink(
                                resultPage.raw.title,
                                resultPage.raw.fullurl
                            ),
                            inline: true,
                        }
                    );

                const pageImages = await resultPage.images();

                if (pageImages[0]) pageEmbed.setThumbnail(pageImages[0]);
                return await interaction.editReply({ embeds: [pageEmbed] });

            case "random":
                const randomPage = (await wikiApi.random())[0];

                const randomPageEmbed = new EmbedBuilder()
                    .setColor(config.color)
                    .setTitle("🎲 Page aléatoire")
                    .setDescription(
                        `[${randomPage}](${
                            config.wikiBaseURL + "wiki/" + encodeURI(randomPage)
                        })`
                    );

                return await interaction.editReply({
                    embeds: [randomPageEmbed],
                });
        }
    },
};

export default Wiki;
