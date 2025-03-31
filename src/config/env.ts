import { cleanEnv, port, str, url } from "envalid";

export const env = cleanEnv(process.env, {
    LOGTO_BASE_URL: url({
        default: "https://0zyxhw.logto.app"
    }),
    LOGTO_AUDIENCE: url({
        default: "https://pontuai-api.kontact.com.br"
    }),
    DATABASE_HOST: str({
        default: 'localhost',
    }),
    DATABASE_PORT: port({
        default: 5432,
    }),
    DATABASE_USER: str({
        default: 'pontuai',
    }),
    DATABASE_PASSWORD: str({
        default: 'password',
    }),
    DATABASE_NAME: str({
        default: 'pontuai',
    }),
    APP_PORT: port({
        default: 3001,
    }),
}) 