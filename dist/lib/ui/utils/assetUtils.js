"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imagePath = void 0;
// We can use "process.env.VAR_NAME" on both the server and the client.
// See config/env.js and server/indexHtml.js
function imagePath(assetName) {
    return `${process.env.PUBLIC_URL}/images/${assetName}`;
}
exports.imagePath = imagePath;
//# sourceMappingURL=assetUtils.js.map