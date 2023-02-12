import { Colors, EmbedBuilder, Events, inlineCode, Interaction, TextChannel } from "discord.js";
import keyv from "../db/keyv";
import config from "../config";
import { Event } from "../types/event";
import { FormInputAnswer, FormResponse } from "../types/form";

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
                    name: interaction.user.tag,
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

            const formResponses = (await keyv.get(interaction.user.id)) || [];
            formResponses.push(response);
            await keyv.set(interaction.user.id, formResponses);

            const logChannel = client.channels.cache.get(config.logChannelID) as TextChannel;

            logChannel.send({ embeds: [notifyEmbed] });

            await interaction.reply({
                content:
                    "Votre réponse au formulaire a été transmise à l'équipe, vous aurez une réponse prochainement !",
                ephemeral: true,
            });
        }
    },
};

export default InteractionCreate;
