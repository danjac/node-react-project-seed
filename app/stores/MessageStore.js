import Reflux from 'reflux';
import Immutable from 'immutable';
import actions from '../actions';


export default Reflux.createStore({

    listenables: actions,

    init() {
        this.messages = new Immutable.List();
    },

    getDefaultData() {
        return this.messages;
    },

    addMessage(level, msg) {
        this.messages = this.messages.push({ level: level, text: msg });
        this.trigger(this.messages);
    },

    dismissAlert(index) {
        this.messages = this.messages.delete(index);
        this.trigger(this.messages);
    },

    success(msg){
        this.addMessage("success", msg);
    },

    warning(msg){
        this.addMessage("warning", msg);
    },

    loginCompleted(user) {
        this.success("Welcome back, " + user.name);
    },

    loginFailed() {
        this.warning("Sorry, login failed. Please try again.");
    },

    loginRequired() {
        this.warning("Please sign in to continue");
    },

    permissionDenied() {
        this.warning("You're not allowed to do this");
    },

    signupCompleted(user) {
        this.success(`Hi ${user.name}! Welcome to the site!`);
    }

});


