import { Command } from "../types/command";
import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    EmbedBuilder,
    inlineCode,
    SlashCommandBuilder,
} from "discord.js";
import config from "../config";

const Help: Command = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Fournit de l'aide pour toutes mes commandes !")
        .addStringOption((option) =>
            option
                .setName("command")
                .setDescription("Obtenir de l'aide sur cette commande")
                .setAutocomplete(true)
        )
        .toJSON(),

    async run(client, interaction: ChatInputCommandInteraction) {
        const commands = client.commands;
        const optionalCommand = interaction.options.getString("command");

        if (Array.from(client.commands.keys()).includes(optionalCommand)) {
            const command = commands.get(optionalCommand).data;

            const helpEmbed = new EmbedBuilder()
                .setColor(config.color)
                .setTitle(`❓ Aide pour /${command.name}`)
                .addFields({
                    name: "📃 Description",
                    value: command.description,
                });

            if (command.options.length) {
                helpEmbed.addFields({
                    name: "🧮 Options",
                    value: command.options
                        .map(
                            (option) =>
                                "• " +
                                inlineCode(
                                    option.required
                                        ? `<${option.name}>`
                                        : `[${option.name}]`
                                ) +
                                ": " +
                                option.description
                        )
                        .join("\n"),
                });
            }

            return await interaction.reply({ embeds: [helpEmbed] });
        }

        const guildHelpEmbed = new EmbedBuilder()
            .setColor(config.color)
            .setTitle("📜 Liste des commandes")
            .setDescription(
                Array.from(commands.keys())
                    .map((command) => "• " + inlineCode(command))
                    .join("\n")
            )
            .addFields({
                name: "💡 Tip",
                value: "Vous pouvez obtenir des informations sur une commande spécifique en tapant `/help [commande]` !",
            });
        return await interaction.reply({
            embeds: [guildHelpEmbed],
        });
    },

    async autocomplete(client, interaction) {
        const focusedValue = interaction.options.getFocused();
        const choices = interaction.client.commands.keys();
        const filtered = Array.from(choices)
            .filter((choice) => choice.startsWith(focusedValue.toLowerCase()))
            .slice(0, 25); // Discord limit

        await interaction.respond(
            filtered.map((choice: string) => ({ name: choice, value: choice }))
        );
    },
};

export default Help;
