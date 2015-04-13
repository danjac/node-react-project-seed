import Reflux from 'reflux';
import * as api from './api';


const actions = Reflux.createActions([
    "dismissAlert",
    "loginRequired",
    "permissionDenied"
]);


const asyncActions = [
    "login",
    "signup",
];


asyncActions.forEach((name) => {
    actions[name] = Reflux.createAction({ asyncResult: true });
});

actions.signup.listen((data) => {

    api.signup(data)
        .then((user) => {
            actions.signup.completed(user);
        })
        .catch((err) => {
            actions.signup.failed(err);
        });

});


actions.login.listen((data) => {
    api.login(data)
        .then((user) => {
            actions.login.completed(user);
        })
        .catch((err) => {
            actions.login.failed(err);
        });
});

export default actions;
