var React = require('react');
var $ = require('jquery');

var SearchItunes = React.createClass({
  render: function(){
    return (
      <div className="row">
        <div className="col-sm-12">
          <div className="input-group-inline col-sm-4">
            /* 'search' input field goes here */
          </div>
          <div className="input-group-inline col-sm-4">
            /* 'entity' select tag goes here */
          </div>
          <div className="input-group-inline col-sm-4">
            /*handleSubmit button goes here*/
          </div>
        </div>
      </div>
    );
  }
});

module.exports = SearchItunes;