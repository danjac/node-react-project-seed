import Router from 'koa-router';
import mount from 'koa-mount';
import * as api from '../src/controllers/api';
import {index, logout} from '../src/controllers';

export default (app) => {

    /*
     * secure routes here..
    app.use(mount('/api/auth', new Router()
        .use(secure.isSecure)
        .routes()));
    */

    app.use(mount('/api', new Router()
        .post("/login/", api.login)
        .post("/signup/", api.signup)
        .get("/isname", api.nameExists)
        .get("/isemail", api.emailExists)
        .routes()));

    app.use(mount('/', new Router()
        .get("/logout/", logout)
        .get('/:path', index)
        .get('/', index)
        .routes()));

};
