# 🥐 Croissant

Discord Bot for La Boulangerie using Discord.js v14.

## ⛏️ Building

To build the bot just run `npm run build` and make sure to create the environment variable file named `.env`.
Here are the environment variables to set:

| Environment variable    | Note                                                    |
| ----------------------- | ------------------------------------------------------- |
| `DISCORD_TOKEN`         | Discord token provided by the dev platform              |
| `CLIENT_ID`             | Bot client id on the dev platform                       |
| `GUILD_ID`              | ID of the guild the bot will do its stuff               |
| `MAIN_COLOR`            | Color on the format #ABCDEF                             |
| `API_BASE_URL`          | La Boulangerie API URL, format https://...              |
| `API_TOKEN`             | La Boulangerie API token for private endpoints          |
| `WIKI_BASE_URL`         | Wiki URL, same format                                   |
| `WIKI_EMOJI`            | Format: <:emoji_name:emoji_id>                          |
| `BAGUETTE_EMOJI`        | Same                                                    |
| `MONEY_BAGUETTE_EMOJI`  | Same                                                    |
| `MONEY_CROISSANT_EMOJI` | Same                                                    |
| `WELCOME_CHANNEL_ID`    |                                                         |
| `LOG_CHANNEL_ID`        |                                                         |
| `VERIF_CHANNEL_ID`      |                                                         |
| `MOD_CHANNEL_ID`        |                                                         |
| `NATIONS_CATEGORY_ID`   |                                                         |
| `VOICE_CATEGORY_ID`     |                                                         |
| `MEMBER_ROLE_ID`        |                                                         |
| `FILE_EXTENSION`        | Files to be checked in directories on start, like ".ts" |
| `REDIS_DB`              | Redis connection URL, format redis://...                |

## 📦 Deploy commands

Two options : global or guild, depends on what you're doing. Guild-based deployment of commands is best suited for development and testing in your own personal server. Once you're satisfied that it's ready, deploy the command globally to publish it to all guilds that your bot is in.

Then run `node deploy-commands.ts <global|guild>`.
