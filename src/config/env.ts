import { cleanEnv, url } from "envalid";

export const env = cleanEnv(process.env, {
    LOGTO_BASE_URL: url({}),
    LOGTO_AUDIENCE: url({})
}) 