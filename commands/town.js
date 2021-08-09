const { getTown } = require("../utils/api");
const { Embed } = require("../utils/embed");
const { fancyList, dateToString } = require("../utils/miscUtils");

module.exports = {
  data: {
    name: "town",
    description: "Fournit des informations sur une ville",
    options: [
      {
        name: "name",
        type: "STRING",
        description: "Fournit des informations sur cette ville",
        required: true,
      },
    ],
  },

  async run(interaction) {
    await interaction.deferReply();

    const name = interaction.options.getString("name");
    const townData = await getTown(name);

    console.log(townData);

    if (townData.error) {
      const errorEmbed = new Embed()
        .setType("error")
        .setDescription(`Ville ${name} non trouvée`);

      return await interaction.editReply({ embeds: [errorEmbed] });
    }

    // Formatting
    const townTitle = townData.tag
      ? townData.name + ` [${townData.tag}]`
      : townData.name;

    const townSpawn = townData.spawn
      ? `\`${townData.spawn.x}\` \`${townData.spawn.y}\` \`${townData.spawn.z}\``
      : null;

    const townEmbed = new Embed()
      .setType("default")
      .setTitle("🏡 " + townTitle);

    if (townData.nation) townEmbed.addField("🚩 Nation", townData.nation, true);

    if (townData.mayor) townEmbed.addField("👨‍💼 Maire", townData.mayor, true);

    if (townData.residents)
      townEmbed.addField(
        `👥 ${townData.residents.length} résident` +
          (townData.residents.length > 1 ? "s" : ""),
        fancyList(townData.residents.map((res) => res.name)),
        true
      );

    if (townSpawn) {
      townEmbed.addField("📍 Spawn", townSpawn, true);
    }
    if (townData.townBoard)
      townEmbed.addField("📜 Town board", townData.townBoard, true);
    townEmbed.addField(
      "⏳ Date de création",
      dateToString(townData.registered),
      true
    );

    return await interaction.editReply({ embeds: [townEmbed] });
  },
};
