import { addUuidHyphens } from "./uuid";
import axios from "axios";
export const uuidFromUsername = async (username: string) => {
    const response = await axios.get("https://api.mojang.com/users/profiles/minecraft/" + username);

    return addUuidHyphens(response.data.id);
};

export const usernameFromUuid = async (uuid: string) => {
    const response = await axios.get(
        "https://sessionserver.mojang.com/session/minecraft/profile/" + uuid
    );

    return response["name"];
};
