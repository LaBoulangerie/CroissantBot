import { REST, Routes } from "discord.js";
import * as fs from "fs";
import config from "./config";
const commands = [];

const commandFiles = fs
    .readdirSync("./src/commands")
    .filter((file) => file.endsWith(".ts"));

for (const file of commandFiles) {
    const command = require(`./src/commands/${file}`).default.data;
    commands.push(command);
}

const rest = new REST({ version: "10" }).setToken(config.discordToken);

(async () => {
    try {
        console.log(
            `Started refreshing ${commands.length} application (/) commands.`
        );

        const data = (await rest.put(
            Routes.applicationGuildCommands(config.clientID, config.guildID),
            { body: commands }
        )) as Array<any>;

        console.log(
            `Successfully reloaded ${data.length} application (/) commands.`
        );
    } catch (error) {
        console.error(error);
    }
})();
