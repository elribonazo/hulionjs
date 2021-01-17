import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import morgan from 'morgan';
import responseTime from 'response-time';
import bodyParser from 'body-parser';
import chalk from 'chalk';
import httpStatus from 'http-status';
import cors from 'cors';

import { wrapper } from './routing';

const server = express();
const hooks = {};
const options = { config: {} };

export async function setHook(name, func) {
    try {
        hooks[name] = func;
        return Promise.resolve();
    } catch (err) {
        return Promise.reject(err);
    }
}

export function setConfig(config = {}) {
    Object.keys(config).forEach((key) => {
        options.config[key] = config[key];
    });
}

export async function loadMiddlewares() {
    try {
        if (hooks.beforeAppMiddlewares) {
            await hooks.beforeAppMiddlewares(server);
        }

        server.use(
            cors((req, callback) => {
                callback(null, {
                    origin: (options.config.WHITELIST ?? '').indexOf(req.header('Origin')) !== -1
                });
            })
        );
        server.use(compression());
        server.use(helmet());
        server.use(bodyParser.json());
        server.use(morgan('tiny'));

        if (hooks.afterAppMiddlewares) {
            await hooks.afterAppMiddlewares(server);
        }
    } catch (err) {
        return Promise.reject(err);
    }
}

export async function attachController(controller) {
    if (controller?.default) {
        const routes = controller?.default?.routes || [];
        routes.forEach(({ fn, method, name, url, resource }) => {
            const globalMiddlewares = controller?.default?.middlewares || [];
            const middlewares =
                controller?.default?.prototype?.[name]?.middlewares || [];
            const safeMethod =
                method || controller?.default?.prototype?.[name]?.method || 'get';
            const safeUrl = url || controller?.default?.prototype?.[name]?.url;
            const safeFn = fn || controller?.default?.prototype?.[name];
            if (safeFn && safeUrl && safeMethod) {
                server.use(
                    '/',
                    express
                        .Router()
                    [safeMethod](
                        !resource ? safeUrl : `/api${safeUrl}`,
                        ...[
                            ...globalMiddlewares,
                            ...middlewares,
                            (req, res, next) =>
                                wrapper(safeFn, controller?.default, req, res, next)
                        ]
                    )
                );
            }
        });
    } else {
        Object.values(controller).forEach(instance => {
            const globalMiddlewares = instance?.prototype?.middlewares || [];
            const middlewares = instance?.prototype?.response?.middlewares || [];
            const safeFn = instance?.prototype?.response;
            if (instance.method && instance.url && safeFn) {
                server.use(
                    '/',
                    express
                        .Router()
                    [instance?.method || 'get'](
                        `${instance.url}`,
                        ...[
                            ...globalMiddlewares,
                            ...middlewares,
                            (req, res, next) => wrapper(safeFn, instance, req, res, next)
                        ]
                    )
                );
            }
        });
    }
}

export async function loadBeforeListen() {
    if (hooks.beforeListen) {
        await hooks.beforeListen(server);
    }

    server.use(
        responseTime((_req, res, time) => {
            res.setHeader('X-Response-Time', time.toFixed(2) + 'ms');
            res.setHeader('Server-Timing', `renderMiddleware;dur=${time}`);
        })
    );

    server.use(async (err, _req, res, _next) => {
        const response = {
            code: err.status,
            message: err.message || httpStatus[err.status],
            errors: err.errors,
            stack: err.stack
        };
        console.log('error', response);
        if (options.config.ENV === 'production') {
            delete response.stack;
        }

        res.status(err?.status || 500);
        res.json(response);
        res.end();
    });

    if (hooks.afterListen) {
        await hooks.afterListen(server);
    }
}


export async function getServerAddress(options) {
    try {
        return Promise.resolve({ hostname: options.host, port: options.port });
    } catch (err) {
        return Promise.reject(err);
    }
}

export async function listen(options) {
    return new Promise(async (resolve, reject) => {
        try {
            await loadBeforeListen();
            const { port } = await getServerAddress(options);

            server.listen(port, err => {
                if (err) {
                    return reject(err);
                }

                console.log(chalk.blue(`Running locally on port ${port}`));
                return resolve();
            });
        } catch (err) {
            return reject(err);
        }
    });
}



