import type { paths } from "./types/api";
import config from "./config";
import createClient from "openapi-fetch";

const client = createClient<paths>({
    baseUrl: config.apiBaseURL,
    headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + config.apiToken,
    },
});

export default client;
