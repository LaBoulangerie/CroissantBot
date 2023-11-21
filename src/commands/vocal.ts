import { SlashCommandBuilder } from "discord.js";
import { Command } from "../types/command";
import { formToModal } from "../common/modal";
import config from "../config";

const Vocal: Command = {
    data: new SlashCommandBuilder()
        .setName("vocal")
        .setDescription("Créer un vocal personnalisé")
        .toJSON(),
    async run(client, interaction) {
        const voiceChannels = client.voiceChannels;

        if (voiceChannels.size >= config.voiceChannelsLimit) {
            return await interaction.reply({
                content: `❌ Il y a trop de salons personnalisés actifs.`,
                ephemeral: true,
            });
        }

        config.voiceChannelsLimit;
        const voiceChannelUsers = Array.from(voiceChannels.keys());
        const userId = interaction.user.id;

        if (voiceChannelUsers.includes(interaction.user.id)) {
            return await interaction.reply({
                content: `❌ Vous avez déjà créé un salon personnalisé (<#${voiceChannels.get(
                    userId
                )}>).`,
                ephemeral: true,
            });
        }

        const form = client.forms.get("voice-channel");
        const modal = formToModal(form);
        await interaction.showModal(modal);
    },
};

export default Vocal;
