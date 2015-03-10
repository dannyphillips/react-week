module.exports = {
  entry: "./app/App.js",
  output: {
    path: './public',
    publicPath: "/",
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {test: /\.js$/, loader: 'jsx-loader'}
    ]
  }
};
