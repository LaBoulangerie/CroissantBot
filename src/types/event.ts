import { Events } from "discord.js";
import { ExtendedClient } from "./extendedClient";

export interface Event {
    name: Events;
    once: boolean;
    run: (client: ExtendedClient, ...args) => void;
}
