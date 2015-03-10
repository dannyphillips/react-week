var React = require('react');
var Gravatar = require('./lib/Gravatar');
var USERS = [
  { id: 1, name: 'Ryan Florence', email: 'rpflorence@gmail.com' },
  { id: 2, name: 'Michael Jackson', email: 'mjijackson@gmail.com' }
];

var styles = {
  list: {
    listStyleType: 'none',
    padding: 0,
  }
};

var App = React.createClass({
  render () {
    var users = USERS.map((user) => (
      <li key={user.name}>
        <Gravatar email={user.email} />{' '}
        {user.name}
      </li>
    ));

    return (
      <div>
        <h1>Users</h1>
        <ul style={styles.list}>
          {users}
        </ul>
      </div>
    );
  }
});

React.render(<App/>, document.getElementById('app'));

