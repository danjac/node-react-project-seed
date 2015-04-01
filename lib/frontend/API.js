import request from 'superagent'
import Checkit from 'checkit'
import * as rules from './rules'


const authToken = "authToken"


const bearer = (request) => {
  const token = window.localStorage.getItem(authToken)
  if (!token) {
    return request
  }
  request.set('Authorization', 'Bearer ' + token)
  return request
}


export function signup(data) {
    return new Promise((resolve, reject) => {
        Checkit(rules.Signup).run(data)
        .then((clean) => {
            request
                .post("/api/signup/")
                .send(clean)
                .end((err, res) => {
                    if (res.badRequest) {
                        return reject(res.body)
                    }
                    window.localStorage.setItem(authToken, res.body.token)
                    resolve(res.body.user)
                  })
        })
        .catch(Checkit.Error, (err) => {
            reject(err.toJSON())
        })
    })
}

export function logout() {
    window.localStorage.clear()
}

export function login(data) {
    return new Promise((resolve, reject) => {
        Checkit(rules.Login)
            .run(data)
            .then((clean) => {
                request
                    .post('/api/login/')
                    .send(clean)
                    .end((err, res) => {
                        if (err) {
                            return reject()
                        }
                        window.localStorage.setItem(authToken, res.body.token)
                        resolve(res.body.user)
                    })
            })
            .catch(Checkit.Error, (err) => {
                reject(err.toJSON())
            })
    })
}

export function authenticate() {

    return new Promise((resolve, reject) => {
        if (!window.localStorage.getItem(authToken)) {
            return reject("no auth token")
        }

        request
            .get("/api/auth/")
            .use(bearer)
            .end((err, res) => {
                if (err) {
                    return reject()
                }
                resolve(res.body)
            })
    })
}

