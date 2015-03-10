var React = require('react');

var ContentToggle = React.createClass({
  getInitialState () {
    return {
      isOpen: false
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

var App = React.createClass({
  getInitialState () {
    return {
      tacos: [
        { name: 'Carnitas', src: 'tacos/carnitas.png', drools: 0 },
        { name: 'Pollo', src: 'tacos/carnitas.png', drools: 0 },
        { name: 'Asada', src: 'tacos/asada.png', drools: 0 },
      ]
    };
  },

  handleToggle (taco, isOpen) {
    if (isOpen) {
      taco.drools++;
      this.forceUpdate();
    }
  },

  render () {
    return (
      <div>
        {this.state.tacos.map((taco) => (
          <ContentToggle
            onToggle={this.handleToggle.bind(this, taco)}
            summary={`${taco.name} drools: ${taco.drools}`}
          >
            <img height="200" src={taco.src}/>
          </ContentToggle>
        ))}
      </div>
    );
  }
});

React.render(<App/>, document.getElementById('app'));

