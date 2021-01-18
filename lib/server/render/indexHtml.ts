import fs from 'fs';

const env = {
    forIndexHtml: 1
};

export const indexHtml = ({
    helmet,
    markup,
    scriptTags,
    stylesHtml,
    ssr,
    file
}: any) => {
    const contents = fs.readFileSync(file).toString();
    const htmlAttrs = helmet.htmlAttributes.toString();
    const bodyAttrs = helmet.bodyAttributes.toString();
    return contents
        .replace(
            /\[\[SMW_HEAD\]\]/gim,
            `
  ${helmet.title.toString()}
  ${helmet.meta.toString()}
  ${stylesHtml}
  `
        )
        .replace(/\[\[SMW_MARKUP\]\]/gim, markup.replace(/<!-- -->/gim, ''))
        .replace(
            /\[\[SMW_SCRIPTS\]\]/gim,
            `
    <script>
        window.process = ${env.forIndexHtml};
        window.__SERVER_DATA__ = ${JSON.stringify(ssr)}
      </script>
    ${scriptTags}
    `
        )
        .replace(/\[\[SMW_HTML_ATTRS\]\]/gim, htmlAttrs)
        .replace(/\[\[SMW_BODY_ATTRS\]\]/gim, bodyAttrs);
};
