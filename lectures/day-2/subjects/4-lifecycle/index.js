var React = require('react');

var Ridiculous = React.createClass({
  getInitialState () {
    console.log(this.props.name, 'getInitialState');
    return { foo: true };
  },

  render () {
    console.log(this.props.name, 'render');
    return <div>{this.props.name}: {this.props.now}</div>;
  },

  getDefaultProps () {
    console.log('getDefaultProps');
    return {
      bar: false
    };
  },

  componentWillMount () {
    console.log(this.props.name, 'componentWillMount');
  },

  componentDidMount () {
    console.log(this.props.name, 'componentDidMount');
  },

  componentWillReceiveProps () {
    console.log(this.props.name, 'componentWillReceiveProps');
  },

  shouldComponentUpdate () {
    console.log(this.props.name, 'shouldComponentUpdate');
    return true;
  },

  componentWillUpdate () {
    console.log(this.props.name, 'componentWillUpdate');
  },

  componentDidUpdate () {
    console.log(this.props.name, 'componentDidUpdate');
  },

  componentWillUnmount () {
    console.log(this.props.name, 'componentWillUnmount');
  }

});

var App = React.createClass({
  getInitialState () {
    return {
      now: Date.now(),
      killStuff: false
    };
  },

  setStateWithConsoleGroup (state) {
    console.group();
    this.setState(state, () => {
      console.groupEnd();
    });
  },

  changeStuff () {
    this.setStateWithConsoleGroup({
      now: Date.now()
    });
  },

  killStuff () {
    this.setStateWithConsoleGroup({ killStuff: true });
  },

  unKillStuff () {
    this.setStateWithConsoleGroup({ killStuff: false });
  },

  render () {
    return (
      <div>
        <button onClick={this.changeStuff}>change now</button>
        <button onClick={this.killStuff}>kill stuff</button>
        <button onClick={this.unKillStuff}>unkill stuff</button>
        {!this.state.killStuff && (
          <div>
            <Ridiculous now={this.state.now} name="one"/>
          </div>
        )}
      </div>
    );
  }
});

React.render(<App/>, document.getElementById('app'));

