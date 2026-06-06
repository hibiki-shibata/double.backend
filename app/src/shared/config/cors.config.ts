// Doc: https://expressjs.com/en/resources/middleware/cors/
import type { CorsOptions } from "cors";

export const corsConfig: CorsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
}