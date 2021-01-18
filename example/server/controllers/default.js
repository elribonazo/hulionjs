
import { ServerTypes } from '@smw-project/module';

function middleware(middleware) {
    return function (...args) {
        const [target, key, descriptor] = args;
        if (descriptor && descriptor.value) {
            //In method
            descriptor.value.middlewares = [];
            descriptor.value.middlewares.push(middleware);
            return descriptor;
        } else {
            if (!target.middlewares) {
                target.middlewares = [];
            }
            target.middlewares.push(middleware);
        }
    }
}

const Server = {
    Component: function Component(constructor) {
        return class extends constructor {
            //Add static properties here
            //Helpers, etc
            static async test() { }
        };
    }

}


@Server.Component
@middleware((req, res, next) => {
    console.log("All the routes have this");
    return next();
})
class Users {


    @middleware((req, res, next) => {
        console.log("All the routes have this");
        return next();
    })
    async get() {

    }

    async post() {

    }

    async put() {

    }

    async delete() {

    }

}