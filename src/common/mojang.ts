import { addUuidHyphens } from "./uuid";

export const uuidFromUsername = async (username: string) => {
    return addUuidHyphens(
        (await (await fetch("https://api.mojang.com/users/profiles/minecraft/" + username)).json())[
            "id"
        ]
    );
};

export const usernameFromUuid = async (uuid: string) => {
    return (
        await (
            await fetch("https://sessionserver.mojang.com/session/minecraft/profile/" + uuid)
        ).json()
    )["name"];
};
