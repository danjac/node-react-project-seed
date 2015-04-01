import Reflux from 'reflux'
import * as API from './API'

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


actions.signup.listen((data) => {
    API.signup(data)
       .then((user) => actions.signup.completed(user),
             (err) => actions.signup.failed(err))

})

actions.logout.listen(() => {
    API.logout()
})

actions.login.listen((data) => {
    API.login(data)
       .then((user) => actions.login.completed(user),
             (err) => actions.login.failed(err))

})

actions.auth.listen(() => {

    API.authenticate()
       .then((user) => actions.auth.completed(user),
             (err) => actions.auth.failed())
})

export default actions
