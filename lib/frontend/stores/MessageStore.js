import Reflux from 'reflux'
import Immutable from 'immutable'
import actions from '../actions'


export default Reflux.createStore({

    listenables: actions,

    init() {
        this.messages = Immutable.List()
    },

    getDefaultData() {
        return this.messages
    },

    addMessage(level, msg) {
        this.messages = this.messages.push({ level: level, text: msg })
        this.trigger()
    },

    dismissAlert(index) {
        this.messages = this.messages.delete(index)
        this.trigger()
    },

    success(msg){
        this.addMessage("success", msg)
    },

    warning(msg){
        this.addMessage("warning", msg)
    },

    onLoginCompleted(user) {
        this.success("Welcome back, " + user.name)
    },

    onLoginFailed() {
        this.warning("Sorry, you have entered incorrect login info")
    },

    loginRequired() {
        this.warning("Please sign in to continue")
    },

    permissionDenied() {
        this.warning("You're not allowed to do this")
    },

    logout() {
        this.success("Bye for now")
    },

    onSignupCompleted(user) {
        this.success(`Hi ${user.name}! Welcome to the site!`)
    }

})


