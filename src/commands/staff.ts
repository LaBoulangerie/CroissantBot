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

const Staff: Command = {
    data: new SlashCommandBuilder()
        .setName("staff")
        .setDescription("Add or delete staff members from the database")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("add")
                .setDescription("Add a staff")
                .addStringOption((option) =>
                    option
                        .setName("identifier")
                        .setDescription("Pseudo ou UUID Minecraft")
                        .setAutocomplete(true)
                        .setRequired(true)
                )
                .addStringOption((option) =>
                    option
                        .setName("role")
                        .setDescription("Role dans le staff")
                        .addChoices(
                            ...["owner", "mod", "multi", "cm", "dev", "contributor"].map((r) => ({
                                name: r,
                                value: r,
                            }))
                        )
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("delete")
                .setDescription("Delete a staff")
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
        const role = interaction.options.getString("role");

        const body = {
            id: isUuid(identifier) ? identifier : await uuidFromUsername(identifier),
            name: isUuid(identifier) ? await usernameFromUuid(identifier) : identifier,
            type: role,
        };

        const answerEmbed = new EmbedBuilder();

        switch (action) {
            case "add":
                await fetcher.POST("/staff", { body });

                answerEmbed.setTitle(`🥨 Ajout de ${inlineCode(body.name)} dans le staff`);
                answerEmbed.setColor(Colors.Green);
                break;
            case "delete":
                await fetcher.DELETE("/staff", { body });

                answerEmbed.setTitle(`🥞 Suppression de ${inlineCode(body.name)} dans le staff`);
                answerEmbed.setColor(Colors.Red);
                break;
            default:
                return;
        }

        return await interaction.editReply({ embeds: [answerEmbed] });
    },

    async autocomplete(_client, interaction) {
        const focusedValue = interaction.options.getFocused();
        const { data: staff } = await fetcher.GET("/staff");

        const filtered = Array.from(staff)
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

export default Staff;
