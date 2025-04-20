import { Colors, EmbedBuilder, inlineCode, SlashCommandBuilder } from "discord.js";
import fetcher from "../fetcher";
import { Command } from "../types/command";

const Status: Command = {
    data: new SlashCommandBuilder()
        .setName("status")
        .setDescription("Statut du serveur Minecraft")
        .toJSON(),
    async run(_client, interaction) {
        await interaction.deferReply();

        const { data: status, error } = await fetcher.GET("/server");

        const statusEmbed = new EmbedBuilder().setTitle("💓 Statut du serveur");

        if (error) {
            statusEmbed.setColor(Colors.Red).setDescription("🔴 Hors ligne");
            return await interaction.editReply({ embeds: [statusEmbed] });
        }

        statusEmbed.setColor(Colors.Green).setDescription("✅ En ligne");

        statusEmbed.addFields(
            {
                name: "💾 Version",
                value: status.version,
            },
            {
                name: "👥 Joueurs",
                value:
                    status.onlinePlayers.length +
                    " joueur" +
                    (status.onlinePlayers.length > 1 ? "s" : "") +
                    " en ligne : " +
                    status.onlinePlayers.map((p) => inlineCode(p.name)).join(", "),
            }
        );

        interaction.editReply({ embeds: [statusEmbed] });
    },
};

export default Status;
