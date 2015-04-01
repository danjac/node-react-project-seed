import jwt from 'jsonwebtoken'
import _ from 'lodash'
import {auth} from './middleware'
import {User} from './models'

const pageSize = 20

const jwtToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.SECRET_KEY, {
        expiresInMinutes: 60 * 24
    })
}


export default (app) => {

    app.get("/api/auth/", [auth], (req, res, next) => {
        res.json(req.user)
    })

    app.post("/api/login/", (req, res, next) =>  {

        const badResult = () => res.status(400).send("Invalid login credentials")

        const {identity, password} = req.body

        if (!identity || !password) {
            return badResult()
        }

        User.authenticate(identity, password)
            .then((user) => {

                if (!user) {
                    return badResult()
                }

                res.json({
                    token: jwtToken(user._id),
                    user: user
                })

            }, (err) => next(err))
    })

    app.post("/api/signup/", (req, res, next) =>  {

        new User(req.body)
            .save()
            .then((user) => {
                res.json({
                    token: jwtToken(user._id),
                    user: user
                })
            }, (err) => next(err))

    })


    app.get("/*", (req, res, next) =>  {
        res.render("index")
    })

}
