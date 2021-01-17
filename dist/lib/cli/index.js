"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const compiler_1 = require("@smw-project/compiler");
async function start() {
    try {
        const [, , COMMAND, ...args] = process.argv;
        if (!COMMAND)
            throw new Error("No command");
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
                const PLUGINROOT = path_1.default.resolve(process.cwd(), ROOT || './');
                if (!fs_1.default.existsSync(PLUGINROOT)) {
                    throw new Error(`The file ${PLUGINROOT} could not be found`);
                }
                const webpackConfig = compiler_1.buildPluginConfig(PLUGINROOT, ROOT_OUTPUT);
                console.log(JSON.stringify(webpackConfig));
                await compiler_1.Compiler.compile({
                    config: webpackConfig,
                    fromPlugin: true,
                    method: 'build'
                });
                break;
            default:
                throw new Error("Command not recognized.");
        }
    }
    catch (err) {
        console.log('debug', err);
        process.exit(0);
    }
}
exports.start = start;
//# sourceMappingURL=index.js.map