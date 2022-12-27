import {
    ChatInputCommandInteraction,
    Colors,
    EmbedBuilder,
    inlineCode,
    SlashCommandBuilder,
} from "discord.js";
import { ApiResponse } from "openapi-typescript-fetch";
import fetcher from "../fetcher";
import { Command } from "../types/command";

const Status: Command = {
    data: new SlashCommandBuilder()
        .setName("status")
        .setDescription("Statut du serveur Minecraft")
        .toJSON(),
    async run(client, interaction) {
        await interaction.deferReply();

        const getStatus = fetcher.path("/server").method("get").create();

        let status: ApiResponse;

        const statusEmbed = new EmbedBuilder().setTitle("💓 Statut du serveur");

        try {
            status = await getStatus({});
        } catch (e) {
            statusEmbed.setColor(Colors.Red).setDescription("🔴 Hors ligne");
            return await interaction.editReply({ embeds: [statusEmbed] });
        }

        statusEmbed.setColor(Colors.Green).setDescription("✅ En ligne");

        if (status.ok) {
            statusEmbed.addFields(
                {
                    name: "💾 Version",
                    value: status.data.version,
                },
                {
                    name: "👥 Joueurs",
                    value:
                        status.data.onlinePlayers.length +
                        " joueur" +
                        (status.data.onlinePlayers.length > 1 ? "s" : "") +
                        " en ligne :" +
                        status.data.onlinePlayers
                            .map((p) => inlineCode(p.name))
                            .join(", "),
                }
            );
        }

        interaction.editReply({ embeds: [statusEmbed] });
    },
};

export default Status;
