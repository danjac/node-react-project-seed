import Reflux from 'reflux'
import request from 'superagent'
import _ from 'lodash'
import Checkit from 'checkit'
import * as rules from './rules'

const actions = Reflux.createActions([
   "dismissAlert",
   "login",
   "loginSuccess",
   "loginFailure",
   "loginRequired",
   "permissionDenied",
   "logout",
   "getUser",
   "getUserComplete",
   "signup",
   "signupSuccess",
   "signupFailure",
   "startLoading",
   "endLoading"
])


const authToken = "authToken"


const bearer = (request) => {
  const token = window.localStorage.getItem(authToken)
  if (!token) {
    return request
  }
  request.set('Authorization', 'Bearer ' + token)
  return request
}


actions.signup.preEmit = (data) => {
    Checkit(rules.Signup).run(data)
    .then((clean) => {
        request
            .post("/api/signup/")
            .send(clean)
            .end((err, res) => {
                if (res.badRequest) {
                    return actions.signupFailure(res.body)
                }
                window.localStorage.setItem(authToken, res.body.token)
                actions.signupSuccess(res.body.user)
              })
    })
    .catch(Checkit.Error, (err) => {
        actions.signupFailure(err.toJSON())
    })
}

actions.logout.preEmit = () => {
    window.localStorage.removeItem(authToken)
}

actions.login.preEmit = (data) => {

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
                        return actions.loginFailure()
                    }
                    window.localStorage.setItem(authToken, res.body.token)
                    actions.loginSuccess(res.body.user)
                })
        })
        .catch(Checkit.Error, (err) => {
            actions.loginFailure(err.toJSON())
        })

}

actions.getUser.preEmit = () => {

    actions.startLoading()

    request
        .get("/api/auth/")
        .use(bearer)
        .end((err, res) => {
            actions.endLoading()
            if (res.unauthorized) {
                return actions.getUserComplete(null)
            }
            actions.getUserComplete(res.body)
        })
}

export default actions
