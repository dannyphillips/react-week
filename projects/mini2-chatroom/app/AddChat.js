var React = require('react');
var $ = require('jquery');

var AddChat = React.createClass({
  propTypes: {
    url: React.PropTypes.string.isRequired
  },
  getDefaultProps: function(){
    return {
      url: 'https://api.parse.com/1/classes/chat'
    }
  },
  addChat: function(){
    $.ajax({
      url: this.props.url,
      type: 'POST',
      data: JSON.stringify({text: this.refs.newChatInput.getDOMNode().value}),
      beforeSend: function(request) {
        request.setRequestHeader("X-Parse-Application-Id", '1tNw34UWSqjkyu4byPGV3q1G6hZcYQmYuvqx0abS');
        request.setRequestHeader("X-Parse-REST-API-Key", 'ALlZ2WvYnreWNPfHQXoRRiDWt0pXkryYINGAzqnc');
        request.setRequestHeader("Content-Type", 'application/json');
      },
      error: function() {
        console.log('error on post');
      },
      success: function() {
        this.refs.newChatInput.getDOMNode().value = '';
        console.log('Successful Post');
      }.bind(this)
    })
  },
  handleSubmit: function(e){
    if(e.keyCode === 13){
      this.addChat();
    }
  },
  render: function(){
    return (
      <div className="form-group">
        <input
          type="text"
          placeholder="Compose Messsage"
          ref="newChatInput"
          className="form-control"
          onKeyDown={this.handleSubmit} />
      </div>
    )
  }
});

module.exports = AddChat;