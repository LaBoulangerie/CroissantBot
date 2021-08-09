const { getStatus } = require("../utils/api");
const { Embed } = require("../utils/embed");
const { fancyList } = require("../utils/miscUtils");

module.exports = {
  data: {
    name: "status",
    description: "Vérifiez le statut du serveur !",
    options: [],
  },

  async run(interaction) {
    const statusData = await getStatus();

    const statusEmbed = new Embed()
      .setType("default")
      .setTitle("💓 Statut du serveur")
      .setDescription(statusData.online ? "✅ En ligne" : "🔴 Hors ligne");

    if (statusData.online) {
      statusEmbed
        .addField("💾 Version", statusData.version)
        .addField(
          "👥 Joueurs",
          `${statusData.players.online}/${statusData.players.max} • ` +
            `${fancyList(statusData.players.list)}`
        );
    }

    return await interaction.reply({ embeds: [statusEmbed] });
  },
};
