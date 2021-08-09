const axios = require("axios");
const baseUrl = "http://api.lblg.cc/";

const getStatus = async () => {
  return (await axios.get(baseUrl + "status")).data;
};

const getPlayer = async (username) => {
  return (
    await axios.get(baseUrl + "player", {
      params: {
        name: username,
      },
    })
  ).data;
};

const getTown = async (name) => {
  return (
    await axios.get(baseUrl + "town", {
      params: {
        name: name,
      },
    })
  ).data;
};

const getNation = async (name) => {
  return (
    await axios.get(baseUrl + "nation", {
      params: {
        name: name,
      },
    })
  ).data;
};

module.exports = { getStatus, getPlayer, getTown, getNation };
