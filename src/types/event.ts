import { Client, Events } from "discord.js";

export interface Event {
    name: Events;
    once: boolean;
    run: (client: Client, ...args) => void;
}
