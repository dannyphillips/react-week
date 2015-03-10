React Basics
============

```js
// index.js
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

  handleToggle (toggledTaco, isOpen) {
    var newTacos = this.state.tacos.map((taco) => {
      if (toggledTaco === taco)
        toggledTaco.isOpen = isOpen;
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
```

```js
// ContentToggle.js

var React = require('react');

var ContentToggle = React.createClass({
  getInitialState () {
    return {
      isOpen: this.props.isOpen
    };
  },

  handleClick () {
    this.setState({ isOpen: !this.state.isOpen }, () => {
      this.props.onToggle(this.state.isOpen);
    });
  },

  componentWillReceiveProps (newProps) {
    if (newProps.isOpen != null)
      this.setState({ isOpen: newProps.isOpen });
  },

  render () {
    var summaryClassName = "ContentToggle__Summary";
    if (this.state.isOpen)
      summaryClassName += " ContentToggle__Summary--is-open";
    return (
      <div className="ContentToggle">
        <div onClick={this.handleClick} className={summaryClassName}>
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
```

Can just get rid of state `ContentToggle` now:

```js
// ContentToggle.js
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
```

```js
// index.js
var App = React.createClass({
  // ...

  handleToggle (toggledTaco) {
    var newTacos = this.state.tacos.map((taco) => {
      if (toggledTaco === taco)
        toggledTaco.isOpen = !toggledTaco.isOpen;
      return taco;
    });
    this.setState({ tacos: newTacos });
  },

  //...
});
```

- Must implement `onToggle`
- We didn't really get rid of stuff, we just pushed it up a level
- We did get rid of synchronizing state, though
- No silver bullets, I'd probably go the state synchronization route so
  that using `ContentToggle` in simple cases doesn't require my app to
  manage the toggle's state


