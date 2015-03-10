
var React = require('react');
var input = React.DOM.input({type: 'password'});
debugger;
React.render(input, document.body);


/*


var { View, Model, Collection } = require('backbone');
var { template, debounce } = require('underscore');
var $ = require('jquery');

var WikipediaResults = Collection.extend({
  model: Model,
  search: function (term) {
    return $.ajax({
      url: 'http://en.wikipedia.org/w/api.php',
      dataType: 'jsonp',
      data: {
        action: 'opensearch',
        format: 'json',
        search: term
      }
    }).promise().then((results) => {
      var models = results[1].map((title, index) => {
        return { title: title, description: results[2][index] };
      });
      this.reset(models);
    });
  }
});

var App = View.extend({
  template: template(`
    <h1>Wikipedia</h1>
    <input class="search"/>
    <ul>
      <% results.forEach(function(result) { %>
        <li>
          <h2><%= result.get('title') %></h2>
          <p><%= result.get('description') %></p>
        </li>
      <% }) %>
    </ul>
  `),

  render () {
    this.$el.html(this.template({
      results: this.collection
    }));
  }
});

var app = new App({
  el: document.getElementById('app'),
  collection: new WikipediaResults()
});

app.render();
*/

