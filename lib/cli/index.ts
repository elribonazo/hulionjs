import fs from 'fs';
import path from 'path';
import { Compiler, buildPluginConfig, buildConfig } from '../compiler';

export async function start() {
    try {
        const compiler = new Compiler()
        const [, , COMMAND, ...args] = process.argv;
        if (!COMMAND) throw new Error("No command");

        const [ROOT, ...restArgs] = args;


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
                const [ROOT_OUTPUT] = restArgs;
                const PLUGINROOT = path.resolve(process.cwd(), ROOT || './');

                if (!fs.existsSync(PLUGINROOT)) {
                    throw new Error(`The file ${PLUGINROOT} could not be found`);
                }

                await compiler.compile({
                    config: buildPluginConfig(PLUGINROOT, ROOT_OUTPUT),
                    fromPlugin: true,
                    method: 'build'
                });

                break;
            case 'build':
                const [ENV] = restArgs;
                const WEBROOT = path.resolve(process.cwd(), ROOT || './');

                if (!fs.existsSync(WEBROOT)) {
                    throw new Error(`The file ${WEBROOT} could not be found`);
                }

                await compiler.compile({
                    config: buildConfig({
                        inputPath: WEBROOT
                    })(ENV as any),
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