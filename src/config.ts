import { ColorResolvable } from "discord.js";
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

export default {
    discordToken: process.env.DISCORD_TOKEN,
    clientID: process.env.CLIENT_ID,
    guildID: process.env.GUILD_ID,

    color: process.env.MAIN_COLOR as ColorResolvable,

    apiBaseURL: process.env.API_BASE_URL,
    wikiBaseURL: process.env.WIKI_BASE_URL,

    wikiEmoji: process.env.WIKI_EMOJI,
    baguetteEmoji: process.env.BAGUETTE_EMOJI,
    moneyBaguetteEmoji: process.env.MONEY_BAGUETTE_EMOJI,
    moneyCroissantEmoji: process.env.MONEY_CROISSANT_EMOJI,
    moneyBriocheEmoji: process.env.MONEY_BRIOCHE_EMOJI,

    welcomeChannelID: process.env.WELCOME_CHANNEL_ID,
    logChannelID: process.env.LOG_CHANNEL_ID,
    verifChannelID: process.env.VERIF_CHANNEL_ID,
    nationsCategoryID: process.env.NATIONS_CATEGORY_ID,

    memberRoleID: process.env.MEMBER_ROLE_ID,

    fileExtension: process.env.FILE_EXTENSION,

    redisDb: process.env.REDIS_DB,
};
