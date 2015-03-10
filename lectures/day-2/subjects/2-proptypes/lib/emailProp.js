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

