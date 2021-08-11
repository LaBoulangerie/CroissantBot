const Discord = require("discord.js");
const fs = require("fs");
const { Embed } = require("./utils/embed");
require("dotenv").config();

const client = new Discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] });

const registerCommands = async () => {
  const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // Load options choices
    if (command.data.options.length) {
      for (const option of command.data.options) {
        if (option.loadChoices) {
          option.choices = await option.loadChoices(client);
        }
      }
    }
    // Create each command
    // ! DEV VERSION ONLY - replace by client.application?.commands
    await client.guilds.cache
      .get("563756956553314334")
      ?.commands.create(command.data);

    console.log(`- Command ${command.data.name} loaded!`);
  }
};

// Event Handler
fs.readdir("./events/", (err, eventFiles) => {
  if (err) console.error(err);
  console.log(`[OK!] [EVENTS] ${eventFiles.length} events ont été chargés !`);
  eventFiles.forEach((file) => {
    const eventName = file.split(".")[0];
    const event = require(`./events/${file}`);
    bot.on(eventName, event.bind(null, bot));
    delete require.cache[require.resolve(`./events/${file}`)];
  });
});

client.once("ready", async () => {
  await registerCommands();
  console.log(`${client.user.username} is ready to launch!`);
});

client.on("interactionCreate", (interaction) => {
  // Command Handler
  if (interaction.isCommand()) {
    try {
      let command = require("./commands/" + interaction.commandName);

      command.run(interaction);
    } catch (error) {
      const errorEmbed = new Embed()
        .setType("error")
        .setDescription("Something went wrong, that should not happen.");
      interaction.reply({ embeds: [errorEmbed] });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
