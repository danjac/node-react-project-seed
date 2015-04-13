import React from 'react';
import {PureRenderMixin} from 'react/addons';
import Reflux from 'reflux';
import Router, {RouteHandler, Link} from 'react-router';
import {Alert, Navbar, Nav, NavItem, Input} from 'react-bootstrap';
import {NavItemLink} from 'react-router-bootstrap';
import actions from '../actions';
import UserStore from '../stores/UserStore';
import MessageStore from '../stores/MessageStore';


const Messages = React.createClass({

    mixins: [PureRenderMixin],

    propTypes: {
        messages: React.PropTypes.object
    },

    render() {
        return (
            <div>
            {this.props.messages.map((msg, index) => {
                return <Alert onDismiss={() => actions.dismissAlert(index)}
                              key={index}
                              dismissAfter={3000}
                              bsStyle={msg.level}>{msg.text}</Alert>;
            }).toJS()}
            </div>
        );
    }
});


const Navigation = React.createClass({

    mixins: [
        PureRenderMixin
    ],

    propTypes: {
        user: React.PropTypes.object
    },

    contextTypes: {
        router: React.PropTypes.func
    },

    getLeftNav() {
        const makeHref = this.context.router.makeHref;

        return (
          <Nav left>
          </Nav>
        );
    },

    getRightNav() {

        const makeHref = this.context.router.makeHref;

        if (this.props.user) {
            return (
              <Nav right>
                <NavItem href="/logout/">logout</NavItem>
              </Nav>
            );
        }
        return (
              <Nav right>
                <NavItemLink to={makeHref("login")}>login</NavItemLink>
                <NavItemLink to={makeHref("signup")}>signup</NavItemLink>
              </Nav>
        );
    },

    render() {

        const makeHref = this.context.router.makeHref,
              brand = <Link to={makeHref("main")}>My app</Link>;

        return (
            <Navbar brand={brand}
                    fixedTop={true}
                    inverse={true}
                    fluid={true}>
              {this.getLeftNav()}
              {this.getRightNav()}
            </Navbar>
        );

    }

});

export default React.createClass({

    mixins: [
        Reflux.connect(MessageStore, 'messages'),
        Reflux.connect(UserStore, 'user'),
        Reflux.listenTo(actions.loginRequired, 'onLoginRequired')
    ],

    contextTypes: {
        router: React.PropTypes.func
    },

    getInitialState() {
        return {
            messages: MessageStore.getDefaultData(),
            user: UserStore.getDefaultData()
        };
    },

    onLoginRequired() {
        this.context.router.transitionTo("login");
    },

    render() {

        return (
            <div className="container-fluid">
                <Navigation user={this.state.user} />
                <Messages messages={this.state.messages} />
                <RouteHandler user={this.state.user} />
            </div>
        );
    }
});
