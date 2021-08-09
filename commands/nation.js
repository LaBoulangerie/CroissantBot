const { getNation } = require("../utils/api");
const { Embed } = require("../utils/embed");
const { fancyList, dateToString } = require("../utils/miscUtils");

const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

module.exports = {
  data: {
    name: "nation",
    description: "Fournit des informations sur une nation",
    options: [
      {
        name: "name",
        type: "STRING",
        description: "Fournit des informations sur cette nation",
        required: true,
      },
    ],
  },

  async run(interaction) {
    await interaction.deferReply();

    const name = interaction.options.getString("name");
    const nationData = await getNation(name);
    const wikiEmoji = "<:wiki:792694310197133323>";

    if (nationData.error) {
      const errorEmbed = new Embed()
        .setType("error")
        .setDescription(`Nation ${name} non trouvée`);

      return await interaction.editReply({ embeds: [errorEmbed] });
    }

    // Formatting
    const nationTitle = nationData.tag
      ? nationData.name + ` [${nationData.tag}]`
      : nationData.name;

    const nationSpawn = nationData.spawn
      ? `\`${nationData.spawn.x}\` \`${nationData.spawn.y}\` \`${nationData.spawn.z}\``
      : null;

    const nationEmbed = new Embed()
      .setType("default")
      .setColor(nationData.mapColorHexCode)
      .setTitle("🚩 " + nationTitle);

    if (nationData.capital)
      nationEmbed.addField("👑 Capitale", nationData.capital, true);

    if (nationData.towns.length)
      nationEmbed.addField(
        `🏘️ ${nationData.towns.length} ville` +
          (nationData.towns.length > 1 ? "s" : ""),
        fancyList(nationData.towns.map((town) => town.name)),
        true
      );

    if (nationSpawn) {
      nationEmbed.addField("📍 Spawn", townSpawn, true);
    }
    if (nationData.nationBoard)
      nationEmbed.addField("📜 Nation board", nationData.nationBoard, true);
    nationEmbed.addField(
      "⏳ Date de création",
      dateToString(nationData.registered),
      true
    );

    nationEmbed.addField(
      wikiEmoji + " Page wiki",
      `[${nationData.name}](${process.env.WIKI_BASE_URL + nationData.name})`,
      true
    );

    return await interaction.editReply({ embeds: [nationEmbed] });
  },
};
