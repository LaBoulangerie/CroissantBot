import { EmbedBuilder, inlineCode } from "@discordjs/builders";
import { Colors, PermissionFlagsBits, SlashCommandBuilder, time } from "discord.js";
import keyv from "../db/keyv";
import { Command } from "../types/command";
import { FormResponse } from "../types/form";

const Manage: Command = {
    data: new SlashCommandBuilder()
        .setName("manage")
        .setDescription("Gestion des différents services")
        .addSubcommandGroup((subcommandGroup) =>
            subcommandGroup
                .setName("form")
                .setDescription("Gestion des formulaires")
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName("get")
                        .setDescription("Liste les réponses aux formulaires d'un utilisateur")
                        .addUserOption((option) =>
                            option
                                .setName("user")
                                .setDescription("Utilisateur Discord")
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand.setName("list").setDescription("Liste toutes les réponses")
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
        .setDMPermission(false)
        .toJSON(),
    async run(client, interaction) {
        if (interaction.channel.isDMBased()) return;

        const service = interaction.options.getSubcommandGroup();
        const action = interaction.options.getSubcommand();

        switch (service) {
            case "form":
                switch (action) {
                    case "get":
                        const givenUser = interaction.options.getUser("user", true);
                        const responses = ((await keyv.get(givenUser.id)) ||
                            []) as Array<FormResponse>;

                        if (!responses.length) {
                            return await interaction.reply({
                                content: "L'utilisateur n'a répondu a aucun formulaire.",
                                ephemeral: true,
                            });
                        }

                        const responseEmbeds: EmbedBuilder[] = [];

                        for (const response of responses) {
                            const responseEmbed = new EmbedBuilder()
                                .setTitle(`Réponse au formulaire ${inlineCode(response.form.id)}`)
                                .setColor(Colors.DarkPurple)
                                .setAuthor({
                                    name: givenUser.username,
                                    iconURL: givenUser.avatarURL(),
                                })
                                .setTimestamp(new Date(response.timestamp));

                            for (const answer of response.answers) {
                                responseEmbed.addFields({
                                    name: response.form.inputs.find((i) => i.id === answer.id)
                                        .label,
                                    value: answer.answer,
                                });
                            }

                            responseEmbeds.push(responseEmbed);
                        }

                        await interaction.reply({ embeds: responseEmbeds });

                        break;
                    case "list":
                        const formListEmbed = new EmbedBuilder()
                            .setTitle("Liste des réponses aux formulaires")
                            .setColor(Colors.DarkPurple);

                        for await (const [key, value] of keyv.iterator(null)) {
                            const v = value as Array<FormResponse>;
                            formListEmbed.addFields({
                                name: (await client.users.fetch(key)).username,
                                value: v
                                    .map(
                                        (r) =>
                                            inlineCode(r.form.id) +
                                            " " +
                                            time(new Date(r.timestamp))
                                    )
                                    .join(", "),
                            });
                        }

                        await interaction.reply({
                            embeds: [formListEmbed],
                        });
                        break;
                }
                break;
        }
    },
};

export default Manage;
