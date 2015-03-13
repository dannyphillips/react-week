var React = require('react');
var githubActions = require('../../actions/githubActions');
var githubStore = require('../../stores/githubStore');

var Middle = React.createClass({
  getInitialState: function(){
    return {
      repos: githubStore.getRepos()
    }
  },
  componentWillReceiveProps: function(obj){
    githubActions.getUserRepos(obj.username);
  },
  componentDidMount: function(){
    githubActions.getUserRepos(this.props.username);
    githubStore.addChangeListener(this._onChange);
  },
  componentWillUnmount: function(){
    githubStore.removeChangeListener(this._onChange);
  },
  _onChange: function(){
    this.setState({
      repos: githubStore.getRepos()
    });
  },
  render: function(){
    var repos = this.state.repos.map(function(repo, index){
      return (
        <li className="list-group-item" key={index}>
          {repo.html_url && <h4><a href={repo.html_url}>{repo.name}</a></h4>}
          {repo.description && <p>{repo.description}</p>}
        </li>
      )
    });
    return (
      <div>
        <h3> User Repos </h3>
        <ul className="list-group">
          {repos}
        </ul>
      </div>
    )
  }
});

module.exports = Middle;