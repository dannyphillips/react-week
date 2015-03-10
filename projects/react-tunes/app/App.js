var React = require('react');
var SearchItunes = require('./SearchItunes');
var Griddle = require('griddle-react');

var App = React.createClass({
  render: function(){
    var griddleMeta = [
      {columnName: 'trackName',displayName: 'Name'},
      {columnName: 'artistName',displayName: 'Artist'},
      {columnName: 'primaryGenreName',displayName: 'Genre'},
      {columnName: 'artworkUrl100',displayName: 'Artwork',customComponent: ImageComponent},
      {columnName: 'trackPrice',displayName: 'Price'},{columnName: 'kind',displayName: 'Type'},
      {columnName: 'trackViewUrl',displayName: 'Online Link',customComponent: UrlComponent}
    ];
    return (
      <span>
        <div className="navbar navbar-default navbar-fixed-top" role="navigation">
          <div className="container">
            <div className="row">
              <div className="col-sm-6">
                /* SearchItunes goes here passing it updateState as cb */
              </div>
            </div>
          </div>
        </div>
        <div className="panel panel-default" >
          <div className="panel-heading">
            /* Have this say "Make a Search" when the "data" state is an empty string and have it change to "Your Search Results" when it's not */
          </div>
          /* Griddle Component Goes Here */
        </div>
      </span>
    )
  }
});

React.render(
  <App />,
  document.getElementById('app')
);
