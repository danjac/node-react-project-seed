import React from 'react'
  
export default function(Component, props, stubs){

  return React.createClass({

    childContextTypes: {
        router: React.PropTypes.object
    },

    getChildContext() {
        return {
            router: Object.assign({
              makePath () {},
              makeHref () {},
              transitionTo () {},
              replaceWith () {},
              goBack () {},
              getCurrentPath () {},
              getCurrentRoutes () {},
              getCurrentPathname () {},
              getCurrentParams () {},
              getCurrentQuery () {},
              isActive () {},
          }, stubs)
        }
    },

    render() {
        return <Component {...props} />
    }
  })
}
