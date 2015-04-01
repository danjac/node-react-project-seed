import React from 'react'
import Router from 'react-router'
import _ from 'lodash'
import {User} from './models'


export function auth (req, res, next) {
    if (!req.authToken || !req.authToken.id) {
        return res.sendStatus(401)
    }

    User.findById(req.authToken.id)
        .exec()
        .then((user) => {
            if (!user) {
                return res.sendStatus(401)
            }
            req.user = user
            next()
        }, (err) => next(err))
}


export function reactify(routes) {
    // currently broken with latest react.

    return (req, res, next) => {

        res.reactify = (route, props={}, opts={}) => {

            const router = Router.create({
                routes: routes,
                location: route,
                onError: (err) => next(err),
                onAbort: (abortReason) => {
                    if (abortReason.constructor.name === 'Redirect') {
                        const url = router.makePath(
                            abortReason.to, 
                            abortReason.params, 
                            abortReason.query
                        )
                        res.redirect(url)
                    } else {
                        next(abortReason)
                    }
                }
            })

            router.run((Handler, state) => {
                res.render(opts.template || 'index', {
                    markup: React.renderToString(Handler(props)),
                    data: JSON.stringify(props)
                })
            })
        }

        next()
    }
}
