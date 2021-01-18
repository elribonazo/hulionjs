"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexHtml = void 0;
const fs_1 = __importDefault(require("fs"));
const env = {
    forIndexHtml: 1
};
const indexHtml = ({ helmet, markup, scriptTags, stylesHtml, ssr, file }) => {
    const contents = fs_1.default.readFileSync(file).toString();
    const htmlAttrs = helmet.htmlAttributes.toString();
    const bodyAttrs = helmet.bodyAttributes.toString();
    return contents
        .replace(/\[\[SMW_HEAD\]\]/gim, `
  ${helmet.title.toString()}
  ${helmet.meta.toString()}
  ${stylesHtml}
  `)
        .replace(/\[\[SMW_MARKUP\]\]/gim, markup.replace(/<!-- -->/gim, ''))
        .replace(/\[\[SMW_SCRIPTS\]\]/gim, `
    <script>
        window.process = ${env.forIndexHtml};
        window.__SERVER_DATA__ = ${JSON.stringify(ssr)}
      </script>
    ${scriptTags}
    `)
        .replace(/\[\[SMW_HTML_ATTRS\]\]/gim, htmlAttrs)
        .replace(/\[\[SMW_BODY_ATTRS\]\]/gim, bodyAttrs);
};
exports.indexHtml = indexHtml;
//# sourceMappingURL=indexHtml.js.map