var React = require('react');
var Router = require('react-router');
var firebaseUtils = require('../utils/firebaseUtils');
var teamsObj = require('../utils/sprite');
var nbaTeams = require('../utils/nbaTeams');
var GameBox = require('./GameBox');

var Schedule = React.createClass({
  mixins: [Router.State],

  render: function(){
    return (
      <div className="container">
        <div className="row">
          <div className="text-center">
            <h2> [[TEAM NAME]] Schedule </h2>
            <div style={teamsObj[this.getParams().team]}></div>
            <h2> Wins: [[TEAM WINS]] Losses: [[TEAM LOSSES]] </h2>
            /*
            <GameBox schedule={this.state.schedule} homeTeam={this.state.name} />
            */
          </div>
        </div>
      </div>
    )
  }
});

module.exports = Schedule;