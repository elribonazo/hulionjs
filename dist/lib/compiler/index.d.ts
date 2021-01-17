export namespace isomorphicConfig {
    const webpack_assets_file_path: string;
    namespace assets {
        namespace images {
            const extensions: string[];
        }
    }
}
export function buildConfig({ inputPath, css }: {
    inputPath: any;
    css: any;
}): (envType: any) => {
    context: string;
    mode: any;
    watch: boolean;
    devTool: string;
    entry: string[] | {
        polyfills: string;
        main: string;
    };
    output: {
        path: string;
        filename: string;
        chunkFilename: string;
        publicPath: string;
    };
    module: {
        rules: ({
            test: RegExp;
            enforce: string;
            use: {
                options: {
                    formatter: any;
                };
                loader: string;
            }[];
            include: string;
            exclude: string[];
            loader?: undefined;
            options?: undefined;
        } | {
            test: RegExp;
            include: any[];
            use: any[];
            enforce?: undefined;
            exclude?: undefined;
            loader?: undefined;
            options?: undefined;
        } | {
            test: any;
            loader: string;
            include: string;
            options: {
                name: string;
                context: string;
                esModule: boolean;
                cacheDirectory?: undefined;
                compact?: undefined;
            };
            enforce?: undefined;
            use?: undefined;
            exclude?: undefined;
        } | {
            test: any;
            include: string;
            use: {
                loader: string;
                options: {
                    outputPath: string;
                    name: string;
                };
            }[];
            enforce?: undefined;
            exclude?: undefined;
            loader?: undefined;
            options?: undefined;
        } | {
            test: RegExp;
            use: {
                loader: string;
                options: {
                    name: string;
                    outputPath: string;
                };
            }[];
            enforce?: undefined;
            include?: undefined;
            exclude?: undefined;
            loader?: undefined;
            options?: undefined;
        } | {
            test: RegExp;
            include: string;
            loader: string;
            exclude: string[];
            options: {
                cacheDirectory: boolean;
                compact: boolean;
                name?: undefined;
                context?: undefined;
                esModule?: undefined;
            };
            enforce?: undefined;
            use?: undefined;
        })[];
    };
    optimization: {
        minimize?: undefined;
        minimizer?: undefined;
    } | {
        minimize: boolean;
        minimizer: any[];
    };
    plugins: any[];
    node: {
        dgram: string;
        fs: string;
        net: string;
        tls: string;
    };
    resolve: {
        alias: {
            'remote-component.config.js': string;
        };
    };
    stats: string;
};
export function buildPluginConfig(PLUGIN_PATH: any, PLUGIN_PATH_OUTPUT?: any): {
    mode: string;
    entry: {
        index: string;
    };
    output: {
        libraryTarget: string;
        path: any;
        filename: string;
    };
    externals: {
        react: string;
    };
    module: {
        rules: {
            test: RegExp;
            include: any;
            exclude: string;
            loader: string;
            options: {
                cacheDirectory: boolean;
                presets: (string | (string | {
                    targets: {
                        browsers: string[];
                    };
                })[])[];
                plugins: (string | any[])[];
            };
        }[];
    };
};
export const Compiler: {
    compile({ config, fromPlugin, method }: {
        config: any;
        fromPlugin?: boolean | undefined;
        method?: string | undefined;
    }): Promise<void>;
    build(clientCompiler: any): Promise<any>;
    watch(clientCompiler: any): Promise<any>;
    printResult({ stats, previousFileSizes, warnings }: {
        stats: any;
        previousFileSizes: any;
        warnings: any;
    }): Promise<void>;
};
