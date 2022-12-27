import { Client, Collection } from "discord.js";
import { Command } from "./command";

export class ExtendedClient extends Client {
    commands: Collection<string, Command> = new Collection();
}
