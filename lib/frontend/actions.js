import Reflux from 'reflux'
import request from 'superagent'
import _ from 'lodash'
import Checkit from 'checkit'
import * as rules from './rules'

const actions = Reflux.createActions([
   "dismissAlert",
   "loginRequired",
   "permissionDenied",
   "logout",
   "startLoading",
   "endLoading"
])


actions.login = Reflux.createAction({ asyncResult: true })
actions.signup = Reflux.createAction({ asyncResult: true })
actions.auth = Reflux.createAction({ asyncResult: true })

const authToken = "authToken"


const bearer = (request) => {
  const token = window.localStorage.getItem(authToken)
  if (!token) {
    return request
  }
  request.set('Authorization', 'Bearer ' + token)
  return request
}


actions.signup.listen((data) => {
    Checkit(rules.Signup).run(data)
    .then((clean) => {
        request
            .post("/api/signup/")
            .send(clean)
            .end((err, res) => {
                if (res.badRequest) {
                    return actions.signup.failed(res.body)
                }
                window.localStorage.setItem(authToken, res.body.token)
                actions.signup.completed(res.body.user)
              })
    })
    .catch(Checkit.Error, (err) => {
        actions.signup.failed(err.toJSON())
    })
})

actions.logout.listen(() => {
    window.localStorage.clear()
})

actions.login.listen((data) => {

    Checkit(rules.Login)
        .run(data)
        .then((clean) => {
            //actions.startLoading()
            request
                .post('/api/login/')
                .send(clean)
                .end((err, res) => {
                    //actions.endLoading()
                    if (err) {
                        return actions.login.failed()
                    }
                    window.localStorage.setItem(authToken, res.body.token)
                    actions.login.completed(res.body.user)
                })
        })
        .catch(Checkit.Error, (err) => {
            actions.login.failed(err.toJSON())
        })

})

actions.auth.listen(() => {

    if (!window.localStorage.getItem(authToken)) {
        return actions.auth.failed()
    }

    actions.startLoading()

    request
        .get("/api/auth/")
        .use(bearer)
        .end((err, res) => {
            actions.endLoading()
            if (res.unauthorized) {
                return actions.auth.failed()
            }
            actions.auth.completed(res.body)
        })
})

export default actions
