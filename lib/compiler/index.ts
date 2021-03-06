import chalk from 'chalk';
import webpack from 'webpack';
import path from 'path';
import LazyPlugin from 'react-lazy-ssr/babel';
import autoprefixer from 'autoprefixer';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import eslintFormatter from 'react-dev-utils/eslintFormatter';
import LodashModuleReplacementPlugin from 'lodash-webpack-plugin';
import ErrorOverlayPlugin from 'error-overlay-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ManifestPlugin from 'webpack-manifest-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import ReactLazySsrPlugin from 'react-lazy-ssr/webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import PreloadWebpackPlugin from '@furic-zhao/preload-webpack-plugin';
import WebpackIsomorphicToolsPlugin from 'webpack-isomorphic-tools/plugin';

import { getAppEnv } from './env';

interface buildConfigCssType {
    includes: Array<string>
}

interface buildConfigType {
    inputPath: string,
    css?: buildConfigCssType,
    extendWebpackConfig?: any
}

interface CompilerCompileType {
    config: any,
    fromPlugin?: boolean,
    method: any
}


const env = getAppEnv();

export const isomorphicConfig = {
    webpack_assets_file_path: path.resolve(
        process.cwd(),
        './build/webpack-assets.json'
    ),
    assets: {
        images: {
            extensions: ['png', 'jpg', 'gif', 'ico', 'svg']
        }
    }
};

