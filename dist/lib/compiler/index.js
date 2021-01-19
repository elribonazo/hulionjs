"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compiler = exports.buildPluginConfig = exports.buildConfig = exports.isomorphicConfig = void 0;
const chalk_1 = __importDefault(require("chalk"));
const webpack_1 = __importDefault(require("webpack"));
const path_1 = __importDefault(require("path"));
const babel_1 = __importDefault(require("react-lazy-ssr/babel"));
const autoprefixer_1 = __importDefault(require("autoprefixer"));
const case_sensitive_paths_webpack_plugin_1 = __importDefault(require("case-sensitive-paths-webpack-plugin"));
const eslintFormatter_1 = __importDefault(require("react-dev-utils/eslintFormatter"));
const lodash_webpack_plugin_1 = __importDefault(require("lodash-webpack-plugin"));
const error_overlay_webpack_plugin_1 = __importDefault(require("error-overlay-webpack-plugin"));
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const webpack_manifest_plugin_1 = __importDefault(require("webpack-manifest-plugin"));
const terser_webpack_plugin_1 = __importDefault(require("terser-webpack-plugin"));
const optimize_css_assets_webpack_plugin_1 = __importDefault(require("optimize-css-assets-webpack-plugin"));
const webpack_bundle_analyzer_1 = require("webpack-bundle-analyzer");
const webpack_2 = __importDefault(require("react-lazy-ssr/webpack"));
const clean_webpack_plugin_1 = require("clean-webpack-plugin");
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const preload_webpack_plugin_1 = __importDefault(require("@furic-zhao/preload-webpack-plugin"));
const plugin_1 = __importDefault(require("webpack-isomorphic-tools/plugin"));
exports.isomorphicConfig = {
    webpack_assets_file_path: path_1.default.resolve(process.cwd(), './build/webpack-assets.json'),
    assets: {
        images: {
            extensions: ['png', 'jpg', 'gif', 'ico', 'svg']
        }
    }
};
const buildConfig = ({ inputPath, css }) => {
    return (envType) => {
        const IS_DEV = envType !== 'production';
        const IS_PROD = envType === 'production';
        const cssFiles = (css === null || css === void 0 ? void 0 : css.includes) || [];
        const webpackIsomorphicToolsPlugin = new plugin_1.default(exports.isomorphicConfig);
        const webpackConfig = {
            context: path_1.default.resolve(inputPath, "./ui"),
            mode: envType,
            watch: IS_DEV,
            devtool: IS_DEV ? 'cheap-module-source-map' : 'source-map',
            entry: IS_DEV
                ? [
                    'webpack-hot-middleware/client?path=/__webpack_hmr&reload=true&noinfo=true',
                    path_1.default.resolve(inputPath, './ui/browser.js')
                ]
                : {
                    polyfills: path_1.default.resolve(inputPath, './ui/polyfills.ts'),
                    main: path_1.default.resolve(inputPath, './ui/browser.js')
                },
            output: IS_DEV
                ? {
                    path: path_1.default.resolve(inputPath, './build'),
                    filename: '[name].bundle.js',
                    chunkFilename: '[name].chunk.js',
                    publicPath: '/'
                }
                : {
                    path: path_1.default.resolve(inputPath, './build'),
                    filename: 'static/js/[name].[chunkhash:8].js',
                    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
                    publicPath: '/'
                },
            externals: {
                react: 'react'
            },
            module: {
                rules: [
                    // ESLint
                    {
                        test: /\.(js|jsx|ts|tsx)$/,
                        enforce: 'pre',
                        use: [
                            {
                                options: {
                                    formatter: eslintFormatter_1.default
                                },
                                loader: 'eslint-loader'
                            }
                        ],
                        include: path_1.default.resolve(inputPath, './'),
                        exclude: [
                            path_1.default.resolve(inputPath, "./node_modules/mongoose"),
                        ]
                    },
                    // Babel
                    {
                        test: /\.(js|jsx|ts|tsx)$/,
                        include: path_1.default.resolve(inputPath, './'),
                        loader: 'babel-loader',
                        exclude: [
                            path_1.default.resolve(inputPath, "./node_modules/mongoose"),
                        ],
                        options: {
                            cacheDirectory: IS_DEV,
                            compact: IS_PROD,
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
                                '@babel/plugin-syntax-jsx',
                                '@babel/plugin-transform-runtime',
                                ['@babel/plugin-proposal-decorators', { legacy: true }],
                                '@babel/plugin-proposal-object-rest-spread',
                                '@babel/plugin-transform-spread',
                                '@babel/plugin-proposal-class-properties',
                                '@babel/plugin-proposal-optional-chaining',
                                '@babel/plugin-syntax-dynamic-import',
                                [babel_1.default, { rootPath: inputPath }]
                            ]
                        }
                    },
                    {
                        test: /\.(scss)$/,
                        include: [
                            path_1.default.resolve(inputPath, './ui'),
                            ...cssFiles
                        ],
                        use: [
                            mini_css_extract_plugin_1.default.loader,
                            'css-loader',
                            {
                                loader: 'postcss-loader',
                                options: {
                                    ident: 'postcss',
                                    plugins: () => [
                                        require('tailwindcss'),
                                        require('postcss-flexbugs-fixes'),
                                        autoprefixer_1.default({
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
                            path_1.default.resolve(inputPath, './ui'),
                            ...cssFiles
                        ],
                        use: [
                            mini_css_extract_plugin_1.default.loader,
                            'css-loader',
                            {
                                loader: 'postcss-loader',
                                options: {
                                    ident: 'postcss',
                                    plugins: () => [
                                        require('tailwindcss'),
                                        require('postcss-flexbugs-fixes'),
                                        autoprefixer_1.default({
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
                        include: path_1.default.resolve(inputPath, './'),
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
                        new terser_webpack_plugin_1.default({
                            parallel: true,
                            cache: false
                        }),
                        new optimize_css_assets_webpack_plugin_1.default({})
                    ]
                },
            plugins: [
                IS_PROD && new clean_webpack_plugin_1.CleanWebpackPlugin(),
                /**
                 * BUG - no env settings for webpack
                 */
                //new webpack.DefinePlugin(env.forWebpackDefinePlugin),
                new webpack_1.default.IgnorePlugin(/^\.\/locale$/, /moment$/),
                new lodash_webpack_plugin_1.default(),
                IS_DEV && new webpack_1.default.HotModuleReplacementPlugin(),
                IS_DEV && new case_sensitive_paths_webpack_plugin_1.default(),
                IS_DEV && new error_overlay_webpack_plugin_1.default(),
                webpackIsomorphicToolsPlugin,
                new mini_css_extract_plugin_1.default({
                    filename: 'static/css/[name].[contenthash:8].css'
                }),
                IS_PROD && new webpack_manifest_plugin_1.default({ fileName: 'asset-manifest.json' }),
                new webpack_2.default(),
                new html_webpack_plugin_1.default({
                    inject: false,
                    file: 'main.html',
                    templateContent: ({ htmlWebpackPlugin }) => {
                        return require('fs')
                            .readFileSync(path_1.default.resolve(inputPath, "./ui/index.html"))
                            .toString()
                            .replace(/\[\[SMW_WEBPACK_HEAD\]\]/gim, htmlWebpackPlugin.tags.headTags);
                    }
                }),
                new preload_webpack_plugin_1.default({
                    rel: 'preload',
                    as(entry) {
                        if (/\.css$/.test(entry))
                            return 'style';
                        if (/\.woff$/.test(entry))
                            return 'font';
                        if (/\.png$/.test(entry))
                            return 'image';
                        return 'script';
                    },
                    include: 'initial',
                    fileBlacklist: [/\.(json|map)/]
                }),
                IS_DEV && new webpack_bundle_analyzer_1.BundleAnalyzerPlugin({ analyzerMode: 'json' })
            ].filter(Boolean),
            node: {
                dgram: 'empty',
                fs: 'empty',
                net: 'empty',
                tls: 'empty'
            },
            resolve: {
                extensions: ['.jsx', '.js', 'ts', 'tsx'],
                alias: {
                    //This are the packages that the plugins can used  
                    'remote-component.config.js': path_1.default.resolve(__dirname, './remoteConfig.js')
                }
            },
            stats: 'none'
        };
        return webpackConfig;
    };
};
exports.buildConfig = buildConfig;
const buildPluginConfig = (PLUGIN_PATH, PLUGIN_PATH_OUTPUT = PLUGIN_PATH) => {
    return {
        mode: 'production',
        entry: {
            index: path_1.default.resolve(PLUGIN_PATH, './index.js')
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
                            [babel_1.default, { rootPath: PLUGIN_PATH }]
                        ]
                    }
                }
            ]
        }
    };
};
exports.buildPluginConfig = buildPluginConfig;
class Compiler {
    async compile({ config, method = 'compile' }) {
        try {
            console.log(chalk_1.default.blue('\n\tCreating build...\n'));
            const clientCompiler = webpack_1.default(config);
            const methods = this;
            await methods[method](clientCompiler);
            return Promise.resolve();
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    async build(clientCompiler) {
        try {
            return new Promise((resolve, reject) => {
                clientCompiler.run((err, stats) => {
                    if (err || stats.compilation.errors.length > 0) {
                        return reject(err || stats.compilation.errors);
                    }
                    else {
                        console.log(chalk_1.default.white('✓ Client webpack build complete'));
                    }
                    return resolve(null);
                });
            });
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    async watch(clientCompiler) {
        try {
            return new Promise((resolve, reject) => {
                clientCompiler.watch({ stats: 'minimal' }, (err, stats) => {
                    if (err) {
                        return reject(err);
                    }
                    else {
                        console.log(chalk_1.default.white('✓ Client webpack build complete'));
                    }
                    const info = stats.toJson();
                    if (stats.hasErrors()) {
                        console.error(info.errors);
                    }
                    if (stats.hasWarnings()) {
                        console.warn(info.warnings);
                    }
                    return resolve(null);
                });
            });
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    async printResult({ stats, previousFileSizes, warnings }) {
        try {
            //Can print stats, bundle size, etc
            console.log();
            return Promise.resolve();
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
}
exports.Compiler = Compiler;
//# sourceMappingURL=index.js.map