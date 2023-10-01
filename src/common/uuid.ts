export const isUuid = (str: string) => {
    const uuidPattern =
        /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidPattern.test(str);
};

const hyphensIndexes = [8, 13, 18, 23];

export const addUuidHyphens = (shortUuid: string) => {
    let uuid = shortUuid;
    for (let index of hyphensIndexes) {
        uuid = uuid.substring(0, index) + "-" + uuid.substring(index);
    }

    return uuid;
};
