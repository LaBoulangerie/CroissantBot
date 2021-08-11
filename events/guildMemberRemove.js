const { Embed } = require("../utils/embed");

const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

module.exports = async (bot, member) => {
  const logChannel = bot.channels.cache.get(process.env.LOG_CHANNEL_ID);

  const logEmbed = new Embed()
    .setTitle(`← ${member.displayName}`)
    .setDescription(
      member.guild.memberCount + " membres sur " + member.guild.name
    )
    .setColor("#ff0000");

  logChannel.send(logEmbed);
};
