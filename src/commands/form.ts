import { inlineCode, SlashCommandBuilder } from "discord.js";
import { Command } from "../types/command";
import { formToModal } from "../common/modal";

const Form: Command = {
    data: new SlashCommandBuilder()
        .setName("form")
        .setDescription("Formulaire")
        .addStringOption((option) =>
            option
                .setName("name")
                .setDescription("Nom du formulaire auquel vous voulez avoir accès")
                .setRequired(true)
                .setAutocomplete(true)
        )
        .toJSON(),
    async run(client, interaction) {
        const formName = interaction.options.getString("name", true);

        const availableFormNames = Array.from(client.forms.keys());

        if (!availableFormNames.includes(formName)) {
            await interaction.reply({
                content: `😬 Je trouve pas ce formulaire, voici ceux disponibles: ${availableFormNames
                    .map((n) => inlineCode(n))
                    .join(", ")}`,
                ephemeral: true,
            });
        }

        const form = client.forms.get(formName);
        const modal = formToModal(form);
        await interaction.showModal(modal);
    },

    async autocomplete(client, interaction) {
        const focusedValue = interaction.options.getFocused();
        const choices = client.forms.filter((f) => f.visible).keys();
        const filtered = Array.from(choices)
            .filter((choice) => choice.startsWith(focusedValue.toLowerCase()))
            .slice(0, 25); // Discord limit

        await interaction.respond(
            filtered.map((choice: string) => ({ name: choice, value: choice }))
        );
    },
};

export default Form;
