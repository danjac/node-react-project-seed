import middleware from './middleware';
import passport from './passport';
import connect from './db';
import routes from './routes';

export default function(app) {

    connect(app);
    middleware(app);
    passport(app);
    routes(app);

}
