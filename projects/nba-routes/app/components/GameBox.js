var React = require('react');

var GameBox = React.createClass({
  render: function(){
    var styles = {
      box: {
        border: "1px solid #333",
        borderRadius: 5,
        marginBottom: 15
      }
    }
    var games = this.props.schedule.map(function(item, index){
      return (
        <div className="col-sm-6 text-center" key={index}>
          <div className="col-sm-12" style={styles.box}>
            <h2> {this.props.homeTeam} </h2>
            <h5> VS </h5>
            <h3> {item.opponent} </h3>
            <h2> {item.winOrLoss} </h2>
            <h3> {item.homeScore} - {item.awayScore} </h3>
          </div>
        </div>
      )
    }.bind(this));
    return (
      <span>
        {games}
      </span>
    )
  }
});

module.exports = GameBox;