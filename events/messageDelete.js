const { Embed } = require("../utils/embed");

const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

module.exports = async (bot, message) => {
  const logChannel = bot.channels.cache.get(process.env.LOG_CHANNEL_ID);

  const logEmbed = new Embed()
    .setTitle("🗑️ Message supprimé")
    .addField("👤 Auteur", `<@${message.author.id}>`)
    .addField("💬 Salon", `<#${message.channel.id}>`)
    .setColor("ORANGE");
  if (message.content) logEmbed.addField("📦 Contenu", message.content);

  logChannel.send(logEmbed);

  // If a message is deleted in the nation category, set the nation channel last in it (punition)
  if (message.channel.parent.id === process.env.NATIONS_CATEGORY_ID) {
    message.channel.setPosition(message.channel.parent.children.size - 1);
  }
};
