import React from 'react';
import Reflux from 'reflux';
import UserStore from '../stores/UserStore';


export const Authenticate = {
    statics: {
        willTransitionTo (transition) {
            if (!UserStore.isLoggedIn()){
                var nextPath = transition.path;
                transition.redirect("/login", {}, { nextPath: nextPath });
            }
        }
    }
};
