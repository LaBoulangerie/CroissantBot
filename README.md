# 🥐 Croissant

Discord Bot for La Boulangerie using Discord.js v14.

## ⛏️ Building

To build the bot just run `npm run build` and make sure to create the environment variable file named `.env`.
Here are the environment variables to set: `DISCORD_TOKEN, CLIENT_ID, GUILD_ID, MAIN_COLOR, API_BASE_URL, WIKI_BASE_URL, WIKI_EMOJI, BAGUETTE_EMOJI, MONEY_BAGUETTE_EMOJI, MONEY_CROISSANT_EMOJI, MONEY_BRIOCHE_EMOJI, WELCOME_CHANNEL_ID, LOG_CHANNEL_ID, VERIF_CHANNEL_ID, NATIONS_CATEGORY_ID, MEMBER_ROLE_ID, FILE_EXTENSION`.

## 📦 Deploy commands

Two options : global or guild, depends on what you're doing. Guild-based deployment of commands is best suited for development and testing in your own personal server. Once you're satisfied that it's ready, deploy the command globally to publish it to all guilds that your bot is in.

Then run `node deploy-commands.ts <global|guild>`.
