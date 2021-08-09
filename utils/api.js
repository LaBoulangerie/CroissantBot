const axios = require("axios");
const baseUrl = "http://api.lblg.cc/";

const getStatus = async () => {
  return (await axios.get(baseUrl + "status")).data;
};

module.exports = { getStatus };
