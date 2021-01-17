/**
 * Annotation that adds a middleware to a controller
 * All the routes inside will run it.
 * @param {*} middleware 
 */

import { MiddlewareInterface } from '../../../interfaces';

export function middleware(middleware: MiddlewareInterface) {
    return function decorator(target: any) {
        if (!target.middlewares) {
            target.middlewares = [];
        }
        target.middlewares.push(middleware);
    };
}
