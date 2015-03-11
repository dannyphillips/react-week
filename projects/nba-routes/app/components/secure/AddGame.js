var React = require('react');
var firebaseUtils = require('../../utils/firebaseUtils');
var teamsObj = require('../../utils/sprite');
var Authenticated = require('../../utils/authenticated');
var Router = require('react-router');
var NewGameForm = require('./NewGameForm');

var AddGame = React.createClass({
  mixins: [Authenticated, Router.State],
  render: function() {
    return (
      <div className="container">
        <div className="row">
          <div className="text-center">
            <h2> Add Game </h2>
            <div style={teamsObj[this.getParams().team]}></div>
            <NewGameForm teamId={this.getParams().team} />
          </div>
        </div>
      </div>
    );
  }

});

module.exports = AddGame;