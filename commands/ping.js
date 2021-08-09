const { Embed } = require("../utils/embed");

module.exports = {
  data: {
    name: "ping",
    description: "Vérifiez le ping du bot !",
    options: [],
  },

  async run(interaction) {
    const pingEmbed = new Embed()
      .setType("default")
      .setTitle("🏓 Ping")
      .setDescription(`${interaction.client.ws.ping}ms`);

    return await interaction.reply({ embeds: [pingEmbed] });
  },
};
