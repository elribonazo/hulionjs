"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_async_ssr_1 = require("react-async-ssr");
const react_helmet_1 = __importDefault(require("react-helmet"));
const server_1 = require("react-lazy-ssr/server");
const react_router_dom_1 = require("react-router-dom");
const indexHtml_1 = require("./indexHtml");
async function render(req, res, ssr) {
    try {
        const App = require('smw/app');
        const { ServerDataProvider } = require('smw-state/serverDataContext');
        const Default = App.default;
        const chunkExtractor = new server_1.ChunkExtractor({
            stats: require('smw-build/reactLazySsrStats.json')
        });
        const url = req.url.replace('/index.html', '/');
        const appContext = {};
        const CollectedApp = chunkExtractor.collectChunks(react_1.default.createElement(ServerDataProvider, { value: ssr },
            react_1.default.createElement(react_router_dom_1.StaticRouter, { location: url, context: appContext },
                react_1.default.createElement(Default, { req: req, res: res, ssr: ssr }))));
        req.ssr = ssr;
        const markup = await react_async_ssr_1.renderToStringAsync(CollectedApp);
        if (process.env.NODE_ENV !== 'production') {
            global.webpackIsomorphicTools.refresh();
        }
        const { _entryPoints, _chunkFiles } = chunkExtractor;
        const template = ssr.resource.template;
        const entryPoints = [..._entryPoints, template];
        const cssFiles = [];
        for (let i = 0; i < entryPoints.length; i++) {
            const entryPoint = entryPoints[i];
            const currentEntryPointCss = _chunkFiles[entryPoint].filter((file) => {
                return /(\.css|\.css\.map)/.test(file);
            });
            for (let m = 0; m < currentEntryPointCss.length; m++) {
                const entryPointCss = currentEntryPointCss[m];
                const indexToRemove = _chunkFiles[entryPoint].findIndex((file) => file === entryPointCss);
                if (/\.css$ /.test(entryPointCss)) {
                    cssFiles.push(entryPointCss);
                }
                if (indexToRemove >= 0) {
                    _chunkFiles[entryPoint].splice(indexToRemove, 1);
                }
                _chunkFiles[entryPoint] = _chunkFiles[entryPoint].filter((file) => {
                    return !/\.map/.test(file);
                });
            }
        }
        if (process.env.NODE_ENV !== 'production') {
            global.webpackIsomorphicTools.refresh();
        }
        const { assets } = global.webpackIsomorphicTools.assets();
        const scriptsHtml = chunkExtractor.getScriptTags();
        const moreStyles = Object.values(assets).map(path => `<link as="image" href="${path}" rel="preload" />`);
        return Promise.resolve({ scriptsHtml, moreStyles, markup, appContext });
    }
    catch (err) {
        return Promise.reject(err);
    }
}
function complete({ scriptsHtml, moreStyles, markup, appContext, filePath, ssr, res, headers }) {
    if (headers)
        res.set(headers);
    if (appContext.url) {
        return res.redirect(301, appContext.url);
    }
    else {
        res.set({
            ...(headers || {}),
            'X-Frame-Options': 'ALLOW-FROM https://jribo.kiwi'
        });
        res.status(ssr.status || 200);
        const fullMarkup = indexHtml_1.indexHtml({
            file: filePath,
            helmet: react_helmet_1.default.renderStatic(),
            markup: markup,
            scriptTags: scriptsHtml,
            stylesHtml: moreStyles.join('\r\n'),
            ssr: ssr
        });
        return res.send(fullMarkup);
    }
}
exports.default = async (filePath, { req, res, ssr, headers }, next) => {
    let content;
    let hasError = false;
    try {
        content = await render(req, res, ssr);
        return complete({ ...content, filePath, ssr, res, headers });
    }
    catch (err) {
        console.log('error', err);
        ssr.status = err.status || 500;
        ssr.resource = {
            slug: req.path,
            template: 'Error',
            title: err.message,
            error: {
                message: err.message,
                code: err.code || 'server_error',
                status: err.status || 500
            }
        };
        hasError = true;
    }
    finally {
        try {
            if (hasError) {
                content = await render(req, res, ssr);
                return complete({ ...content, filePath, ssr, res, headers });
            }
        }
        catch (err) {
            console.log('error', err);
            return next(err);
        }
    }
};
//# sourceMappingURL=engine.js.map