var React = require('react');
var Tabs = require('./Tabs');
var ContentToggle = require('./ContentToggle');
var createMediaListener = require('./createMediaListener');

var MediaState = (media) => {
  console.log(media);
  var mediaListener = createMediaListener(media);

  return {
    getInitialState () {
      return {
        media: mediaListener.getState()
      };
    },

    componentDidMount () {
      mediaListener.listen((media) => {
        this.setState({ media });
      });
    },

    componentWillUnmount () {
      mediaListener.dispose();
    }
  };
};

var App = React.createClass({

  mixins: [
    MediaState({
      mobile: '(max-width: 700px)'
    })
  ],

  getInitialState () {
    return {
      steps: [
        { name: 'Step 1', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' },
        { name: 'Step 2', description: 'Eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui id est.' },
        { name: 'Step 3', description: 'Sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit.' },
      ]
    };
  },

  renderTabs () {
    return (
      <Tabs data={this.state.steps}/>
    );
  },

  renderSliders () {
    return (
      <div>
        {this.state.steps.map((step) => (
          <ContentToggle summary={step.name}><p>{step.description}</p></ContentToggle>
        ))}
      </div>
    );
  },

  render () {
    return this.state.media.mobile ? this.renderSliders() : this.renderTabs();
  }
});

React.render(<App/>, document.getElementById('app'));

