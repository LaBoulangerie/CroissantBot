const { getPlayer } = require("../utils/api");
const { Embed } = require("../utils/embed");
const { fancyList, dateToString } = require("../utils/miscUtils");

module.exports = {
  data: {
    name: "player",
    description: "Fournit des informations sur un joueur",
    options: [
      {
        name: "username",
        type: "STRING",
        description: "Fournit des informations sur ce joueur",
        required: true,
      },
    ],
  },

  async run(interaction) {
    await interaction.deferReply();

    const username = interaction.options.getString("username");
    const playerData = await getPlayer(username);

    // Formatting
    const playerStatus = playerData.isOnline
      ? "✅ Online"
      : playerData.afk
      ? "⏳ AFK"
      : "🔴 Offline";

    if (playerData.error) {
      const errorEmbed = new Embed()
        .setType("error")
        .setDescription(`Joueur ${username} non trouvé`);

      return await interaction.editReply({ embeds: [errorEmbed] });
    }

    const playerEmbed = new Embed()
      .setType("default")
      .setTitle(
        `👤 ${playerData.title} ${playerData.name} ${playerData.surname} • ` +
          playerStatus
      )
      .setThumbnail(
        "https://visage.surgeplay.com/bust/cecea4da3bc941f9a9109e7be63e1295.png"
      )
      .addField("💰 Argent", `${playerData.money}฿`, true)
      .addField("🆔 UUID", playerData.uuid, true);

    if (playerData.town)
      playerEmbed.addField("🏡 Ville", playerData.town, true);
    if (playerData.townRanks.length)
      playerEmbed.addField(
        `🏡 Rang${playerData.townRanks > 1 ? "s" : ""} de ville`,
        fancyList(playerData.townRanks),
        true
      );

    if (playerData.nationRanks.length) {
      playerEmbed.addField(
        `🚩 Rang${playerData.nationRanks > 1 ? "s" : ""} de nation`,
        fancyList(playerData.nationRanks),
        true
      );
    }

    if (playerData.friends.length)
      playerEmbed.addField("🙌 Amis", fancyList(playerData.friends), true);

    playerEmbed
      .addField(
        "⏳ Dernière connexion",
        dateToString(playerData.lastOnline),
        true
      )
      .addField("⏳ Date d'arrivée", dateToString(playerData.registered), true);

    return await interaction.editReply({ embeds: [playerEmbed] });
  },
};
