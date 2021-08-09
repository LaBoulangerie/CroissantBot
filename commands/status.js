const { getStatus } = require("../utils/api");
const { Embed } = require("../utils/embed");

module.exports = {
  data: {
    name: "status",
    description: "Vérifiez le statut du serveur !",
    options: [],
  },

  async run(interaction) {
    const statusData = await getStatus();

    let statusEmbed = new Embed()
      .setType("default")
      .setTitle("💓 Statut du serveur")
      .setDescription(statusData.online ? "✅ En ligne" : "🔴 Hors ligne");

    if (statusData.online) {
      statusEmbed
        .addField("💾 Version", statusData.version)
        .addField(
          "👥 Joueurs",
          `${statusData.players.online}/${statusData.players.max} • ` +
            `${statusData.players.list
              .map((player) => `\`${player}\``)
              .join(", ")}`
        );
    }

    return await interaction.reply({ embeds: [statusEmbed] });
  },
};
