import { Colors, EmbedBuilder, Events, inlineCode, Interaction, TextChannel } from "discord.js";
import keyv from "../db/keyv";
import config from "../config";
import { Event } from "../types/event";
import { FormInputAnswer, FormResponse } from "../types/form";
import { sheets } from "..";
import { google } from "googleapis";
import path from "path";

const InteractionCreate: Event = {
    name: Events.InteractionCreate,
    once: false,
    async run(client, interaction: Interaction) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                command.run(client, interaction);
            } catch (error) {
                console.error(`Error executing ${interaction.commandName}`);
                console.error(error);
            }
        } else if (interaction.isAutocomplete()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.autocomplete(client, interaction);
            } catch (error) {
                console.error(error);
            }
        } else if (interaction.isModalSubmit()) {
            const form = client.forms.get(interaction.customId);

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
        }
    },
};

export default InteractionCreate;
