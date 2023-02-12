import Keyv from "keyv";
import config from "../config";

const keyv = new Keyv(config.redisDb, { namespace: "forms" });
keyv.on("error", (err) => console.log("Connection Error", err));

export default keyv;
