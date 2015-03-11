var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Link = Router.Link;
var firebaseUtils = require('../utils/firebaseUtils');

var Main = React.createClass({
  getInitialState: function(){
    return {
      loggedIn: firebaseUtils.isLoggedIn()
    }
  },
  handleChange: function(loggedIn){
    this.setState({
      loggedIn: loggedIn
    });
  },
  componentWillMount: function(){
    firebaseUtils.onChange = this.handleChange;
  },
  render: function(){
    /* Code Here */
    return (
      <span>
        <nav className="navbar navbar-default navbar-static-top">
          <div className="container">
            <div className="navbar-header">
              <Link to="home" className="navbar-brand"> NBA Routes </Link>
            </div>
            <ul className="nav navbar-nav pull-right">
              <li><Link to="home" className="navbar-brand"> Home </Link></li>
              {register}
              {loginOrOut}
            </ul>
          </div>
        </nav>
        <div className="container">
          <div className="row">
            <RouteHandler />
          </div>
        </div>
      </span>
    )
  }
});

module.exports = Main;