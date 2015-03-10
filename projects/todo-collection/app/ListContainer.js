var React = require('react');
var AddItem = require('./AddItem');
var List = require('./List');
var AddList = require('./AddList');

var ListContainer = React.createClass({
  getInitialState: function(){
    return {
      list: []
    }
  },
  handleAddItem: function(newItem){
    this.setState({
      list: this.state.list.concat([newItem])
    });
  },
  handleRemoveItem: function(index){
    var newList = this.state.list;
    newList.splice(index, 1);
    this.setState({
      list: newList
    })
  },
  render: function(){
    var styles = {
      remove: {
        top: 15,
        color: "rgb(222, 79, 79)",
        float: "left",
        cursor: 'pointer'
      },
      container: {
        border: "1px solid rgb(208, 208, 208)",
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 5,
        background: this.props.bg
      }
    };
    return (
      <div className="col-sm-6">
        <div className="col-sm-12" style={styles.container}>
          <span
            className="glyphicon glyphicon-remove"
            style={styles.remove}
            onClick={this.props.remove.bind(null, this.props.index)}>
          </span>
          <h3 className="text-center">
            {this.props.title}
          </h3>
          <AddItem add={this.handleAddItem}/>
          <List items={this.state.list} remove={this.handleRemoveItem}/>
        </div>
      </div>
    )
  }
});

module.exports = ListContainer;