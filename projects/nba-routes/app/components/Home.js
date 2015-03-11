var React = require('react');
var firebaseUtils = require('../utils/firebaseUtils');
var teamsObj = require('../utils/sprite');
var Link = require('react-router').Link;

var Home = React.createClass({
  getInitialState: function(){
    return {
      teams: []
    }
  },
  componentDidMount: function(){
    var newTeams = [];
    for(var key in teamsObj){
      newTeams.push({id: key})
    }
    this.setState({
      teams: newTeams
    });
  },
  render: function(){
    var teams = this.state.teams.map(function(item, index){
      return (
        <div className="col-sm-4" key={item.id}>
          <div style={teamsObj[item.id]}></div>
          <div className="col-sm-12">
            <div className="text-center">
              <div className="btn-group">
                <button className="btn btn-secondary"><Link to="schedule" params={{team: item.id}}>Schedule</Link></button>
                <button className="btn btn-secondary"><Link to="addGame" params={{team: item.id}}>Add Game</Link></button>
              </div>
            </div>
          </div>
        </div>
      )
    });
    return (
      <span> {teams} </span>
    )
  }
});

module.exports = Home;