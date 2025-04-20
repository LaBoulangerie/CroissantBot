import {
    Colors,
    EmbedBuilder,
    PermissionFlagsBits,
    SlashCommandBuilder,
    inlineCode,
} from "discord.js";
import { Command } from "../types/command";
import fetcher from "../fetcher";
import { isUuid } from "../common/uuid";
import { usernameFromUuid, uuidFromUsername } from "../common/mojang";

const Donors: Command = {
    data: new SlashCommandBuilder()
        .setName("donor")
        .setDescription("Add or delete donors from the database")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("add")
                .setDescription("Add a donor")
                .addStringOption((option) =>
                    option
                        .setName("identifier")
                        .setDescription("Pseudo ou UUID Minecraft")
                        .setAutocomplete(true)
                        .setRequired(true)
                )
                .addIntegerOption((option) =>
                    option.setName("amount").setDescription("Montant du don").setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("delete")
                .setDescription("Delete a donor")
                .addStringOption((option) =>
                    option
                        .setName("identifier")
                        .setDescription("Pseudo ou UUID Minecraft")
                        .setAutocomplete(true)
                        .setRequired(true)
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .toJSON(),

    async run(_client, interaction) {
        if (interaction.channel.isDMBased()) return;
        await interaction.deferReply();

        const action = interaction.options.getSubcommand();
        const identifier = interaction.options.getString("identifier");
        const amount = interaction.options.getInteger("amount");

        const body = {
            id: isUuid(identifier) ? identifier : await uuidFromUsername(identifier),
            name: isUuid(identifier) ? await usernameFromUuid(identifier) : identifier,
            type: amount.toString(),
        };

        const answerEmbed = new EmbedBuilder();

        switch (action) {
            case "add":
                await fetcher.POST("/donors", { body });

                answerEmbed.setTitle(`🥨 Ajout de ${inlineCode(body.name)} dans les donateurs`);
                answerEmbed.setColor(Colors.Green);
                break;
            case "delete":
                await fetcher.DELETE("/donors", { body });

                answerEmbed.setTitle(
                    `🥞 Suppression de ${inlineCode(body.name)} dans les donateurs`
                );
                answerEmbed.setColor(Colors.Red);
                break;
            default:
                return;
        }
        return await interaction.editReply({ embeds: [answerEmbed] });
    },

    async autocomplete(_client, interaction) {
        const focusedValue = interaction.options.getFocused();
        const { data: donors } = await fetcher.GET("/donors");

        const filtered = Array.from(donors)
            .filter((choice) => choice["name"].toLowerCase().startsWith(focusedValue.toLowerCase()))
            .slice(0, 25); // Discord limit
        await interaction.respond(
            filtered.map((choice) => ({
                name: choice["name"],
                value: choice["name"],
            }))
        );
    },
};

export default Donors;
