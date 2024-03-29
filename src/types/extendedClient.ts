import { Client, Collection, VoiceChannel } from "discord.js";
import { Command } from "./command";
import { Form } from "./form";
import { sheets_v4 } from "googleapis";

export class ExtendedClient extends Client {
    commands: Collection<string, Command> = new Collection();
    forms: Collection<string, Form> = new Collection();
    voiceChannels: Collection<string, string> = new Collection();
    googleSheets: sheets_v4.Sheets;
}
