import { Client, Events } from "discord.js";
import { Event } from "../types/event";

const Ready: Event = {
    name: Events.ClientReady,
    once: true,
    run(client: Client) {
        console.log(`Ready! Logged in as ${client?.user?.tag}.`);
    },
};

export default Ready;
