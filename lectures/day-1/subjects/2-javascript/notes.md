JavaScript
==========

The hardest part about React is not React, its JavaScript. Most other
options like Angular and Ember provide some sort of templating language
for the UI portion of your code. In React, everything lives in
JavaScript, no new languages to learn.

For example:

```html
<ul ng-repeat="assignment in assignments">
  <li class="assignment">{{assignment.title}}</li>
</ul>

<ul>
  {{#each assignments}}
    <li class="assignment">{{name}}</li>
  {{/each}}
</ul>
```

Both of these are really just mapping `assignments` into list items:

```js
var items = assignments.map(function (assignment) {
  var li = document.createElement('li');
  li.className = 'assignment';
  li.innerHTML = assignment.title;
  return li;
});
```

In React it would look like this:

```js
var items = assignments.map(function (assignment) {
  return React.DOM.li({className: 'assignment'}, assignment.name);
});
```

Unfamiliar with map? It just transforms an array to a new array, you'll
use it all the time in React.

```js
var doubled = [1,2,3].map(function (n) {
  return n * 2;
});
// [2, 4, 6]
```

You'll also need to deal a lot with `context` or rather, what the value
of `this` is. Let's cover some basics quickly:

```js
var Maths = {
  x: 2,
  add: function (y) {
    return this.x + y;
  }
};

Maths.add(3); // 5
```

That probably worked as you'd expect it to. But context is not
determined at the definition of a function, but rather how its called
(opposite of most languages you're probably familiar with).

```js
// borrowing functions
var Other = { x: 1 };
Maths.add.call(Other, 3); // 4
// we can "borrow" `Math`s add method and call it with `Other` as the
// context using `Function.prototype.call`

// Or just copy the method onto `Other` if it likes it so much.
// The object calling the method is the context.
Other.add = Maths.add;
Other.add(3); // 4

// this is weird
x = 10;
add = Maths.add;
add(3); // 13
// I'll let you figure that one out
```

This behavior of JavaScript actually allows for some interesting
abstractions, but most of the time it just screws you up, especially in
a scenario like this:

```js
var Maths = {
  numbers: [1, 2, 3],
  multiplier: 2,
  multiplied: function () {
    return this.numbers.map(function(n) {
      return n * this.multiplier;
    });
  }
};

Maths.multiplied(); // [NaN, NaN, NaN]
```

`forEach` is the one calling your iterator function, and the function is
not being called from `Maths`, its just an anonymous function being
called, so `this` is going to be the global object, which has no
`this.multiplier`--unless it does, and then you're going to be extremely
confused.

There's a function method called `bind` that allows us to ignore how a
function is called, and instead force the context to be the object we
want it to be.

```js
var Maths = {
  numbers: [1, 2, 3],
  multiplier: 2,
  multiplied: function () {
    return this.numbers.map(function(n) {
      return n * this.multiplier;
    }.bind(this)); // <-- problem solved
  }
};

Maths.multiplied(); // [2, 4, 6]
```

The next version of JavaScript makes this simpler with "arrow
functions". Arrow functions let you keep "lexical `this`". In other
words, `this` inside of an arrow function will always be the same `this`
as the context above it. We can also get rid of `: function` in our
object method definitions while we're at it:

```js
var Maths = {
  numbers: [1, 2, 3],
  multiplier: 2,
  multiplied () {
    return this.numbers.map((n) => {
      return n * this.multiplier;
    });
  }
};

Maths.multiplied(); // [2, 4, 6]
```

Browser's don't all support this stuff yet, but we can use it now by
turning on the `?harmony` flag in our JSX webpack loader config.

Finally, bind allows you to not just bind the context, but also bind
some arguments to the function when it gets called.

```js
var AssignmentList = {
  assignments: [/*...*/],

  renderItems: function () {
    return this.assignments.map(function (assignment) {
      var li = document.createElement('li');
      li.onclick = this.handleClick.bind(this, assignment);
      return li;
    });
  },

  handleClick: function (item, event) {
    // now you don't have to go find the `item`, its already bound
    // to the function invocation
  }
};
```

If you've ever wondered what "currying" is, this is it: you pre-bake an
argument to the function that will be there whenever it gets called.

[¡Exercise!]

