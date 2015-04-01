import React from 'react'
import {PureRenderMixin} from 'react/addons'
import Reflux from 'reflux'
import Router, {RouteHandler, Link} from 'react-router'
import {Alert, Navbar, Nav, NavItem, Input}  from 'react-bootstrap'
import {NavItemLink} from 'react-router-bootstrap'
import actions from '../actions'
import UserStore from '../stores/UserStore'
import MessageStore from '../stores/MessageStore'


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
                              bsStyle={msg.level}>{msg.text}</Alert>
            }).toJS()}
            </div>
        )
    }
})


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

    getRightNav() {

        const className = "navbar-right",
              makeHref = this.context.router.makeHref

        if (this.props.user) {
            return (
              <Nav className={className}>
                <NavItemLink to={makeHref("user", {name: this.props.user.name})}>{this.props.user.name}</NavItemLink>
                <NavItem onClick={actions.logout}>logout</NavItem>
              </Nav>
            )
        }
        return (
              <Nav className={className}>
                <NavItemLink to={makeHref("login")}>login</NavItemLink>
                <NavItemLink to={makeHref("signup")}>signup</NavItemLink>
              </Nav>
        )
    },

    render() {

        const makeHref = this.context.router.makeHref,
              brand = <Link to={makeHref("front")}>My project</Link>

        return (
            <Navbar brand={brand} className="navbar navbar-inverse" fixedTop={true} fluid={true}>
              <Nav className="navbar-left">
              </Nav>
              {this.getRightNav()}
            </Navbar>
        )

    }

})

export default React.createClass({

    mixins: [
        Reflux.listenTo(MessageStore, 'onMessagesUpdate'),
        Reflux.listenTo(UserStore, 'onUserUpdate'),
        Reflux.listenTo(actions.loginRequired, 'onLoginRequired'),
        Reflux.listenTo(actions.logout, 'onLogout'),
        Reflux.listenTo(actions.startLoading, 'onLoadingStart'),
        Reflux.listenTo(actions.endLoading, 'onLoadingEnd')
    ],

    contextTypes: {
        router: React.PropTypes.func
    },

    getInitialState() {
        return {
            messages: MessageStore.getDefaultData(),
            user: UserStore.getDefaultData(),
            loading: false
        }
    },

    onLogout() {
        this.context.router.transitionTo("front")
    },

    onLoginRequired() {
        this.context.router.transitionTo("login")
    },

    onMessagesUpdate() {
        this.setState({ messages: MessageStore.getDefaultData() })
    },

    onUserUpdate() {
        this.setState({ user: UserStore.getDefaultData() })
    },

    onLoadingStart() {
        this.setState({ loading: true })
    },

    onLoadingEnd() {
        this.setState({ loading: false })
    },

    componentDidMount() {
        actions.getUser()
    },

    render() {

        if (this.state.loading) {
            // replace with loading gif...
            return (
                <div className="container-fluid">
                    <div className="text-center">
                        <h1>Loading....</h1>
                    </div>
                </div>
            )
        }

        return (
            <div className="container-fluid">
                <Navigation user={this.state.user} />
                <Messages messages={this.state.messages} />
                <RouteHandler user={this.state.user}  />
            </div>
        )
    }
})
