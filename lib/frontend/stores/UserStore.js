import Reflux from 'reflux'
import actions from '../actions'

export default Reflux.createStore({

    listenables: actions,

    init() {
        this.user = null
    },

    getDefaultData() {
        return this.user
    },

    isLoggedIn() {
        return this.user != null
    },

    getUserComplete(user){
        this.user = user
        this.trigger()
    },

    loginSuccess(user) {
        this.user = user
        this.trigger()
    },

    signupSuccess(user) {
        this.user = user
        this.trigger()
    },

    logout() {
        this.user = null
        this.trigger()
    },

})

