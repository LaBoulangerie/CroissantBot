import { Events, Interaction } from "discord.js";
import { Event } from "../types/event";
import { ExtendedClient } from "../types/extendedClient";

const InteractionCreate: Event = {
    name: Events.InteractionCreate,
    once: false,
    async run(client: ExtendedClient, interaction: Interaction) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) {
                console.error(
                    `No command matching ${interaction.commandName} was found.`
                );
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
                console.error(
                    `No command matching ${interaction.commandName} was found.`
                );
                return;
            }

            try {
                await command.autocomplete(client, interaction);
            } catch (error) {
                console.error(error);
            }
        }
    },
};

export default InteractionCreate;
