import {
    ChatInputCommandInteraction,
    AutocompleteInteraction,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";
import { ExtendedClient } from "./extendedClient";

export interface Command {
    data: RESTPostAPIChatInputApplicationCommandsJSONBody;
    run: (
        client: ExtendedClient,
        interaction: ChatInputCommandInteraction
    ) => void;
    autocomplete?: (
        client: ExtendedClient,
        interaction: AutocompleteInteraction
    ) => Promise<void>;
}
