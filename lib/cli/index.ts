import fs from 'fs';
import path from 'path';
import { Compiler, buildPluginConfig } from '@smw-project/compiler';

export async function start() {
    try {
        const [, , COMMAND, ...args] = process.argv;
        if (!COMMAND) throw new Error("No command");

        switch (COMMAND) {
            case 'help':
                console.log("Commands:\r\n\r\nHelp\r\nStart\r\nBuild\r\nBuild-Plugin");
                break;
            case 'init':
                //Run a script in order to install the framework with a custom Version on a path
                /**
                 * Make folder checks
                 * Create package json
                 * Install dependencies
                 * 
                 * Create dummy directories
                 */


                break;
            case 'build-plugin':
                const [ROOT, ROOT_OUTPUT] = args;
                const PLUGINROOT = path.resolve(process.cwd(), ROOT || './');

                if (!fs.existsSync(PLUGINROOT)) {
                    throw new Error(`The file ${PLUGINROOT} could not be found`);
                }

                const webpackConfig = buildPluginConfig(PLUGINROOT, ROOT_OUTPUT);
                console.log(JSON.stringify(webpackConfig));

                await Compiler.compile({
                    config: webpackConfig,
                    fromPlugin: true,
                    method: 'build'
                });

                break;
            default:
                throw new Error("Command not recognized.");
        }
    } catch (err) {
        console.log('debug', err);
        process.exit(0);
    }
}