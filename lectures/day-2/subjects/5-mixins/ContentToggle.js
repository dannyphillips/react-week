var React = require('react');

var ContentToggle = React.createClass({
  getInitialState () {
    return {
      isOpen: false
    };
  },

  getDefaultProps () {
    return {
      onToggle () {}
    };
  },

  handleClick () {
    this.setState({ isOpen: !this.state.isOpen }, () => {
      this.props.onToggle(this.state.isOpen);
    });
  },

  render () {
    return (
      <div className="ContentToggle">
        <div onClick={this.handleClick} className="ContentToggle__Summary">
          {this.props.summary}
        </div>
        <div className="ContentToggle__Details">
          {this.state.isOpen && this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = ContentToggle;
