const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const wiki = require("wikijs").default;
const wikiApi = wiki({
  apiUrl: process.env.WIKI_BASE_URL + "api.php",
  origin: null,
});

const { Embed } = require("../utils/embed");
const { wikiPageToLink, isoToString } = require("../utils/misc");

// little html to discord flavored markdown parser that does the job
const translate = require("@wakeful-cloud/html-translator");

module.exports = {
  data: {
    name: "wiki",
    description: "Fournit des pages du wiki depuis Discord !",
    options: [
      {
        name: "search",
        type: "SUB_COMMAND",
        description: "Chercher une page sur le wiki !",
        options: [
          {
            name: "request",
            type: "STRING",
            description: "Chercher cette page sur le wiki !",
            required: true,
          },
        ],
      },
      {
        name: "get",
        type: "SUB_COMMAND",
        description: "Fournit un aperçu d'une page sur le wiki !",
        options: [
          {
            name: "page",
            type: "STRING",
            description: "Fournit un aperçu de cette page sur le wiki !",
            required: true,
          },
        ],
      },
      {
        name: "random",
        type: "SUB_COMMAND",
        description: "Donne une page aléatoire du wiki !",
      },
    ],
  },

  async run(interaction) {
    await interaction.deferReply();

    switch (interaction.options.getSubcommand()) {
      case "search":
        const request = interaction.options.getString("request");
        const results = (await wikiApi.search(request, 20)).results;

        if (!results.length) {
          const errorEmbed = new Embed()
            .setType("error")
            .setDescription(`Aucun résultat pour "${request}".`);

          return await interaction.editReply({ embeds: [errorEmbed] });
        }

        // Formatting
        const wikiLinks = results.map((page) => wikiPageToLink(page));
        const wikiPagesList = wikiLinks
          .map((link, i) => `• [${results[i]}](${link})`)
          .join("\n");

        const wikiEmbed = new Embed()
          .setType("default")
          .setTitle(`🔎 ${results.length} résultats pour "${request}"`)
          .setDescription(wikiPagesList);

        return await interaction.editReply({ embeds: [wikiEmbed] });

      case "get":
        const page = interaction.options.getString("page");
        let result;

        try {
          result = await wikiApi.page(page);
        } catch (error) {
          console.error(error);
          const errorEmbed = new Embed()
            .setType("error")
            .setDescription(`Page intitulée "${page}" non trouvée.`);

          return await interaction.editReply({ embeds: [errorEmbed] });
        }

        const pageImages = await result.images();

        const pageEmbed = new Embed()
          .setType("default")
          .setTitle(`${process.env.WIKI_EMOJI} ${result.title}`)
          .setDescription(translate(await result.html())[0].split("\n")[0]) // dont touch that it kinda works :kappa:
          .setThumbnail(pageImages[0])
          .setImage(pageImages[1])
          .addField("📝 Dernier changement", isoToString(result.touched))
          .addField("🖇️ Lien wiki", `[${result.title}](${result.fullurl})`);

        return await interaction.editReply({ embeds: [pageEmbed] });

      case "random":
        const wikiRandom = await wikiApi.random();
        const randomEmbed = new Embed()
          .setType("default")
          .setTitle("🎲 Page aléatoire")
          .setDescription(`[${wikiRandom}](${wikiPageToLink(wikiRandom)})`);

        return await interaction.editReply({ embeds: [randomEmbed] });
    }
  },
};
