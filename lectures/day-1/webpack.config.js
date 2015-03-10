var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var webpack = require('webpack');
var React = require('react');

var CODE = __dirname+'/subjects';
var IGNORE = ['1-webpack'];
var DIRS = fs.readdirSync(CODE).filter(function(dir) {
  return isDirectory(path.join(CODE, dir)) && IGNORE.indexOf(dir) === -1;
});

makeIndex();

module.exports = {

  devtool: 'eval',

  entry: DIRS.reduce(function (entries, dir) {
    entries[dir] = path.join(CODE, dir, 'index.js');
    return entries;
  }, {}),

  output: {
    path: '__build__',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js',
    publicPath: '__build__'
  },

  module: {
    loaders: [
      { test: /\.js$/, loader: 'jsx-loader?harmony' }
    ]
  },

  plugins: [
    new webpack.optimize.CommonsChunkPlugin('shared.js')
  ]

};

function makeIndex () {
  var list = DIRS.map(function (dir) {
    return React.DOM.li({}, React.DOM.a({href: '/'+dir}, dir.replace(/-/g, ' ')));
  });
  var markup = React.renderToStaticMarkup((
    React.DOM.html({},
      React.DOM.link({rel: 'stylesheet', href: '/shared.css'}),
      React.DOM.body({id: 'index'},
        React.DOM.ul({}, list)
      )
    )
  ));
  fs.writeFileSync('./subjects/index.html', markup);

  DIRS.forEach(function (dir) {
    var dirIndexHTMLMarkup = React.renderToStaticMarkup((
      React.DOM.html({},
        React.DOM.link({rel: 'stylesheet', href: '/shared.css'}),
        React.DOM.body({},
          React.DOM.div({ id: 'app' }),
          React.DOM.script({src: '/__build__/shared.js'}),
          React.DOM.script({src: '/__build__/'+dir+'.js'})
        )
      )
    ));
    fs.writeFileSync('./subjects/'+dir+'/index.html', dirIndexHTMLMarkup);
  });
}

function isDirectory(dir) {
  return fs.lstatSync(dir).isDirectory();
}

