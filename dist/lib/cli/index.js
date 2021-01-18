"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const compiler_1 = require("../compiler");
async function start() {
    try {
        const compiler = new compiler_1.Compiler();
        const [, , COMMAND, ...args] = process.argv;
        if (!COMMAND)
            throw new Error("No command");
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
                const PLUGINROOT = path_1.default.resolve(process.cwd(), ROOT || './');
                if (!fs_1.default.existsSync(PLUGINROOT)) {
                    throw new Error(`The file ${PLUGINROOT} could not be found`);
                }
                await compiler.compile({
                    config: compiler_1.buildPluginConfig(PLUGINROOT, ROOT_OUTPUT),
                    fromPlugin: true,
                    method: 'build'
                });
                break;
            case 'build':
                const [ENV] = restArgs;
                const WEBROOT = path_1.default.resolve(process.cwd(), ROOT || './');
                if (!fs_1.default.existsSync(WEBROOT)) {
                    throw new Error(`The file ${WEBROOT} could not be found`);
                }
                await compiler.compile({
                    config: compiler_1.buildConfig({
                        inputPath: WEBROOT
                    })(ENV),
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