Firebase
========

https://www.firebase.com/docs/web/guide/user-auth.html

- authenticate
- update ref path to the user
- security rules

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "auth != null && auth.uid == $uid"
      }
    }
  }
}
```

```js
var Home = React.createClass({
  login () {
    ref.authWithOAuthPopup('github', (err, authData) => {
      this.props.onAuth(authData.uid);
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
```