export const buildConfig = ({
    inputPath,
    css,
    extendWebpackConfig = {}
}: buildConfigType) => {

    return (envType: "production" | "development" | "none" | undefined) => {
        const IS_DEV = envType !== 'production';
        const IS_PROD = envType === 'production';
        const cssFiles = css?.includes || [];
        const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(
            isomorphicConfig
        );
        const entry = IS_DEV
            ? [
                'webpack-hot-middleware/client?path=/__webpack_hmr&reload=true&noinfo=true',
                path.resolve(inputPath, './ui/browser.js')
            ]
            : {
                polyfills: path.resolve(__dirname, '../ui/polyfills.ts'),
                main: path.resolve(inputPath, './ui/browser.js')
            };
        console.log(chalk.blue('✓ Client webpack entry point is( ' + JSON.stringify(entry)));
        const webpackConfig: any = {
            mode: envType,
            watch: IS_DEV,
            devtool: IS_DEV ? 'cheap-module-source-map' : 'source-map',
            entry: entry,
            output: IS_DEV
                ? {
                    path: path.resolve(inputPath, './build'),
                    filename: '[name].bundle.js',
                    chunkFilename: '[name].chunk.js',
                    publicPath: '/'
                }
                : {
                    path: path.resolve(inputPath, './build'),
                    filename: 'static/js/[name].[chunkhash:8].js',
                    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
                    publicPath: '/'
                },
            externals: {
                react: 'react'
            },
            module: {
                rules: [
                    {
                        test: /\.(js|jsx|ts|tsx)$/,
                        enforce: 'pre',
                        use: [
                            {
                                options: {
                                    formatter: eslintFormatter
                                },
                                loader: 'eslint-loader'
                            }
                        ],
                        include: path.resolve(inputPath, './'),
                        exclude: [
                            path.resolve(inputPath, './node_modules')
                        ],
                    },
                    // Babel
                    {
                        test: /\.ts$/,
                        use: [{
                            loader: 'ts-loader',
                            options: {
                                configFile: path.resolve(inputPath, "./tsconfig.react.json")
                            }
                        }],
                        exclude: /node_modules/,
                    },
                    {
                        test: /\.(scss)$/,
                        include: [
                            path.resolve(inputPath, './ui'),
                            ...cssFiles
                        ],
                        exclude: [
                            path.resolve(inputPath, './node_modules'),
                        ],
                        use: [
                            MiniCssExtractPlugin.loader,
                            'css-loader',
                            {
                                loader: 'postcss-loader',
                                options: {
                                    ident: 'postcss',
                                    plugins: () => [
                                        require('tailwindcss'),
                                        require('postcss-flexbugs-fixes'),
                                        autoprefixer({
                                            flexbox: 'no-2009'
                                        })
                                    ]
                                }
                            },
                            'sass-loader',
                            'import-glob-loader'
                        ].filter(Boolean)
                    },
                    {
                        test: /\.(css)$/,
                        include: [
                            path.resolve(inputPath, './ui'),
                            ...cssFiles
                        ],
                        exclude: [
                            path.resolve(inputPath, './node_modules'),
                        ],
                        use: [
                            MiniCssExtractPlugin.loader,
                            'css-loader',
                            {
                                loader: 'postcss-loader',
                                options: {
                                    ident: 'postcss',
                                    plugins: () => [
                                        require('tailwindcss'),
                                        require('postcss-flexbugs-fixes'),
                                        autoprefixer({
                                            flexbox: 'no-2009'
                                        })
                                    ]
                                }
                            },
                            'import-glob-loader'
                        ].filter(Boolean)
                    },
                    {
                        test: webpackIsomorphicToolsPlugin.regularExpression('images'),
                        loader: 'file-loader',
                        include: path.resolve(inputPath, './ui'),
                        exclude: [
                            path.resolve(inputPath, './node_modules'),
                        ],
                        options: {
                            name: '[path][name].[ext]',
                            context: 'src',
                            esModule: false
                        }
                    },
                    // {
                    //     test: webpackIsomorphicToolsPlugin.regularExpression('images'),
                    //     include: path.resolve(inputPath, './'),
                    //     use: [
                    //         {
                    //             loader: 'image-webp-loader',
                    //             options: {
                    //                 outputPath: path.resolve(inputPath, "./"),
                    //                 name: '[path][name].[ext]'
                    //             }
                    //         }
                    //     ]
                    // },
                    {
                        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                        exclude: [
                            path.resolve(inputPath, './node_modules'),
                        ],
                        use: [
                            {
                                loader: 'file-loader',
                                options: {
                                    name: '[name].[ext]',
                                    outputPath: 'fonts/'
                                }
                            }
                        ]
                    },

                ].filter(Boolean)
            },
            optimization: IS_DEV
                ? {}
                : {
                    minimize: true,
                    minimizer: [
                        new TerserPlugin({
                            parallel: true,
                            cache: false
                        }),
                        new OptimizeCSSAssetsPlugin({})
                    ]
                },
            plugins: [
                IS_PROD && new CleanWebpackPlugin(),
                new webpack.DefinePlugin(env.forWebpackDefinePlugin),
                new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
                new LodashModuleReplacementPlugin(),
                IS_DEV && new webpack.HotModuleReplacementPlugin(),
                IS_DEV && new CaseSensitivePathsPlugin(),
                IS_DEV && new ErrorOverlayPlugin(),
                webpackIsomorphicToolsPlugin,
                new MiniCssExtractPlugin({
                    filename: 'static/css/[name].[contenthash:8].css'
                }),
                IS_PROD && new ManifestPlugin({ fileName: 'asset-manifest.json' }),
                new ReactLazySsrPlugin(),
                new HtmlWebpackPlugin({
                    inject: false,
                    file: 'main.html',
                    templateContent: ({ htmlWebpackPlugin }) => {
                        return `<!doctype html>
                        <html lang="en" [[HULIONJS_HTML_ATTRS]]>
                        <head>
                            <meta charset="utf-8">
                            <base href="/">
                            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0">
                            [[HULIONJS_HEAD]]
                            [[HULIONJS_WEBPACK_HEAD]]
                            <style>
                                #root {
                                    background-color: white !important;
                                }
                            </style>
                        </head>
                        <body[[HULIONJS_BODY_ATTRS]]>
                            <div id="root">[[HULIONJS_MARKUP]]</div>
                            [[HULIONJS_SCRIPTS]]
                            </body>
                        </html>`
                            .replace(
                                /\[\[HULIONJS_WEBPACK_HEAD\]\]/gim,
                                htmlWebpackPlugin.tags.headTags
                            );
                    }
                }),
                new PreloadWebpackPlugin({
                    rel: 'preload',
                    as(entry: any) {
                        if (/\.css$/.test(entry)) return 'style';
                        if (/\.woff$/.test(entry)) return 'font';
                        if (/\.png$/.test(entry)) return 'image';
                        return 'script';
                    },
                    include: 'initial',
                    fileBlacklist: [/\.(json|map)/]
                }),
                IS_DEV && new BundleAnalyzerPlugin({ analyzerMode: 'json' })
            ].filter(Boolean),
            node: {
                dgram: 'empty',
                fs: 'empty',
                net: 'empty',
                tls: 'empty',
                child_process: "empty"
            },
            resolve: {
                extensions: ['.jsx', '.js', 'ts', 'tsx'],
                alias: {
                    //This are the packages that the plugins can used  
                    'remote-component.config.js': path.resolve(__dirname, './remoteConfig.js')
                }
            },
            stats: 'none',
            ...extendWebpackConfig
        }

        return webpackConfig;
    }
}

