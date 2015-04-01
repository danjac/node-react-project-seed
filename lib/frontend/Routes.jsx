import React from 'react'
import {DefaultRoute, Route} from 'react-router'

import App from './components/App'
import Front from './components/Front'
import Login from './components/Login'
import Signup from './components/Signup'
 

export default (
    <Route handler={App}>
        <DefaultRoute name="front" handler={Front} />
        <Route name="login" path="/login" handler={Login} />
        <Route name="signup" path="/signup" handler={Signup} />
    </Route>
)

