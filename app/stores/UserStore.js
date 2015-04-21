import Reflux from 'reflux';
import actions from '../actions';

export default Reflux.createStore({

    listenables: actions,

    init() {
        this.user = null;
    },

    getUser() {
        return this.user;
    },

    setUser(user) {
        this.user = user;
        this.trigger(this.user);
    },

    isLoggedIn() {
        return this.user != null;
    },

    loginCompleted(user) {
        this.updateUser(user);
    },

    signupCompleted(user) {
        this.updateUser(user);
    },

    logout() {
        this.updateUser(null);
    }


});

