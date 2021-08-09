const { DateTime, Interval } = require("luxon");

const fancyList = (array) => {
  return array.map((el) => `\`${el}\``).join(", ");
};

const dateToString = (timestamp) => {
  return DateTime.fromMillis(timestamp).toLocaleString(DateTime.DATETIME_SHORT);
};

module.exports = { fancyList, dateToString };
