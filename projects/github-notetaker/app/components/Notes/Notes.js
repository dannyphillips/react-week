var React = require('react');
var notesStore = require('../../stores/notesStore');
var AddNote = require('./AddNote');
var NotesList = require('./NotesList');
var noteActions = require('../../actions/noteActions');

var Notes = React.createClass({
  getInitialState: function(){
    return {
      notes: notesStore.getState().notes
    };
  },
  componentWillReceiveProps: function(obj){
    noteActions.changeUser(obj.username);
  },
  componentDidMount: function(){
    noteActions.changeUser(this.props.username);
    notesStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function(){
    notesStore.removeChangeListener(this._onChange);
  },
  render: function(){
    return (
      <div>
        <h3> Notes for {this.props.username} </h3>
        <AddNote username={this.props.username} />
        <NotesList notes={this.state.notes}/>
      </div>
    )
  },
  _onChange: function(){
    this.setState({
      notes: notesStore.getState().notes
    })
  }
});

module.exports = Notes;