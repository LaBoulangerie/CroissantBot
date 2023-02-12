import { REST, Routes } from "discord.js";
import * as fs from "fs";
import config from "./config";
const commands = [];
const mode = process.argv[2];
const modes = ["global", "guild", "reset"];
const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(config.fileExtension));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`).default.data;
    commands.push(command);
}

const rest = new REST({ version: "10" }).setToken(config.discordToken);

(async () => {
    try {
        if (!modes.includes(mode)) {
            console.log(`Mode not found, try ${modes.join(", ")}`);
            return;
        }

        console.log(`Started refreshing ${commands.length} application commands.`);

        let data: Array<any>;
        switch (mode) {
            case "global":
                data = (await rest.put(Routes.applicationCommands(config.clientID), {
                    body: commands,
                })) as Array<any>;
                break;

            case "guild":
                data = (await rest.put(
                    Routes.applicationGuildCommands(config.clientID, config.guildID),
                    { body: commands }
                )) as Array<any>;
                break;

            case "reset":
                await rest.put(Routes.applicationCommands(config.clientID), { body: [] });
                await rest.put(Routes.applicationGuildCommands(config.clientID, config.guildID), {
                    body: [],
                });
                console.log("Successfully reset application commands!");
                return;
        }

        console.log(`Successfully reloaded ${data.length} ${mode} application commands.`);
    } catch (error) {
        console.error(error);
    }
})();
