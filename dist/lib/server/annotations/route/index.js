"use strict";
/**
 * Annotation that adds a middleware to a controller
 * All the routes inside will run it.
 * @param {*} middleware
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = void 0;
function middleware(middleware) {
    return function decorator(target) {
        if (!target.middlewares) {
            target.middlewares = [];
        }
        target.middlewares.push(middleware);
    };
}
exports.middleware = middleware;
//# sourceMappingURL=index.js.map