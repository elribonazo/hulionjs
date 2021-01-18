/**
 * Method middlewares
 * @param {*} middleware 
 */
import { ServerMiddleware } from '../../../interfaces';

export function middleware(middleware: ServerMiddleware) {
    return function (target: any, key: any, descriptor: any) {

        if (!descriptor.value.middlewares) {
            descriptor.value.middlewares = [];
        }
        descriptor.value.middlewares.push(middleware);

        return descriptor;
    };
}
