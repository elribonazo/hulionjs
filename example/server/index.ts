
import { Server } from '../..';

import * as config from './config';
import * as DefaultController from './controllers/default';


Server.setConfig(config);

(async () => {
    try {
        await Server.loadMiddlewares();

        await Server.attachController(DefaultController);

        await Server.listen({
            host: 'localhost',
            port: 4004
        });

    } catch (err) {
        console.log('debug', err);
        process.exit(0);
    }
})();