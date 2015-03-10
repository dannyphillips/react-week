var React = require('react');
var AddChat = require('./AddChat');
var ChatList = require('./ChatList');

var App = React.createClass({
  render: function(){
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <h1 className="text-center"> React Chatroom </h1>
            <div className="col-sm-8 col-sm-offset-2">
              <AddChat url="https://api.parse.com/1/classes/chat" />
            </div>
            <div className="col-sm-10 col-sm-offset-1">
            <div className="panel panel-default">
              <div className="panel-heading">React Chatroom</div>
                <ChatList url="https://api.parse.com/1/classes/chat?order=-createdAt" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

React.render(
  <App />,
  document.getElementById('app')
);