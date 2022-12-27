import { Collection, GatewayIntentBits } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import config from "./config";
import { Command } from "./types/command";
import { ExtendedClient } from "./types/extendedClient";

const client = new ExtendedClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command: Command = require(filePath).default;
    client.commands.set(command.data.name, command);
    console.log(`Registered command ${command.data.name}`);
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".ts"));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath).default;
    event.once
        ? client.once(event.name, (...args) => event.run(client, ...args))
        : client.on(event.name, (...args) => event.run(client, ...args));
    console.log(`Registered event ${event.name}`);
}

client.login(config.discordToken);
