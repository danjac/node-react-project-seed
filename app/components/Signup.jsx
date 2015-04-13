import React from 'react';
import Reflux from 'reflux';
import Router from 'react-router';
import _ from 'lodash';
import {Input} from 'react-bootstrap';
import actions from '../actions';


export default React.createClass({

    mixins: [
        Reflux.listenTo(actions.signup.failed, "onSignupFailure"),
        Reflux.listenTo(actions.signup.completed, "onSignupSuccess")
    ],

    contextTypes: {
        router: React.PropTypes.func
    },

    getInitialState () {
        return {
            errors: {}
        };
    },

    onSignupSuccess () {
        this.context.router.transitionTo(this.context.router.makeHref("submit"));
    },

    onSignupFailure (errors) {
        this.setState({ errors: errors });
    },

    handleSubmit (event) {
        event.preventDefault();

        const data = _.mapValues(this.refs, (ref) => ref.getValue());
        actions.signup(data);

    },

    render () {

        return (
            <form onSubmit={this.handleSubmit}>
               <Input ref="name"
                      type="text"
                      label="Name"
                      required
                      bsStyle={this.state.errors.name? 'error': null}
                      help={this.state.errors.name} />
               <Input ref="email"
                      type="email"
                      label="Email address"
                      required
                      bsStyle={this.state.errors.email? 'error': null}
                      help={this.state.errors.email} />
               <Input ref="password"
                      type="password"
                      label="Password"
                      required
                      bsStyle={this.state.errors.password? 'error': null}
                      help={this.state.errors.password} />
               <Input type="submit" value="Signup" />
            </form>
        );
    }

});
