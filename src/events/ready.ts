import { Events } from "discord.js";
import { Event } from "../types/event";
import { ExtendedClient } from "../types/extendedClient";

const Ready: Event = {
    name: Events.ClientReady,
    once: true,
    run(client: ExtendedClient) {
        console.log(`Ready! Logged in as ${client?.user?.tag}.`);
    },
};

export default Ready;
