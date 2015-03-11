var React = require('react');
var $ = require('jquery');

var SearchItunes = React.createClass({
  
  propTypes: {
    cb: React.PropTypes.func.isRequired
  },
  formatUrl: function(){
    var searchTerm = this.refs.search.getDOMNode().value;
    var entity = this.refs.entity.getDOMNode().value;
    return "https://itunes.apple.com/search?term=" + searchTerm + "&entity=" + entity;
  },
  handleSubmit: function(){
    var url = this.formatUrl();
    console.log(url);
    $.ajax({
      url: url,
      dataType: 'JSONP',
      error: function(error){
        console.log("Error: ", error);
      },
      success: function(data){
        this.props.cb(data.results);
      }.bind(this)
    });
  },
  render: function(){
    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="input-group-inline col-sm-4">
            <input type="text" ref='search' /> 
          </div>
          <div className="input-group-inline col-sm-4">
            <select className="form-control" ref="entity">
              <option value="musicTrack">Music</option>
              <option value="movie">Movies</option>
            </select>
          </div>
          <div className="input-group-inline col-sm-4">
            <button className="btn btn-primary" onClick={this.handleSubmit}>Submit</button>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = SearchItunes;