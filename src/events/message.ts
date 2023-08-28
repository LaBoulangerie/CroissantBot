import { Colors, EmbedBuilder, Events, Message, TextChannel } from "discord.js";
import config from "../config";
import { Event } from "../types/event";

const MessageCreate: Event = {
    name: Events.MessageCreate,
    once: false,
    async run(client, message: Message) {
        if (message.author.bot) return;

        if (message.channel.id === config.verifChannelID) {
            if (
                message.content.toLowerCase() == "lu et approuvé" &&
                !message.guild.members.cache
                    .get(message.author.id)
                    .roles.cache.has(config.memberRoleID)
            ) {
                await message.member.roles.add(config.memberRoleID);
                message.react("✅");
                setTimeout(() => message.delete(), 3000);

                const infoEmbed = new EmbedBuilder()
                    .setTitle(
                        `${process.env.BAGUETTE_EMOJI} Bienvenue ${message.author.username} !`
                    )
                    .setColor(config.color)
                    .setDescription(
                        "🥐 Je suis Croissant, le bot de La Boulangerie. Je vous souhaite la bienvenue et un bon jeu 😄"
                    )
                    .addFields(
                        {
                            name: "📌 IP et version",
                            value: "`mc.laboulangerie.net` en 1.19",
                            inline: true,
                        },
                        {
                            name: "🙏 Besoin d'aide ?",
                            value: "Dirigez-vous vers le salon [#🙏aide-reports](https://discord.com/channels/516302751500599316/1029103689954246706/) !",
                            inline: true,
                        },
                        {
                            name: "🙌 Voulez-vous participer au développement de La Boulangerie ?",
                            value: "Nous recrutons différents rôles qui sont proposés dans le salon [🙌recrutements](https://discord.com/channels/516302751500599316/862370469282185246/). Jetez-y un œil !",
                        }
                    );

                try {
                    message.author.send({ embeds: [infoEmbed] });
                } catch (error) {
                    console.error("Could not send the message, DM closed.");
                }

                const logChannel = client.channels.cache.get(config.logChannelID) as TextChannel;
                const logEmbed = new EmbedBuilder()
                    .setColor(config.color)
                    .setTitle(`🍞 ${message.member.displayName}`)
                    .setDescription(`<@${message.author.id}> est devenu membre !`);
                logChannel.send({ embeds: [logEmbed] });

                const welcomeChannel = client.channels.cache.get(
                    config.welcomeChannelID
                ) as TextChannel;
                const welcomeEmbed = new EmbedBuilder()
                    .setTitle(`👋 Bienvenue ${message.member.displayName} !`)
                    .setColor(Colors.Green);
                welcomeChannel.send({ embeds: [welcomeEmbed] });
            } else {
                message.react("❌");
                setTimeout(() => message.delete(), 3000);
            }
        }
    },
};

export default MessageCreate;
