const { Embed } = require("../utils/embed");

const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

module.exports = async (bot, message) => {
  if (message.author.bot) return;

  if (message.channel.id === process.env.VERIF_CHANNEL_ID) {
    if (
      message.content.toLowerCase() == "lu et approuvé" &&
      !message.guild
        .member(message.author)
        .roles.cache.has(process.env.MEMBER_ROLE_ID)
    ) {
      await message.member.roles.add(
        message.guild.roles.cache.get(process.env.MEMBER_ROLE_ID).id
      );
      message.react("✅");
      message.delete({ timeout: 2500 });

      const infoEmbed = new Embed()
        .setTitle(
          `${process.env.BAGUETTE_EMOJI} Bienvenue ${message.author.username} !`
        )
        .setColor(process.env.COLOR)
        .setDescription(
          "Je suis Croissant, le bot de La Boulangerie, je vous souhaite un bon jeu 😄"
        )
        .addField("📌 IP et version", "`mc.laboulangerie.net` en 1.16.5")
        .addField(
          "🙏 Besoin d'aide ?",
          "Dirigez-vous dans le salon [#🙏support](https://discord.com/channels/516302751500599316/683456701982179361/) ! Les helpers et modérateurs connectés vous aiderons dans les moindres délais 😉"
        )
        .addField(
          "🙌 Voulez-vous participer au développement de La Boulangerie ?",
          "Nous recrutons différents rôles qui sont proposés dans le salon [🙌recrutements](https://discord.com/channels/516302751500599316/862370469282185246/). Jetez-y un œil !"
        );
      message.author.send(infoEmbed);

      const logChannel = bot.channels.cache.get(process.env.LOG_CHANNEL_ID);
      const logEmbed = new Embed()
        .setColor("#ffa500")
        .setTitle(`🍞 ${message.member.displayName}`)
        .setDescription(`<@${message.author.id}> est devenu membre !`);
      logChannel.send(logEmbed);
    } else {
      message.react("❌");
      message.delete({ timeout: 2500 });
    }
  }

  // Set last active nation channel first in the nations category
  if (message.channel.parent.id === process.env.NATIONS_CATEGORY_ID) {
    message.channel.setPosition(0);
  }
};
