import { SlashCommandBuilder } from "discord.js";
import { Command } from "../types/command";
import { formToModal } from "../common/modal";

const Vocal: Command = {
    data: new SlashCommandBuilder()
        .setName("vocal")
        .setDescription("Créer un vocal personnalisé")
        .toJSON(),
    async run(client, interaction) {
        const form = client.forms.get("voice-channel");
        const modal = formToModal(form);
        await interaction.showModal(modal);
    },
};

export default Vocal;
