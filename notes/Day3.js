React Weeek // Day 3

Takeaways
- use event.preventDefault();
- use event.target.reset();

----:FIREBASE----
to Remove
- this.firebaseRef.child.remove();

Firebase is really fast!


Authentication
- localStorage

React-Router
= { Route, RouteHandler } = require('react-router');

var routes = ( 
	<Route handler={App}>
 		<Route name="users" handler={users}/>
		<Route name="about" handler={about}/>
	</Route>
);

Router.run(routes, (Handler) => {
	React.render....
}

you can use HistoryLocation and remove the # sign on the router. 
