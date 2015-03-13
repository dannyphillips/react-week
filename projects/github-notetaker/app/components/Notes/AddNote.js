var React = require('react');
var noteActions = require('../../actions/noteActions');
var notesStore = require('../../stores/notesStore');

var AddNote = React.createClass({
  handleSubmit: function(){
    var user = notesStore.getState().user;
    var newNote = this.refs.note.getDOMNode().value;
    this.refs.note.getDOMNode().value = '';
    noteActions.addNote({user: user, note: newNote});
  },
  render: function(){
    return (
      <div className="input-group cushion">
        <input type="text" ref="note" className="form-control" placeholder="Add Note" />
        <span className="input-group-btn">
          <button className="btn btn-default" type="button" onClick={this.handleSubmit}>Submit</button>
        </span>
      </div>
    )
  }
});

module.exports = AddNote;