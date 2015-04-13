import path from 'path';
import helmet from 'koa-helmet';
import Checkit from 'checkit';
import passport from 'koa-passport';
import redisStore from 'koa-redis';
import React from 'react';
import Router from 'react-router';
import middlewares from 'koa-middlewares';
import Routes from '../app/Routes';


export default function(app) {

    const devMode = app.env === 'development';

    // session configuration
    if (!process.env.SECRET_KEY) {
        throw new Error("You must set a SECRET_KEY in your environment!");
    }
    app.keys = [process.env.SECRET_KEY];

    app.use(middlewares.session({
        key: 'react-tutorial',
        store: redisStore()
    }));

    // authentication

    app.use(passport.initialize());
    app.use(passport.session());

    // security
    //

    app.use(helmet.defaults());

    middlewares.csrf(app);
    app.use(middlewares.csrf.middleware);

    //
    // body parser
    //
    app.use(middlewares.bodyParser());

    // compression
    app.use(middlewares.compress());

    // templates

    middlewares.ejs(app, {
        root: path.join(__dirname, '../views'),
        layout: false,
        viewExt: 'ejs',
        cache: !(devMode),
        debug: devMode
    });

    // static content
    //
    if (devMode) {
        app.use(middlewares.staticCache(path.join(__dirname, '../public'), {
            dynamic: true,
            buffer: true,
            gzip: true,
            maxAge: 10
        }));
    }

    app.use(middlewares.conditional());
    app.use(middlewares.etag());

    // logging
    app.use(middlewares.logger());
    //

    // error handling
    //
    // handle form input and other user errors

    app.use(function* (next) {
        try {
            yield* next;
        } catch(err) {
            if (err instanceof Checkit.Error) {
                this.status = 400;
                this.body = err.toJSON();
                return;
            }
            if (err && err.status && err.status < 500) {
                this.status = err.status;
                if (err.location) {
                    this.redirect(err.location);
                }
                return;
            }
            throw err;
        }
    });

    app.context.reactify = function() {

        return new Promise((resolve, reject) => {
            const router = Router.create({
                routes: Routes,
                location: this.url,
                onAbort: (reason, location) => {
                    const err = new Error();
                    err.status = 302;
                    err.location = "/login?next=" + encodeURI(this.url);
                    reject(err);
                }
            });

            router.run((Handler, state) => {
                resolve(React.renderToString(<Handler />));
            });
        });
    };


    middlewares.onerror(app);

}
