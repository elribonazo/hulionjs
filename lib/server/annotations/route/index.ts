/**
 * Annotation that adds a middleware to a controller
 * All the routes inside will run it.
 * @param {*} middleware 
 */

import { ServerMiddleware } from '../../../interfaces';

export function middleware(middleware: ServerMiddleware) {
    return function decorator(target: any) {
        if (!target.middlewares) {
            target.middlewares = [];
        }
        target.middlewares.push(middleware);
    };
}

export function resource(resource: string) {
    return function decorator(target: any) {
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

        const methods = Reflect.ownKeys(target.prototype).filter(
            (method: any) => avoidMethods.indexOf(method) === -1
        );

        routes.push(...methods.map(method => ({ name: method })));

        target.routes = routes;
    };
}