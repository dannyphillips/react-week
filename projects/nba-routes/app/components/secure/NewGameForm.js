var React = require('react');
var firebaseUtils = require('../../utils/firebaseUtils');
var teams = require('../../utils/nbaTeams');
var Router = require('react-router');

var incrementWins = function(ref, teamId){
  ref.child(teamId).child('info/wins').transaction(function (current_value) {
    return (current_value || 0) + 1;
  });
};

var incrementLosses = function(ref, teamId){
  ref.child(teamId).child('info/losses').transaction(function (current_value) {
    return (current_value || 0) + 1;
  });
}

var NewGameForm = React.createClass({
  mixins: [Router.Navigation],
  propTypes: {
    teamId: React.PropTypes.string.isRequired
  },
  handleSubmit: function(){
    var firebaseRef = firebaseUtils.getRef();
    var homeScore = Number(this.refs.homeScore.getDOMNode().value);
    var awayScore = Number(this.refs.awayScore.getDOMNode().value);
    var homeOrAway = this.refs.homeOrAway.getDOMNode().value;
    var opponentId = this.refs.opponent.getDOMNode().value;
    var opponent = teams.teamsHash[opponentId];

    var winOrLose;
    if(homeOrAway === "Home"){
      if(homeScore > awayScore){
        winOrLose = "Win";
        incrementWins(firebaseRef, this.props.teamId);
        incrementLosses(firebaseRef, opponentId);
      } else {
        winOrLose = "Lose";
        incrementWins(firebaseRef, opponentId);
        incrementLosses(firebaseRef, this.props.teamId);
      }
    } else {
        if(homeScore > awayScore){
          winOrLose = "Lose";
          incrementLosses(firebaseRef, this.props.teamId);
          incrementWins(firebaseRef, opponentId);
        } else {
          winOrLose = "Win";
          incrementLosses(firebaseRef, opponentId);
          incrementWins(firebaseRef, this.props.teamId);
      }
    }

    var homeTeamObj = {
      awayScore: awayScore,
      homeOrAway: homeOrAway,
      homeScore: homeScore,
      opponent: opponent,
      opponentId: opponentId,
      winOrLose: winOrLose
    };

    var awayTeamObj = {
      awayScore: awayScore,
      homeOrAway: homeOrAway === "Home" ? "Away" : "Home",
      homeScore: homeScore,
      opponent: teams.teamsHash[this.props.teamId],
      opponentId: this.props.teamId,
      winOrLose: winOrLose === "Win" ? "Lose" : "Win"
    };

    firebaseRef.child(this.props.teamId).child('schedule').push(homeTeamObj);
    firebaseRef.child(opponentId).child('schedule').push(awayTeamObj);

    this.transitionTo('schedule', {team: this.props.teamId});
  },
  render: function() {
    var teamOptions = teams.teamsArr.filter(function(item){
      return item.id !== this.props.teamId
    }.bind(this)).map(function(item){
      return <option value={item.id} key={item.id}>{item.name}</option>
    });
    return (
      <div className="col-sm-6 col-sm-offset-3">
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label> Home or Away </label>
            <select ref="homeOrAway" className="form-control">
              <option value="Home">Home</option>
              <option value="Away">Away</option>
            </select>
          </div>
          <div className="form-group">
            <label> Opponent </label>
            <select ref="opponent" className="form-control">
              {teamOptions}
            </select>
          </div>
          <div className="form-group">
            <label> Home Team Score </label>
            <input ref="homeScore" className="form-control" type="text" placeholder="Home Score" />
          </div>
          <div className="form-group">
            <label> Away Team Score </label>
            <input ref="awayScore" type="text" className="form-control" placeholder="Away Score" />
          </div>
          <button type="submit" className="btn btn-primary"> Submit </button>
        </form>
      </div>
    );
  }
});

module.exports = NewGameForm;
