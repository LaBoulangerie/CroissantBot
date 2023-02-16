import { Colors, EmbedBuilder, Events, Message, TextChannel } from "discord.js";
import { Event } from "../types/event";

const MessageDelete: Event = {
    name: Events.MessageDelete,
    once: false,
    run(client, message: Message) {
        const logChannel = client.channels.cache.get(process.env.LOG_CHANNEL_ID) as TextChannel;

        const logEmbed = new EmbedBuilder()
            .setTitle("🗑️ Message supprimé")
            .addFields(
                {
                    name: "👤 Auteur",
                    value: `<@${message.author.id}>`,
                    inline: true,
                },
                {
                    name: "💬 Salon",
                    value: `<#${message.channel.id}>`,
                    inline: true,
                }
            )
            .setColor(Colors.Orange);

        if (message.content)
            logEmbed.addFields({ name: "📦 Contenu", value: message.content.substring(0, 1024) });

        logChannel.send({ embeds: [logEmbed] });
    },
};

export default MessageDelete;
