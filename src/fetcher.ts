import { paths } from "./types/api";
import { Fetcher } from "openapi-typescript-fetch";
import config from "./config";

const fetcher = Fetcher.for<paths>();
fetcher.configure({
    baseUrl: config.apiBaseURL,
    init: {
        headers: {
            append: "Authorization: Bearer " + config.apiToken,
        },
    },
});

export default fetcher;
