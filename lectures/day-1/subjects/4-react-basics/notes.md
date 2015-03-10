React Basics
============

Render
------

```js
React.render(<div>Hello!</div>, document.getElementById('app'));
```

`createClass`
-------------

```js
var ContentToggle = React.createClass({
  render () {
    return (
      <div>
        <div>Summary</div>
        <div>Details</div>
      </div>
    );
  }
});

React.render(<ContentToggle/>, document.getElementById('app'));
```

CSS
---

```js
var ContentToggle = React.createClass({
  render () {
    return (
      <div className="ContentToggle">
        <div className="ContentToggle__Summary">Summary</div>
        <div className="ContentToggle__Details">Details</div>
      </div>
    );
  }
});

React.render(<ContentToggle/>, document.getElementById('app'));
```

Props
-----

```js
var ContentToggle = React.createClass({
  render () {
    return (
      <div className="ContentToggle">
        <div className="ContentToggle__Summary">
          {this.props.summary}
        </div>
        <div className="ContentToggle__Details">
          {/* children are just a prop! */}
          {this.props.children}
        </div>
      </div>
    );
  }
});

React.render((
  <ContentToggle summary="Tacos">
    <img src="/taco.jpg"/>
  </ContentToggle>
), document.getElementById('app'));
```

getInitialState
---------------

```js
var ContentToggle = React.createClass({
  getInitialState () {
    return {
      isOpen: false
    }
  },

  render () {
    var summaryClass = "ContentToggle__Summary";
    if (this.state.isOpen)
      summaryClass += " ContentToggle__Summary--is-open";
    return (
      <div className="ContentToggle">
        <div className={summaryClass}>
          {this.props.summary}
        </div>
        <div className="ContentToggle__Details">
          {this.state.isOpen && this.props.children}
        </div>
      </div>
    );
  }
});

React.render((
  <ContentToggle summary="Tacos">
    <img src="/taco.jpg"/>
  </ContentToggle>
), document.getElementById('app'));
```

Events & `setState`
-------------------

```js
var ContentToggle = React.createClass({
  getInitialState () {
    return {
      isOpen: false
    }
  },

  handleClick () {
    this.setState({
      isOpen: !this.state.isOpen
    });
  },

  render () {
    var summaryClass = "ContentToggle__Summary";
    if (this.state.isOpen)
      summaryClass += " ContentToggle__Summary--is-open";
    return (
      <div className="ContentToggle">
        <div onClick={this.handleClick} className={summaryClass}>
          {this.props.summary}
        </div>
        <div className="ContentToggle__Details">
          {this.state.isOpen && this.props.children}
        </div>
      </div>
    );
  }
});

React.render((
  <ContentToggle summary="Tacos">
    <img src="/taco.jpg"/>
  </ContentToggle>
), document.getElementById('app'));
```

Rendering a Data-driven List
----------------------------

```js
var App = React.createClass({
  getInitialState () {
    return {
      tacos: [
        { name: 'Carnitas', src: '/tacos/carnitas.jpg' },
        { name: 'Pollo', src: '/tacos/pollo.jpg' },
        { name: 'Asada', src: '/tacos/asada.jpg' },
      ]
    };
  },

  render () {
    return (
      <div>
        <h1>Tacos!</h1>
        <div>
          {this.state.tacos.map(taco => (
            <ContentToggle summary={taco.name}>
              <img src={taco.src}/>
            </ContentToggle>
          ))}
        </div>
      </div>
    );
  }
});

React.render(<App/>, document.getElementById('app'));
```

Component Communication
-----------------------

```js
var ContentToggle = React.createClass({
  getInitialState () {
    return {
      isOpen: false
    }
  },

  handleClick () {
    this.setState({
      isOpen: !this.state.isOpen
    }, () => {
      if (this.props.onToggle)
        this.props.onToggle(this.state.isOpen);
    });
  },

  render () {
    var summaryClass = "ContentToggle__Summary";
    if (this.state.isOpen)
      summaryClass += " ContentToggle__Summary--is-open";
    return (
      <div className="ContentToggle">
        <div onClick={this.handleClick} className={summaryClass}>
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
        { name: 'Carnitas', droolCount: 0, src: '/tacos/carnitas.jpg' },
        { name: 'Pollo', droolCount: 0, src: '/tacos/pollo.jpg' },
        { name: 'Asada', droolCount: 0, src: '/tacos/asada.jpg' },
      ]
    };
  },

  handleTacoToggle (taco, isOpen) {
    if (isOpen) {
      taco.droolCount += 1;
      this.setState({ tacos: this.state.tacos });
    }
  },

  render () {
    return (
      <div>
        <h1>Tacos!</h1>
        <div>
          {this.state.tacos.map(taco => (
            <ContentToggle
              summary={taco.name}
              onToggle={this.handleTacoToggle.bind(this, taco)}
            >
              <p>Drool Count: {taco.droolCount}</p>
              <img src={taco.src}/>
            </ContentToggle>
          ))}
        </div>
      </div>
    );
  }
});

React.render(<App/>, document.getElementById('app'));
```

[Exercise]

- Sort the tacos by name (can bring in sort-by again)
- Make the enter key do the same thing as click on ContentToggle
  - need `tabIndex="0"` on the summary
  - if using `onKeyPress` use `event.key`, otherwise use `event.keyCode`
    - NOTE: React uses "Synthetic Events", so if you `console.log(event)`
      you'll just get an object with nulled out keys.
- focus the details after click/keyboard interaction
  - use `tabIndex="-1"` so that you can programmatically focus it,
    w/o putting into the tab navigation scope
  - http://facebook.github.io/react/docs/more-about-refs.html

