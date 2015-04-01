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

    onAuthCompleted(user){
        this.user = user
        this.trigger()
    },

    onAuthFailed() {
        this.user = null
        this.trigger(this.user)
    },

    onLoginCompleted(user) {
        this.user = user
        this.trigger(this.user)
    },

    onSignupCompleted(user) {
        this.user = user
        this.trigger(this.user)
    },

    logout() {
        this.user = null
        this.trigger(this.user)
    },

})

