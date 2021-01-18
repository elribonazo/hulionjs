import dotenv from 'dotenv';

const config = dotenv.config();

const isInteractive = process?.stdout?.isTTY || false;

export const ENV = process.env.NODE_ENV || config?.parsed?.NODE_ENV || 'local';
export const PUBLIC_URL =
    process.env.PUBLIC_URL || config?.parsed?.PUBLIC_URL || '';
export const HOST = process.env.HOST || config?.parsed?.HOST || 'localhost';
export const DEFAULT_PORT = process.env.PORT || config?.parsed?.PORT || 4000;
export const ENABLE_MULTICORE = process.env.MULTICORE
    ? process.env.MULTICORE
    : config?.parsed?.MULTICORE
        ? config?.parsed?.MULTICORE
        : false;
export const ENABLE_BUILD = process.env.BUILD
    ? process.env.BUILD
    : config?.parsed?.BUILD
        ? config?.parsed?.BUILD
        : false;
export const IS_INTERACTIVE = isInteractive;
export const NAME =
    process.env.SERVICE_NAME || config?.parsed?.SERVICE_NAME || 'SMW';

export const DOMAIN = process.env.DOMAIN || `http://${HOST}:${DEFAULT_PORT}`;
export const EXPOSE = process.env.EXPOSE || DOMAIN;

export const PLUGIN_URL = `${EXPOSE}/plugin/dist/index.js`;

export const ENABLE_HYDRATE_SPINNER = process.env.SPINNER
    ? process.env.SPINNER
    : config?.parsed?.SPINNER
        ? config?.parsed?.SPINNER
        : true;

export const SECRET = 'ui-secret';

export const WHITELIST = [
    DOMAIN,
    DOMAIN.replace("http:", "https:")
];