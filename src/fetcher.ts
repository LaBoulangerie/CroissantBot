import { paths } from "./types/api";
import { Fetcher } from "openapi-typescript-fetch";
import config from "./config";

const fetcher = Fetcher.for<paths>();
fetcher.configure({
    baseUrl: config.apiBaseURL,
});

export default fetcher;
