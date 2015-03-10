var React = require('react');
var ColorList = require('./ColorList');

var AddList = React.createClass({
  getInitialState: function(){
    return {
      listName: '',
      bgColor: ''
    }
  },
  handleChange: function(e){
    this.setState({
      listName: e.target.value
    });
  },
  chooseBackground: function(hex){
    this.setState({
      bgColor: hex
    });
  },
  handleSubmit: function(e){
    event.preventDefault();
    this.props.add(this.state);
    this.setState({
      listName: '',
      bgColor: ''
    })
  },
  render: function(){
    var styles = {
      colorIndicator: {
        background: this.state.bgColor,
        height: 15,
        width: 15,
        display: "inline-block"
      }
    }
    return (
      <form className="col-sm-6" onSubmit={this.handleSubmit}>
        <h3 className="text-center"> Create New List </h3>
        List Name:
        <input type="text" placeholder="List Name" className="form-control" value={this.state.listName} onChange={this.handleChange} /> <br />
        List Background Color: <span style={styles.colorIndicator}></span>
        <ColorList chooseColor={this.chooseBackground} /> <br />
        <button type="submit" className="btn btn-primary"> Submit </button>
      </form>
    )
  }
});

module.exports = AddList;
