var React = require('react');
var ContentToggle = require('./ContentToggle');

var App = React.createClass({
  getInitialState () {
    return {
      toggleAll: false,
      tacos: [
        { name: 'Carnitas', src: 'tacos/carnitas.png', isOpen: false },
        { name: 'Pollo', src: 'tacos/pollo.png', isOpen: false },
        { name: 'Asada', src: 'tacos/asada.png', isOpen: false },
      ]
    };
  },

  handleToggle (toggledTaco) {
    var newTacos = this.state.tacos.map((taco) => {
      if (toggledTaco === taco)
        toggledTaco.isOpen = !toggledTaco.isOpen;
      return taco;
    });
    this.setState({ tacos: newTacos });
  },

  toggleAll () {
    var allOpen = this.state.tacos.reduce((allOpen, taco) => {
      return allOpen === false ? allOpen : taco.isOpen;
    }, true);
    var allClosed = this.state.tacos.reduce((allClosed, taco) => {
      return allClosed === false ? allClosed : !taco.isOpen;
    }, true);
    var newToggleAll;
    if (allOpen)
      newToggleAll = false;
    else if (allClosed)
      newToggleAll = true;
    else
      newToggleAll = !this.state.toggleAll;
    var newTacos = this.state.tacos.map((taco) => {
      taco.isOpen = newToggleAll;
      return taco;
    });
    this.setState({
      tacos: newTacos,
      toggleAll: newToggleAll
    });
  },

  render () {
    return (
      <div>
        <button onClick={this.toggleAll}>toggle all</button>
        <div>
          {this.state.tacos.map((taco) => (
            <ContentToggle
              key={taco.name}
              onToggle={this.handleToggle.bind(this, taco)}
              summary={taco.name}
              isOpen={taco.isOpen}
            >
              <img height="200" src={taco.src}/>
            </ContentToggle>
          ))}
        </div>
      </div>
    );
  }
});

React.render(<App/>, document.getElementById('app'));

