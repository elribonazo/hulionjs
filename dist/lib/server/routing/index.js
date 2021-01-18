"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrapper = void 0;
function wrapper(fn, context, req, res, next) {
    fn.bind(context)(req, res, next).then((data) => {
        var _a, _b, _c, _d;
        try {
            if (!res.finished) {
                const headers = ((_a = data === null || data === void 0 ? void 0 : data.response) === null || _a === void 0 ? void 0 : _a.headers) || false;
                const redirect = ((_b = data === null || data === void 0 ? void 0 : data.response) === null || _b === void 0 ? void 0 : _b.redirect) || false;
                const redirectStatus = ((_c = data === null || data === void 0 ? void 0 : data.response) === null || _c === void 0 ? void 0 : _c.redirectStatus) || 301;
                const ssr = (data === null || data === void 0 ? void 0 : data.ssr) || {};
                const body = (_d = data === null || data === void 0 ? void 0 : data.response) === null || _d === void 0 ? void 0 : _d.body;
                if (redirect && redirectStatus) {
                    res.redirect(redirectStatus, redirect);
                }
                else {
                    if (body) {
                        if (headers) {
                            res.set(headers);
                        }
                        res.json(body);
                    }
                    else {
                        res.render('index', { req, res, ssr, headers });
                    }
                }
            }
            return Promise.resolve();
        }
        catch (err) {
            return next(err);
        }
    });
}
exports.wrapper = wrapper;
//# sourceMappingURL=index.js.map