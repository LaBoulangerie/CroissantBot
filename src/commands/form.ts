import {
    ActionRowBuilder,
    inlineCode,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    SlashCommandBuilder,
    TextInputBuilder,
} from "discord.js";
import { Command } from "../types/command";

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

        const formModal = new ModalBuilder().setCustomId(form.id).setTitle(form.title);

        for (const input of form.inputs) {
            const textInput = new TextInputBuilder()
                .setCustomId(input.id)
                .setLabel(input.label)
                .setStyle(input.style)
                .setRequired(input.required);

            if (input.placeholder) textInput.setPlaceholder(input.placeholder);
            if (input.minLength) textInput.setMinLength(input.minLength);
            if (input.maxLength) textInput.setMaxLength(input.maxLength);
            if (input.value) textInput.setValue(input.value);

            const actionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
                textInput
            );
            formModal.addComponents(actionRow);
        }

        await interaction.showModal(formModal);
    },

    async autocomplete(client, interaction) {
        const focusedValue = interaction.options.getFocused();
        const choices = client.forms.keys();
        const filtered = Array.from(choices)
            .filter((choice) => choice.startsWith(focusedValue.toLowerCase()))
            .slice(0, 25); // Discord limit

        await interaction.respond(
            filtered.map((choice: string) => ({ name: choice, value: choice }))
        );
    },
};

export default Form;
