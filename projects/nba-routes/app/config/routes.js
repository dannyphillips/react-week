var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Main = require('../components/Main');
var Home = require('../components/Home');
var Register = require('../components/login-register/Register');
var Login = require("../components/login-register/Login");
var Logout = require('../components/login-register/Logout');
var Schedule = require('../components/Schedule');
var AddGame = require('../components/secure/AddGame');

var routes = (
  <Route handler={Main} >
    <Route name="home" path="/" handler={Home} />
    <Route name="login" handler={Login} />
    <Route name="logout" handler={Logout} />
    <Route name="register" handler={Register} />
    <Route name="addGame" path="/addgame/:team" handler={AddGame} />
    <Route name="schedule" path="/schedule/:team" handler={Schedule} />
  </Route>
);

module.exports = routes;