var React = require('react');
var Router = require('react-router');
var firebaseUtils = require('../utils/firebaseUtils');
var teamsObj = require('../utils/sprite');
var nbaTeams = require('../utils/nbaTeams');
var GameBox = require('./GameBox');

var Schedule = React.createClass({
  mixins: [Router.State],
  getInitialState: function(){
    return {
      wins: 0,
      losses: 0,
      name: nbaTeams.teamsHash[this.getParams().team],
      id: '',
      schedule: []
    }
  },
  componentDidMount: function(){
    var team = this.getParams().team;
    this.firebaseRef = firebaseUtils.getRef();
    this.firebaseRef.child(team + '/schedule').on('value', function(snapshot){
      if(this.isMounted()){
        this.setState({
          schedule: firebaseUtils.toArray(snapshot.val())
        });
      }
    }.bind(this));

    this.firebaseRef.child(team + '/info').on('value', function(snapshot){
      var data = snapshot.val();
      if(data && this.isMounted()){
        this.setState({
          wins: data.wins || 0,
          losses: data.losses || 0
        });
      }
    }.bind(this));
  },
  render: function(){
    return (
      <div className="container">
        <div className="row">
          <div className="text-center">
            <h2> {this.state.name} Schedule </h2>
            <div style={teamsObj[this.getParams().team]}></div>
            <h2> Wins: {this.state.wins} Losses: {this.state.losses} </h2>
            <GameBox schedule={this.state.schedule} homeTeam={this.state.name} />
          </div>
        </div>
      </div>
    )
  }
});

module.exports = Schedule;