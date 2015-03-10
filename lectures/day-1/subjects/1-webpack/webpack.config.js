var webpack = require('webpack');

var plugins = [
  new webpack.optimize.CommonsChunkPlugin('public/common.js'),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  })
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(new webpack.optimize.DedupePlugin());
  plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = {
  devtool: process.env.NODE_ENV !== 'production' ? 'eval' : null,

  entry: {
    Home: './app/Home.js',
    Dashboard: './app/Dashboard.js'
  },

  output: {
    filename: 'public/[name].js'
  },

  plugins: plugins,

  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader' }
    ]
  }
};

