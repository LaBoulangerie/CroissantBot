const { Embed } = require("../utils/embed");

module.exports = {
  data: {
    name: "help",
    description: "Fournit de l'aide pour toutes les commandes !",
    options: [
      {
        name: "command",
        type: "STRING",
        description: "Obtenir de l'aide sur cette commande",
        required: false,
        async loadChoices(client) {
          // ! DEV VERSION ONLY - interaction.client.application?.commands
          const guildCommands = await client.guilds.cache
            .get("563756956553314334")
            ?.commands.fetch();

          return guildCommands.map((command) => ({
            name: command.name,
            value: command.name,
          }));
        },
      },
    ],
  },

  async run(interaction, options) {
    // ! DEV VERSION ONLY - interaction.client.application?.commands
    const guildCommands = await interaction.client.guilds.cache
      .get(interaction.member.guild.id)
      ?.commands.fetch();

    //    const globalCommands = await interaction.client.application?.commands.fetch();

    const optionalCommand = interaction.options.getString("command");

    if (optionalCommand) {
      // ! DEV VERSION ONLY - globalCommands
      let commandAsked = guildCommands.find(
        (command) => command.name == optionalCommand
      );

      if (commandAsked) {
        const helpEmbed = new Embed()
          .setType("default")
          .setTitle(`❓ Aide pour /${optionalCommand}`)
          .addField("📃 Description", commandAsked.description);
        if (commandAsked.options.length) {
          helpEmbed.addField(
            "🧮 Options",
            commandAsked.options
              .map(
                (option) =>
                  `• \`${
                    option.required ? `<${option.name}>` : `[${option.name}]`
                  }\`: ${option.description}\n`
              )
              .join("")
          );
        }

        return await interaction.reply({ embeds: [helpEmbed] });
      } else {
        let errorEmbed = new Embed()
          .setType("error")
          .setDescription("Something went wrong, that should not happen.");
        return await interaction.reply({ embeds: [errorEmbed] });
      }
    }

    // ! DEV VERSION ONLY - globalCommands
    if (guildCommands.size) {
      const guildHelpEmbed = new Embed()
        .setType("default")
        .setTitle("📜 Liste des commandes")
        .setDescription(
          guildCommands.map((command) => `• \`/${command.name}\`\n`).join("")
        )
        .addField(
          "💡 Tip",
          "Vous pouvez obtenir des informations sur une commande spécifique en tapant `/help [commande]` !"
        );
      return await interaction.reply({
        embeds: [guildHelpEmbed],
      });
    }
  },
};
