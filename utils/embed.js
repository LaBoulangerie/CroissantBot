const Discord = require("discord.js");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

class Embed extends Discord.MessageEmbed {
  constructor(type) {
    super();
    this.type = type;
  }

  setType(type) {
    this.type = type;

    switch (this.type) {
      case "error":
        this.setTitle("❌ Erreur");
        this.setColor("RED");
        break;

      case "default":
      default:
        this.setColor(process.env.COLOR);
        break;
    }

    return this;
  }

  getType() {
    return this.type;
  }
}

module.exports = { Embed };
