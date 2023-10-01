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
import { ApiResponse } from "openapi-typescript-fetch";
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

    async run(client, interaction) {
        await interaction.deferReply();

        const action = interaction.options.getSubcommand();
        const identifier = interaction.options.getString("identifier");
        const role = interaction.options.getString("role");

        const body = isUuid(identifier) ? { uuid: identifier } : { name: identifier };
        body["type"] = role;

        if (!body["uuid"]) body["uuid"] = await uuidFromUsername(body["name"]);
        else if (!body["name"]) body["name"] = await usernameFromUuid(body["uuid"]);

        const answerEmbed = new EmbedBuilder();
        let response: ApiResponse;

        switch (action) {
            case "add":
                const addStaff = fetcher.path("/staff").method("post").create();
                response = await addStaff({ ...body });
                answerEmbed.setTitle(`🥨 Ajout de ${inlineCode(identifier)} dans le staff`);
                answerEmbed.setColor(Colors.Green);
                break;
            case "delete":
                const deleteStaff = fetcher.path("/staff").method("delete").create();
                answerEmbed.setTitle(`🥞 Suppression de ${inlineCode(identifier)} dans le staff`);
                answerEmbed.setColor(Colors.Red);
                response = await deleteStaff({ ...body });
                break;
            default:
                return;
        }

        answerEmbed.addFields({
            name: "Status code",
            value: inlineCode(response.status.toString()),
            inline: true,
        });

        return await interaction.reply({ embeds: [answerEmbed] });
    },

    async autocomplete(client, interaction) {
        const focusedValue = interaction.options.getFocused();
        const staff = await fetcher.path("/staff").method("get").create()({});

        const filtered = Array.from(staff.data)
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

export default Staff;