export const buildPluginConfig = (PLUGIN_PATH: string, PLUGIN_PATH_OUTPUT: string = PLUGIN_PATH) => {
    return {
        mode: 'production',
        entry: {
            index: path.resolve(PLUGIN_PATH, './index.js')
        },
        output: {
            libraryTarget: 'commonjs',
            path: PLUGIN_PATH_OUTPUT,
            filename: '[name]-out.js',
        },
        externals: {
            react: 'react'
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx|ts|tsx)$/,
                    include: PLUGIN_PATH,
                    exclude: `${PLUGIN_PATH}/build`,
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    targets: {
                                        browsers: ['>1%', 'ie 11', 'not op_mini all']
                                    }
                                }
                            ],
                            '@babel/preset-react'
                        ],
                        plugins: [
                            '@babel/plugin-transform-runtime',
                            ['@babel/plugin-proposal-decorators', { legacy: true }],
                            '@babel/plugin-proposal-object-rest-spread',
                            '@babel/plugin-transform-spread',
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-proposal-optional-chaining',
                            '@babel/plugin-syntax-dynamic-import',
                            [LazyPlugin, { rootPath: PLUGIN_PATH }]
                        ]
                    }
                }
            ]
        }
    }
}

export class Compiler {

    async compile({ config, method = 'compile' }: CompilerCompileType) {
        try {
            console.log(chalk.blue('\n\tCreating build...\n'));
            const clientCompiler = webpack(config);
            const methods: any = this;
            await methods[method](clientCompiler);
            return Promise.resolve();
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async build(clientCompiler: any) {
        try {
            return new Promise((resolve, reject) => {
                clientCompiler.run((err: any, stats: any) => {
                    if (err || stats.compilation.errors.length > 0) {
                        return reject(err || stats.compilation.errors);
                    } else {
                        console.log(chalk.white('✓ Client webpack build complete'));
                    }
                    return resolve(null);
                });
            });
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async watch(clientCompiler: any) {
        try {
            return new Promise((resolve, reject) => {
                clientCompiler.watch({ stats: 'minimal' }, (err: any, stats: any) => {
                    if (err) {
                        return reject(err);
                    } else {
                        console.log(chalk.white('✓ Client webpack build complete'));
                    }

                    const info = stats.toJson();

                    if (stats.hasErrors()) {
                        console.error(info.errors);
                    }

                    if (stats.hasWarnings()) {
                        console.warn(info.warnings);
                    }

                    return resolve(null);
                }
                );
            });
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async printResult({ stats, previousFileSizes, warnings }: any) {
        try {
            //Can print stats, bundle size, etc
            console.log();
            return Promise.resolve();
        } catch (err) {
            return Promise.reject(err);
        }
    }
}

