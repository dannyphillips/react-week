import React from 'react';
var { h1 } = React.DOM;

var Home = React.createClass({
  render () {
    return h1({}, "WAY TO GO!");
  }
});

React.render(<Home/>, document.getElementById('app'));

