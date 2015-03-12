var React = require('react');
var githubActions = require('../actions/githubActions');
var SearchGithub = require('./SearchGithub');

var Home = React.createClass({
  render: function(){
    return (
      <h2 className="text-center">
        Search by Github Username Above
      </h2>
    )
  }
});

module.exports = Home;