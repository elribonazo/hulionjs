"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMiddleware = exports.useMethod = exports.useUrl = exports.api = exports.useResource = exports.SMWController = exports.useReact = exports.useRoute = void 0;
function useRoute(url, method = 'get', middlewares = [], root = false) {
    return function decorator(target) {
        target.method = method;
        target.url = !root ? url : `/api${url}`;
        target.middlewares = middlewares;
    };
}
exports.useRoute = useRoute;
function useReact(App) {
    return function decorator(target) {
        target.App = App;
    };
}
exports.useReact = useReact;
class SMWController {
}
exports.SMWController = SMWController;
function useResource(middleware) {
    return function decorator(target) {
        if (!target.middlewares) {
            target.middlewares = [];
        }
        target.middlewares.push(middleware);
    };
}
exports.useResource = useResource;
function api(resource) {
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
        const methods = Reflect.ownKeys(target.prototype).filter(method => avoidMethods.indexOf(method) === -1);
        routes.push(...methods.map(method => ({ name: method })));
        target.routes = routes;
    };
}
exports.api = api;
function useUrl(url, root = false) {
    return function (target, key, descriptor) {
        descriptor.value.url = `/api${url}`;
        return descriptor;
    };
}
exports.useUrl = useUrl;
function useMethod(method) {
    return function (target, key, descriptor) {
        descriptor.value.method = method;
        return descriptor;
    };
}
exports.useMethod = useMethod;
function useMiddleware(middleware) {
    return function (target, key, descriptor) {
        if (!descriptor.value.middlewares)
            descriptor.value.middlewares = [];
        descriptor.value.middlewares.push(middleware);
        return descriptor;
    };
}
exports.useMiddleware = useMiddleware;
//# sourceMappingURL=index.js.map