const { Embed } = require("../utils/embed");

const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

module.exports = async (bot, member) => {
  const welcomeChannel = bot.channels.cache.get(process.env.WELCOME_CHANNEL_ID);
  const logChannel = bot.channels.cache.get(process.env.LOG_CHANNEL_ID);

  const welcomeEmbed = new Embed()
    .setTitle(`👋 Bienvenue ${member.displayName} !`)
    .setColor("#00bf00");
  welcomeChannel.send(welcomeEmbed);

  const logEmbed = new Embed()
    .setTitle(`➡ ${member.displayName}`)
    .setDescription(
      member.guild.memberCount + " membres sur " + member.guild.name
    )
    .setColor("#00bf00");
  logChannel.send(logEmbed);
};
