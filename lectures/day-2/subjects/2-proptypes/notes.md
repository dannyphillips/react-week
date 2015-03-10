Props
=====

Props are a lot like element attributes

```js
var element = <input type="checkbox" required="true" />;
```

We use them in images

```js
var App = React.createClass({
  render () {
    var users = USERS.map((user) => {
      var hash = md5(user.email);
      var url = `${GRAVATAR_URL}/${hash}?s=${styles.avatar.width*2}`;
      return (
        <li>
          <img style={styles.avatar} src={url} /> {user.name}
        </li>
      );
    });
    return (
      <div>
        <h1>Users</h1>
        <ul style={styles.list}>{users}</ul>
      </div>
    );
  }
});
```

Sometimes components get too big, refactor just like functions

```js
// index.js
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
```

```js
// lib/Gravatar.js

var React = require('react');
var md5 = require('MD5');
var GRAVATAR_URL = "http://gravatar.com/avatar";

var styles = {
  avatar: {
    height: 36,
    width: 36,
    borderRadius: '50%',
    border: '1px solid #ccc',
  },
};

var Gravatar = React.createClass({
  render () {
    var hash = md5(this.props.email);
    var url = `${GRAVATAR_URL}/${hash}?s=${styles.avatar.width*2}`;
    return <img style={styles.avatar} src={url} />;
  }
});

module.exports = Gravatar;
```

We can validate propTypes to help others consume our components

```js
var Gravatar = React.createClass({
  propTypes: {
    email: React.PropTypes.string.isRequired,
  },

  // ...

});
```

There are lots of proptypes:
http://facebook.github.io/react/docs/reusable-components.html

<proptypes-soapbox>
...
</proptypes-soapbox>

We can create our own propTypes:

```js
// lib/emailProp.js
var isEmail = require('./isEmail');

var emailProp = (props, propName, componentName) => {
  var email = props.email;
  if (email !== undefined && !isEmail(email))
    return new Error(`Invalid prop "${propName}" supplied to "${componentName}", "${email}" does not look like an email address"`);
};

module.exports = emailProp;
```

```js
// lib/Gravatar.js
var Gravatar = React.createClass({
  propTypes: {
    email: emailProp
  }

  // ...
});
```

Don't forget to support `isRequired`.

```js
// lib/emailProp.js
var isEmail = require('./isEmail');

var emailProp = (props, propName, componentName, location, isRequired) => {
  var email = props.email;
  if (isRequired && email === undefined)
    return new Error(`Required prop "${propName}" was not specified in "${componentName}".`);
  if (email !== undefined && !isEmail(email))
    return new Error(`Invalid prop "${propName}" supplied to "${componentName}", "${email}" does not look like an email address"`);
};

emailProp.isRequired = (...args) => {
  return emailProp.apply(emailProp, args.concat([true]));
};

module.exports = emailProp;
```



