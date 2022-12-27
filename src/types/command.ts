import {
    ChatInputCommandInteraction,
    AutocompleteInteraction,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";

export interface Command {
    data: RESTPostAPIChatInputApplicationCommandsJSONBody;
    run: (interaction: ChatInputCommandInteraction) => void;
    autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
}
