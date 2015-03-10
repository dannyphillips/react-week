Webpack
=======

Script tags
-----------

```html
<script src="js/ReactRouter.js"></script>
<script src="js/React.js"></script>
<script src="js/Home.js"></script>
```

- Have to know the dependencies and ordering
- Inefficient because browsers only make so many requests
- Can't use package management, have to copy/paste in prebuild vendor
  code
- Can't transpile to use the new features in JavaScript

Concat builds
-------------

```js
grunt.initConfig({
  concat: {
    files: {
      home: [
        'js/React.js',
        'js/ReactRouter.js',
        'js/Home.js',
      ]
    }
  }
});
```

- Still have to know order
- What about a new page?

```js
grunt.initConfig({
  concat: {
    files: {
      home: [
        'js/React.js',
        'js/ReactRouter.js',
        'js/Home.js',
      ],
      calendar: [
        'js/React.js',
        'js/ReactRouter.js',
        'js/Dashboard.js',
      ]
    }
  }
});
```

- making them download my vendor code on every page :(

```js
grunt.initConfig({
  concat: {
    files: {
      common: [
        'js/React.js',
        'js/ReactRouter.js',
      ],
      home: [
        'js/Home.js',
      ],
      calendar: [
        'js/Dashboard.js',
      ]
    }
  }
});
```

- Have to know all my common stuff
  - easy when its all vendor code, but not shared app code

```js
var Home = React.createClass({});
```

- Globals everywhere
  - difficult to reason about use and definition
    - easy to grep
    - tools can show you your dependency graph
  - implicit coupling
  - changing code load order can change its definition
  - hard to write a test w/o loading in your entire app

Modules to the rescue
---------------------

```js
var React = require('react');
var Home = React.createClass({/* ... */});
module.exports = Home;
```

- can use package management (npm)
- module declare their own dependencies, so webpack can build the
  dependency graph for us
- no globals, so now we get:
  - reasonability of module use
    - grep for require statements
    - look at a graph build by webpack
  - explicit coupling
  - code always loads in the right order
  - can test in isolation (test require only the modules they need)

### Webpack building

```sh
webpack js/Home.js build/bundle.js
```

Or you can use a config file:

```js
module.exports = {
  entry: {
    Home: 'js/Home',
    Dashboard: 'js/Dashboard'
  },
  output: {
    filename: 'build/[name].js'
  }
};
```

Plugins
-------

We can use a plugin to have it automatically pull out common stuff:

```js
module.exports = {
  entry: {
    Home: 'js/Home',
    Dashboard: 'js/Dashboard'
  },
  output: {
    filename: 'build/[name].js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('build/common.js')
  ]
};
```

Now on the homepage, we can require the two files it needs:

```html
<script src="build/common.js"></script>
<script src="build/Home.js"></script>
```

Loaders
-------

- Better name might be transforms?
- Whenever you require something, loaders that match the require path
  will transform the file contents.

```js
module.exports = {
  // ...
  module: {
    loaders: [
      { test: /\.js$/, loader: 'jsx-loader?harmony' }
    ]
  }
};
```

```js
var React = require('react');
var foo = <div>hi</div>
var add = (x, y) => x + y;
```

```js
var React = __webpack_require__[0];
var foo = React.createElement("div", null, "hi");
var add = function (x, y) { return x + y };
```

Source maps
-----------

```js
module.exports = {
  // ...
  devtool: 'eval' // 'source-map'
};
```

Then we just see our original code:

```js
var React = require('react');
var foo = <div>hi</div>
var add = (x, y) => x + y;
```

[¡EXERCISE!]

More Features
-------------

- CSS
- Images (even runs css image definition through loaders!)
- Fonts
- Long-term caching (via hashed file names)
- Code splitting
- AMD, CJS, ES6 Modules
- Loaders to avoid crazy hacks to make bad vendor modules behave
- I could go on ...

