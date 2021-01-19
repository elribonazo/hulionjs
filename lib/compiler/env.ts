const dotenvVars = require('dotenv').config().parsed;


const BAKED_IN_ENV_VARS = ['NODE_ENV', 'PUBLIC_URL', 'VERSION'];

export function getAppEnv() {
    const raw = Object.keys(dotenvVars || {}).reduce(
        (env: any, key) => {
            env[key] = process.env[key];
            return env;
        },
        {
            NODE_ENV: process.env.NODE_ENV,
            PUBLIC_URL: process.env.PUBLIC_URL,
            SPINNER: process.env.SPINNER,
            DOMAIN: process.env.DOMAIN,
            EXPOSE: process.env.EXPOSE || process.env.DOMAIN
        }
    );

    const forWebpackDefinePlugin = {
        'process.env': Object.keys(raw).reduce((env: any, key) => {
            env[key] = JSON.stringify(raw[key]);
            return env;
        }, {})
    };

    const forIndexHtml = JSON.stringify({
        env: raw
    });

    return { raw, forIndexHtml, forWebpackDefinePlugin };
}
