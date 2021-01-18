import React from 'react';
import { renderToStringAsync } from 'react-async-ssr';
import Helmet from 'react-helmet';
import { ChunkExtractor } from 'react-lazy-ssr/server';

import { StaticRouter } from 'react-router-dom';



import { indexHtml } from './indexHtml';

async function render(req: any, res: any, ssr: any) {
    try {
        const App = require('smw/app');
        const { ServerDataProvider } = require('smw-state/serverDataContext');
        const Default = App.default;
        const chunkExtractor = new ChunkExtractor({
            stats: require('smw-build/reactLazySsrStats.json')
        });

        const url = req.url.replace('/index.html', '/');
        const appContext = {};
        const CollectedApp = chunkExtractor.collectChunks(
            <ServerDataProvider value={ssr}>
                <StaticRouter location={url} context={appContext} >
                    <Default req={req} res={res} ssr={ssr} />
                </StaticRouter>
            </ServerDataProvider>
        );

        req.ssr = ssr;
        const markup = await renderToStringAsync(CollectedApp);

        if (process.env.NODE_ENV !== 'production') {
            (global as any).webpackIsomorphicTools.refresh();
        }

        const { _entryPoints, _chunkFiles } = chunkExtractor;
        const template = ssr.resource.template;

        const entryPoints = [..._entryPoints, template];

        const cssFiles = [];
        for (let i = 0; i < entryPoints.length; i++) {
            const entryPoint = entryPoints[i];
            const currentEntryPointCss = _chunkFiles[entryPoint].filter((file: any) => {
                return /(\.css|\.css\.map)/.test(file);
            });
            for (let m = 0; m < currentEntryPointCss.length; m++) {
                const entryPointCss = currentEntryPointCss[m];
                const indexToRemove = _chunkFiles[entryPoint].findIndex(
                    (file: any) => file === entryPointCss
                );
                if (/\.css$ /.test(entryPointCss)) {
                    cssFiles.push(entryPointCss);
                }
                if (indexToRemove >= 0) {
                    _chunkFiles[entryPoint].splice(indexToRemove, 1);
                }
                _chunkFiles[entryPoint] = _chunkFiles[entryPoint].filter((file: any) => {
                    return !/\.map/.test(file);
                });
            }

        }

        if (process.env.NODE_ENV !== 'production') {
            (global as any).webpackIsomorphicTools.refresh();
        }

        const { assets } = (global as any).webpackIsomorphicTools.assets();

        const scriptsHtml = chunkExtractor.getScriptTags();
        const moreStyles = Object.values(assets).map(
            path => `<link as="image" href="${path}" rel="preload" />`
        );

        return Promise.resolve({ scriptsHtml, moreStyles, markup, appContext });
    } catch (err) {
        return Promise.reject(err);
    }
}

function complete({
    scriptsHtml,
    moreStyles,
    markup,
    appContext,
    filePath,
    ssr,
    res,
    headers
}: any) {
    if (headers) res.set(headers);
    if (appContext.url) {
        return res.redirect(301, appContext.url);
    } else {
        res.set({
            ...(headers || {}),
            'X-Frame-Options': 'ALLOW-FROM https://jribo.kiwi'
        });
        res.status(ssr.status || 200);
        const fullMarkup = indexHtml({
            file: filePath,
            helmet: Helmet.renderStatic(),
            markup: markup,
            scriptTags: scriptsHtml,
            stylesHtml: moreStyles.join('\r\n'),
            ssr: ssr
        });

        return res.send(fullMarkup);
    }
}


export default async (filePath: any, { req, res, ssr, headers }: any, next: any) => {
    let content;
    let hasError = false;
    try {
        content = await render(req, res, ssr);
        return complete({ ...content, filePath, ssr, res, headers });
    } catch (err) {
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
    } finally {
        try {
            if (hasError) {
                content = await render(req, res, ssr);
                return complete({ ...content, filePath, ssr, res, headers });
            }
        } catch (err) {
            console.log('error', err);
            return next(err);
        }
    }
};
