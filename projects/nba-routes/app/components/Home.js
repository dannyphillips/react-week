var React = require('react');
var firebaseUtils = require('../utils/firebaseUtils');
var teamsObj = require('../utils/sprite');
var Link = require('react-router').Link;

var Home = React.createClass({
  render: function(){
    var teams;
    return (
      <span> {teams} </span>
    )
  }
});

module.exports = Home;