import Keyv from "keyv";
import config from "../config";
import KeyvRedis from "@keyv/redis";

const keyv = new Keyv({ store: new KeyvRedis(config.redisDb), namespace: "forms" });
keyv.on("error", (err) => console.log("Connection Error", err));

export default keyv;
