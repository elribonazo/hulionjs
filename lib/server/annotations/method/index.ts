/**
 * Method middlewares
 * @param {*} middleware 
 */
import { MiddlewareInterface } from '../../../interfaces';

export function middleware(middleware: MiddlewareInterface) {
    return function (target: any, key: any, descriptor: any) {
        if (!descriptor.value.middlewares) descriptor.value.middlewares = [];
        descriptor.value.middlewares.push(middleware);
        return descriptor;
    };
}
