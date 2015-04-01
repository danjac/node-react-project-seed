import React from 'react/addons'
import sinon from 'sinon'
import {expect} from 'chai'
import Login from '../../lib/frontend/components/Login'
import actions from '../../lib/frontend/actions'
import StubRouterContext from '../StubRouterContext'


const TestUtils = React.addons.TestUtils

describe("Login component", () => {

    it('should trigger the login action on submit', () => {

        const Component = StubRouterContext(Login)
        const component = TestUtils.renderIntoDocument(<Component />)

        const spy = sinon.spy(actions, "login")

        const form = TestUtils.findRenderedDOMComponentWithTag(component, 'form')
        const inputs = TestUtils.scryRenderedDOMComponentsWithTag(component, 'input')

        inputs[0].getDOMNode().value = 'tester' // identity
        inputs[1].getDOMNode().value = 'testing' // password

        const data = {
            identity: 'tester',
            password: 'testing'
        }

        TestUtils.Simulate.submit(form)
        expect(spy.calledWith(data)).to.be.ok

        actions.login.restore()

    })

})

