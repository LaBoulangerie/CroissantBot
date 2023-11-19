import {
    ActionRowBuilder,
    Colors,
    EmbedBuilder,
    ModalActionRowComponentBuilder,
    ModalBuilder,
    ModalSubmitInteraction,
    TextChannel,
    TextInputBuilder,
    inlineCode,
} from "discord.js";
import { Form, FormInputAnswer, FormResponse } from "../types/form";
import { google } from "googleapis";
import path from "path";
import { ExtendedClient } from "../types/extendedClient";
import { sheets } from "..";
import keyv from "../db/keyv";
import config from "../config";

export const formToModal = (form: Form) => {
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

    return formModal;
};

export const submitModerationForm = async (
    client: ExtendedClient,
    interaction: ModalSubmitInteraction,
    form: Form
) => {
    const response: FormResponse = {
        form,
        timestamp: new Date(),
        answers: [],
    };

    const notifyEmbed = new EmbedBuilder()
        .setTitle(`Réponse au formulaire ${inlineCode(form.id)}`)
        .setColor(Colors.DarkPurple)
        .setAuthor({
            name: interaction.user.username,
            iconURL: interaction.user.avatarURL(),
        });

    for (const input of form.inputs) {
        const inputResponse = interaction.fields.getTextInputValue(input.id);
        const answer: FormInputAnswer = {
            id: input.id,
            answer: inputResponse,
        };
        response.answers.push(answer);
        notifyEmbed.addFields({ name: input.label, value: inputResponse });
    }
    // Append data to google sheet
    const auth = new google.auth.GoogleAuth({
        keyFile: path.join(__dirname, "../../google_keys.json"),
        scopes: [
            "https://www.googleapis.com/auth/drive",
            "https://www.googleapis.com/auth/spreadsheets",
        ],
    });

    google.options({ auth });

    await sheets.spreadsheets.values.append({
        spreadsheetId: form.googleId,
        valueInputOption: "USER_ENTERED",
        range: "A2:Z",
        requestBody: {
            values: [response.answers.map((a) => a.answer)],
        },
    });

    // Store response in Redis
    const formResponses = (await keyv.get(interaction.user.id)) || [];
    formResponses.push(response);
    await keyv.set(interaction.user.id, formResponses);

    const modChannel = client.channels.cache.get(config.modChannelID) as TextChannel;

    modChannel.send({ embeds: [notifyEmbed] });

    await interaction.reply({
        content:
            "Votre réponse au formulaire a été transmise à l'équipe, vous aurez une réponse prochainement !",
        ephemeral: true,
    });
};
