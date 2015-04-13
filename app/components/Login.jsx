import React from 'react';
import Reflux from 'reflux';
import Router from 'react-router';
import _ from 'lodash';
import {Input} from 'react-bootstrap';
import UserStore from '../stores/UserStore';
import actions from '../actions';


export default React.createClass({

    mixins: [
        Reflux.listenTo(UserStore, 'onLoginSuccess'),
        Reflux.listenTo(actions.login.failed, 'onLoginFailure')
    ],

    contextTypes: {
        router: React.PropTypes.func
    },

    getInitialState() {
        return {
            errors: {}
        };
    },

    redirect() {
        const nextPath = this.context.router.getCurrentQuery().nextPath || "/";
        this.context.router.transitionTo(nextPath);
    },

    componentDidMount() {
        if (this.props.user) {
            return this.redirect();
        }
    },

    onLoginSuccess() {
        const user = UserStore.getDefaultData();
        if (user) {
            return this.redirect();
        }
    },

    onLoginFailure(errors) {
        this.setState({ errors: errors || {} });
    },

    handleSubmit(event) {
        event.preventDefault();

        const data = _.mapValues(this.refs, (ref) => ref.getValue());

        actions.login(data);

    },

    render() {

        return (
            <form onSubmit={this.handleSubmit}>
                <Input ref="identity"
                       type="text"
                       label="Email address or username"
                       help={this.state.errors.identity}
                       bsStyle={this.state.errors.identity? 'error': null} />
                <Input ref="password"
                       type="password"
                       label="Password"
                       help={this.state.errors.password}
                       bsStyle={this.state.errors.password? 'error': null} />
                <Input type="submit" value="Login" />
            </form>
        );
    }
});
