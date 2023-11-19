import {
    AutocompleteInteraction,
    CategoryChannel,
    ChannelType,
    ChatInputCommandInteraction,
    Events,
    Interaction,
    ModalSubmitInteraction,
} from "discord.js";
import { Event } from "../types/event";
import { ExtendedClient } from "../types/extendedClient";
import { submitModerationForm } from "../common/modal";
import config from "../config";

const InteractionCreate: Event = {
    name: Events.InteractionCreate,
    once: false,
    async run(client, interaction: Interaction) {
        interaction.isChatInputCommand() && handleCommand(client, interaction);
        interaction.isAutocomplete() && handleAutocomplete(client, interaction);
        interaction.isModalSubmit() && handleModalSubmit(client, interaction);
    },
};

const handleCommand = async (client: ExtendedClient, interaction: ChatInputCommandInteraction) => {
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
};

const handleAutocomplete = async (client: ExtendedClient, interaction: AutocompleteInteraction) => {
    const command = client.commands.get(interaction.commandName);

    if (!command) {
        return console.error(`No command matching ${interaction.commandName} was found.`);
    }

    try {
        await command.autocomplete(client, interaction);
    } catch (error) {
        console.error(error);
    }
};

const handleModalSubmit = async (client: ExtendedClient, interaction: ModalSubmitInteraction) => {
    const form = client.forms.get(interaction.customId);

    if (form.isModeration) return await submitModerationForm(client, interaction, form);

    switch (interaction.customId) {
        case "voice-channel":
            const name = interaction.fields.getTextInputValue("name");
            const isRp = interaction.fields.getTextInputValue("isrp");
            const limit = interaction.fields.getTextInputValue("limit");

            let isReallyRp = false;
            if (isRp == "oui") isReallyRp = true;

            let actualLimit: number = null;
            if (Number.isFinite(+limit)) actualLimit = parseInt(limit);

            const actualName = isRp ? "📜" : "🗣️" + name;

            const voiceChannel = await interaction.guild.channels.create({
                name: actualName,
                type: ChannelType.GuildVoice,
                parent: interaction.guild.channels.cache.get(
                    config.voiceCategoryID
                ) as CategoryChannel,
                userLimit: actualLimit,
            });

            client.voiceChannelIds.push(voiceChannel.id);
            break;

        default:
            break;
    }
};

export default InteractionCreate;
