import { Colors, EmbedBuilder, SlashCommandBuilder, inlineCode } from "discord.js";
import { Command } from "../types/command";
import fetcher from "../fetcher";
import { isUuid } from "../common/uuid";
import { ApiResponse } from "openapi-typescript-fetch";
import { usernameFromUuid, uuidFromUsername } from "../common/mojang";

const Donors: Command = {
    data: new SlashCommandBuilder()
        .setName("donor")
        .setDescription("Add or delete donors from the database")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("add")
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
                .addStringOption((option) =>
                    option
                        .setName("identifier")
                        .setDescription("Pseudo ou UUID Minecraft")
                        .setAutocomplete(true)
                        .setRequired(true)
                )
        )
        .toJSON(),

    async run(client, interaction) {
        await interaction.deferReply();

        const action = interaction.options.getSubcommand();
        const identifier = interaction.options.getString("identifier");
        const role = interaction.options.getInteger("amount");

        const body = isUuid(identifier) ? { uuid: identifier } : { name: identifier };
        body["type"] = role.toString();

        if (!body["uuid"]) body["uuid"] = await uuidFromUsername(body["name"]);
        else if (!body["name"]) body["name"] = await usernameFromUuid(body["uuid"]);

        const answerEmbed = new EmbedBuilder();
        let response: ApiResponse;

        switch (action) {
            case "add":
                const addDonor = fetcher.path("/donors").method("post").create();
                response = await addDonor({ ...body });
                answerEmbed.setTitle(`🥨 Ajout de ${inlineCode(identifier)} dans les donateurs`);
                answerEmbed.setColor(Colors.Green);
                break;
            case "delete":
                const deleteDonor = fetcher.path("/donors").method("delete").create();
                answerEmbed.setTitle(
                    `🥞 Suppression de ${inlineCode(identifier)} dans les donateurs`
                );
                answerEmbed.setColor(Colors.Red);
                response = await deleteDonor({ ...body });
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
        const donors = await fetcher.path("/donors").method("get").create()({});

        const filtered = Array.from(donors.data)
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

export default Donors;
