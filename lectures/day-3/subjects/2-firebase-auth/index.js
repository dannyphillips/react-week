var React = require('react');

var Firebase = require('firebase');
var HOST = "https://react-week-demo.firebaseio.com";
var ref = new Firebase(HOST);

var toArray = (obj) => {
  if (obj == null)
    return [];
  return Object.keys(obj).map((key) => {
    obj[key]._key = key;
    return obj[key];
  });
};

var Dashboard = React.createClass({

  getInitialState () {
    return {
      stuff: []
    };
  },

  componentDidMount () {
    this.ref = ref.child(`users/${this.props.user}`);
    this.ref.on('value', this.handleFirebaseChange);
  },

  componentWillUnmount () {
    this.ref.off('value', this.handleFirebaseChange);
  },

  handleFirebaseChange (snapshot) {
    this.setState({ stuff: toArray(snapshot.val()) });
  },

  handleSubmit (event) {
    event.preventDefault();
    var name = event.target.elements[0].value;
    this.ref.push({ name });
    event.target.reset();
  },

  remove (thing) {
    this.ref.child(thing._key).remove();
  },

  render () {
    var { stuff } = this.state;
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <input/> <button type="submit">go</button>
        </form>
        <ul>
          {stuff.map((thing) => (
            <li>
              {thing.name}{' '}
              <button onClick={this.remove.bind(this, thing)}>remove</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
});

var Home = React.createClass({
  login () {
    ref.authWithOAuthPopup('github', (err, authData) => {
      if (err) {
        console.log(err);
        alert('ERROR!!!!! CHECK THE MF CONSOLE!');
      }
      else {
        this.props.onAuth(authData.uid);
      }
    });
  },

  render () {
    return (
      <div>
        <h1>YOU ARENT LOGGED IN!!!!!</h1>
        <button onClick={this.login}>Login with Github</button>
      </div>
    );
  }
});

var App = React.createClass({
  getInitialState () {
    return {
      user: null
    };
  },

  handleAuth (uid) {
    this.setState({user: uid});
  },

  render () {
    return (
      <div>
        {this.state.user === null ? (
          <Home onAuth={this.handleAuth} />
        ) : (
          <Dashboard user={this.state.user}/>
        )}
      </div>
    );
  }
});

React.render(<App/>, document.getElementById('app'));

window.ref = ref;

