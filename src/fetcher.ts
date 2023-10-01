import { paths } from "./types/api";
import { Fetcher } from "@qdrant/openapi-typescript-fetch";
import config from "./config";

const fetcher = Fetcher.for<paths>();
fetcher.configure({
    baseUrl: config.apiBaseURL,
    init: {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + config.apiToken,
        },
    },
});

export default fetcher;
