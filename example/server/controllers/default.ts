
import * as ServerAnnotations from '../../../lib/server/annotations';

const {
    Route,
    Method
} = ServerAnnotations;



@Route.resource('Pages')
@Route.middleware((req, res, next) => {
    console.log("All the routes have this");
    return next();
})
export default class Pages<ControllerInterface> {


    @Method.middleware((req, res, next) => {
        console.log("Only the get method has this");
        return next();
    })
    async get(req, res, next) {


    }

    async post() {
        return Promise.resolve({
            response: {
                statusCode: 200,
                body: {
                    success: true
                }
            }
        })
    }

    async put() {
        return Promise.resolve({
            response: {
                statusCode: 200,
                body: {
                    success: true
                }
            }
        })
    }

    async delete() {
        return Promise.resolve({
            response: {
                statusCode: 200,
                body: {
                    success: true
                }
            }
        })
    }

}