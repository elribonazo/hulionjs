"use strict";
/**
 * Annotation that adds a middleware to a controller
 * All the routes inside will run it.
 * @param {*} middleware
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.resource = exports.middleware = void 0;
function middleware(middleware) {
    return function decorator(target) {
        if (!target.middlewares) {
            target.middlewares = [];
        }
        target.middlewares.push(middleware);
    };
}
exports.middleware = middleware;
function resource(resource) {
    return function decorator(target) {
        const routes = [];
        const { get, getOne, create, update, remove } = target.prototype;
        const avoidMethods = [
            'get',
            'getOne',
            'create',
            'update',
            'remove',
            'constructor'
        ];
        if (get) {
            routes.push({
                name: `get`,
                method: 'get',
                url: `/${resource}`,
                fn: Reflect.get(target.prototype, 'get')
            });
        }
        if (getOne) {
            routes.push({
                name: `getOne`,
                method: 'get',
                url: `/${resource}/:resourceId`,
                fn: Reflect.get(target.prototype, 'getOne')
            });
        }
        if (create) {
            routes.push({
                name: `create`,
                method: 'post',
                url: `/${resource}`,
                fn: Reflect.get(target.prototype, 'create')
            });
        }
        if (update) {
            routes.push({
                name: `update`,
                method: 'put',
                url: `/${resource}/:resourceId`,
                fn: Reflect.get(target.prototype, 'update')
            });
        }
        if (remove) {
            routes.push({
                name: `delete`,
                method: 'delete',
                url: `/${resource}/:resourceId`,
                fn: Reflect.get(target.prototype, 'remove')
            });
        }
        const methods = Reflect.ownKeys(target.prototype).filter((method) => avoidMethods.indexOf(method) === -1);
        routes.push(...methods.map(method => ({ name: method })));
        target.routes = routes;
    };
}
exports.resource = resource;
//# sourceMappingURL=index.js.map