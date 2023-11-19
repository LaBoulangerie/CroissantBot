import { GatewayIntentBits } from "discord.js";
import * as fs from "fs";
import * as path from "path";
import config from "./config";
import { Command } from "./types/command";
import { ExtendedClient } from "./types/extendedClient";
import { Form } from "./types/form";
import { google } from "googleapis";

const client = new ExtendedClient({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

const sheets = google.sheets("v4");
client.googleSheets = sheets;

const forEachFilesIn = (dirPath: string, lambda: (f: string) => void) => {
    const joinedPath = path.join(__dirname, dirPath);
    const files = fs.readdirSync(joinedPath).filter((file) => file.endsWith(config.fileExtension));
    for (const file of files) {
        const filePath = path.join(joinedPath, file);
        lambda(filePath);
    }
};

forEachFilesIn("commands", (f) => {
    const command: Command = require(f).default;
    client.commands.set(command.data.name, command);
    console.log(`Registered command ${command.data.name}`);
});

forEachFilesIn("events", (f) => {
    const event = require(f).default;
    event.once
        ? client.once(event.name, (...args) => event.run(client, ...args))
        : client.on(event.name, (...args) => event.run(client, ...args));
    console.log(`Registered event ${event.name}`);
});

forEachFilesIn("forms", (f) => {
    const form: Form = require(f).default;
    client.forms.set(form.id, form);
    console.log(`Registered form ${form.id}`);
});

client.login(config.discordToken);
