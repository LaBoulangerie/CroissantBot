import { Client, Collection } from "discord.js";
import { Command } from "./command";
import { Form } from "./form";

export class ExtendedClient extends Client {
    commands: Collection<string, Command> = new Collection();
    forms: Collection<string, Form> = new Collection();
}
