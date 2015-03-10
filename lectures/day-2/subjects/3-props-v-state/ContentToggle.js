var React = require('react');

var ContentToggle = React.createClass({
  handleClick () {
    this.props.onToggle();
  },

  render () {
    var summaryClassName = "ContentToggle__Summary";
    if (this.props.isOpen)
      summaryClassName += " ContentToggle__Summary--is-open";
    return (
      <div className="ContentToggle">
        <div onClick={this.handleClick} className={summaryClassName}>
          {this.props.summary}
        </div>
        <div className="ContentToggle__Details">
          {this.props.isOpen && this.props.children}
        </div>
      </div>
    );
  }
});

module.exports = ContentToggle;

