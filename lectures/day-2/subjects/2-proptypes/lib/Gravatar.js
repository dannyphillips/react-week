var React = require('react');
var md5 = require('MD5');
var emailProp = require('./emailProp');
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
  propTypes: {
    email: emailProp.isRequired
  },

  render () {
    var hash = md5(this.props.email);
    var url = `${GRAVATAR_URL}/${hash}?s=${styles.avatar.width*2}`;
    return <img style={styles.avatar} src={url} />;
  }
});

module.exports = Gravatar;
