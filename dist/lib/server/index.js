"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listen = exports.getServerAddress = exports.loadBeforeListen = exports.attachController = exports.loadMiddlewares = exports.setConfig = exports.setHook = void 0;
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const response_time_1 = __importDefault(require("response-time"));
const body_parser_1 = __importDefault(require("body-parser"));
const chalk_1 = __importDefault(require("chalk"));
const http_status_1 = __importDefault(require("http-status"));
const cors_1 = __importDefault(require("cors"));
const routing_1 = require("./routing");
const server = express_1.default();
const hooks = {};
const options = { config: {} };
const router = express_1.default.Router();
async function setHook(name, func) {
    try {
        hooks[name] = func;
        return Promise.resolve();
    }
    catch (err) {
        return Promise.reject(err);
    }
}
exports.setHook = setHook;
function setConfig(config = {}) {
    Object.keys(config).forEach((key) => {
        options.config[key] = config[key];
    });
}
exports.setConfig = setConfig;
async function loadMiddlewares() {
    try {
        if (hooks.beforeAppMiddlewares) {
            await hooks.beforeAppMiddlewares(server);
        }
        server.use(cors_1.default((req, callback) => {
            var _a;
            callback(null, {
                origin: ((_a = options.config.WHITELIST) !== null && _a !== void 0 ? _a : '').indexOf(req.header('Origin')) !== -1
            });
        }));
        server.use(compression_1.default());
        server.use(helmet_1.default());
        server.use(body_parser_1.default.json());
        server.use(morgan_1.default('tiny'));
        if (hooks.afterAppMiddlewares) {
            await hooks.afterAppMiddlewares(server);
        }
    }
    catch (err) {
        return Promise.reject(err);
    }
}
exports.loadMiddlewares = loadMiddlewares;
async function attachController(controller) {
    var _a;
    if (controller === null || controller === void 0 ? void 0 : controller.default) {
        const routes = ((_a = controller === null || controller === void 0 ? void 0 : controller.default) === null || _a === void 0 ? void 0 : _a.routes) || [];
        routes.forEach(({ fn, method, name, url, resource }) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            const globalMiddlewares = ((_a = controller === null || controller === void 0 ? void 0 : controller.default) === null || _a === void 0 ? void 0 : _a.middlewares) || [];
            const middlewares = ((_d = (_c = (_b = controller === null || controller === void 0 ? void 0 : controller.default) === null || _b === void 0 ? void 0 : _b.prototype) === null || _c === void 0 ? void 0 : _c[name]) === null || _d === void 0 ? void 0 : _d.middlewares) || [];
            const safeMethod = method || ((_g = (_f = (_e = controller === null || controller === void 0 ? void 0 : controller.default) === null || _e === void 0 ? void 0 : _e.prototype) === null || _f === void 0 ? void 0 : _f[name]) === null || _g === void 0 ? void 0 : _g.method) || 'get';
            const safeUrl = url || ((_k = (_j = (_h = controller === null || controller === void 0 ? void 0 : controller.default) === null || _h === void 0 ? void 0 : _h.prototype) === null || _j === void 0 ? void 0 : _j[name]) === null || _k === void 0 ? void 0 : _k.url);
            const safeFn = fn || ((_m = (_l = controller === null || controller === void 0 ? void 0 : controller.default) === null || _l === void 0 ? void 0 : _l.prototype) === null || _m === void 0 ? void 0 : _m[name]);
            if (safeFn && safeUrl && safeMethod) {
                server.use('/', router[safeMethod](!resource ? safeUrl : `/api${safeUrl}`, ...[
                    ...globalMiddlewares,
                    ...middlewares,
                    (req, res, next) => routing_1.wrapper(safeFn, controller === null || controller === void 0 ? void 0 : controller.default, req, res, next)
                ]));
            }
        });
    }
    else {
        Object.values(controller).forEach((instance) => {
            var _a, _b, _c, _d;
            const globalMiddlewares = ((_a = instance === null || instance === void 0 ? void 0 : instance.prototype) === null || _a === void 0 ? void 0 : _a.middlewares) || [];
            const middlewares = ((_c = (_b = instance === null || instance === void 0 ? void 0 : instance.prototype) === null || _b === void 0 ? void 0 : _b.response) === null || _c === void 0 ? void 0 : _c.middlewares) || [];
            const safeFn = (_d = instance === null || instance === void 0 ? void 0 : instance.prototype) === null || _d === void 0 ? void 0 : _d.response;
            if (instance.method && instance.url && safeFn) {
                server.use('/', router[(instance === null || instance === void 0 ? void 0 : instance.method) || 'get'](`${instance.url}`, ...[
                    ...globalMiddlewares,
                    ...middlewares,
                    (req, res, next) => routing_1.wrapper(safeFn, instance, req, res, next)
                ]));
            }
        });
    }
}
exports.attachController = attachController;
async function loadBeforeListen() {
    if (hooks.beforeListen) {
        await hooks.beforeListen(server);
    }
    server.use(response_time_1.default((_req, res, time) => {
        res.setHeader('X-Response-Time', time.toFixed(2) + 'ms');
        res.setHeader('Server-Timing', `renderMiddleware;dur=${time}`);
    }));
    server.use(async (err, _req, res, _next) => {
        const response = {
            code: err.status,
            message: err.message || http_status_1.default[err.status],
            errors: err.errors,
            stack: err.stack
        };
        console.log('error', response);
        if (options.config.ENV === 'production') {
            delete response.stack;
        }
        res.status((err === null || err === void 0 ? void 0 : err.status) || 500);
        res.json(response);
        res.end();
    });
    if (hooks.afterListen) {
        await hooks.afterListen(server);
    }
}
exports.loadBeforeListen = loadBeforeListen;
async function getServerAddress(options) {
    try {
        return Promise.resolve({ hostname: options.host, port: options.port });
    }
    catch (err) {
        return Promise.reject(err);
    }
}
exports.getServerAddress = getServerAddress;
async function listen(options) {
    return new Promise(async (resolve, reject) => {
        try {
            await loadBeforeListen();
            const { port } = await getServerAddress(options);
            server.listen(port, (err = null) => {
                if (err) {
                    return reject(err);
                }
                console.log(chalk_1.default.blue(`Running locally on port ${port}`));
                return resolve(null);
            });
        }
        catch (err) {
            return reject(err);
        }
    });
}
exports.listen = listen;
//# sourceMappingURL=index.js.map