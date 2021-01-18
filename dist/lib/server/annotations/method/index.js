"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = void 0;
function middleware(middleware) {
    return function (target, key, descriptor) {
        if (!descriptor.value.middlewares) {
            descriptor.value.middlewares = [];
        }
        descriptor.value.middlewares.push(middleware);
        return descriptor;
    };
}
exports.middleware = middleware;
//# sourceMappingURL=index.js.map