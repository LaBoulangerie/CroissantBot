const { DateTime } = require("luxon");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const fancyList = (array) => {
  return array.map((el) => `\`${el}\``).join(", ");
};

const dateToString = (timestamp) => {
  return DateTime.fromMillis(timestamp).toLocaleString(DateTime.DATETIME_SHORT);
};

const isoToString = (iso) => {
  return DateTime.fromISO(iso).toLocaleString(DateTime.DATETIME_SHORT);
};

const wikiPageToLink = (page) => {
  return process.env.WIKI_BASE_URL + "wiki/" + encodeURI(page);
};

module.exports = { fancyList, dateToString, isoToString, wikiPageToLink };
