# NBA Routes

####Objectives
The purpose of this project is get you comfortable with routing using React Router as well as creating real time applications with Firebase as your data store. A very common use case in web development is securing certain routes so only authenticated users may see those routes. We'll do just that in this application. Every user will be able to see the certain teams schedule, but only authenticated users will be able to create a name game in that teams schedule. Get used to what the application is doing, the example app can be found [HERE](http://reactweek.com/projects/nba-routes).

Some side notes before we get started.
* This project will contain a lot of bootstrap boilerplate. Feel free to remove this and create your own if you'd like.
* Notice the original file structure is just like every other project we've done thus far with a few additions. One of those additions is that our public folder has an images folder which has a "spritesheet.png" file in it. This, as you've probably guessed, is just a sprite sheet of all the images we'll be using in this app. If you're new to "Sprites", quickly read [THIS](http://css-tricks.com/css-sprites/) article to get caught up to speed. It should take you no more than 5 minutes.
* You'll need to create your own Firebase account and new project. To do that head over to [Firebase.com](firebase.com) and sign up for an account. Once you sign up and login, you'll be taken to your dashboard where you can create a new app. For now, create a new app in Firebase, then click on the "Login and Auth" section of your firebase and then click the box that says "Enable Email & Password Authentication". This will allow us to use email and password authentication in our firebase.
* This project is intentionally rather large. If you don't get done, don't sweat it. The biggest thing to remember is that you're here to learn, which is usually a by product of finishing the repo. If you don't get done but you feel comfortable with authenticated routes, routing, and some basic firebase functions, you're in a good spot.

###Step 1: Code Architecture
Let's get familiar with the code we're given.

The default folder structure should look like this
```
├── app/
│   ├── App.js
|   ├── components/
|   ├── ├── login-register/
|   ├── ├── ├── Login.js
|   ├── ├── ├── Logout.js
|   ├── ├── ├── Register.js
|   ├── ├── secure/
|   ├── ├── ├── AddGame.js
|   ├── ├── Main.js
|   ├── ├── Home.js
|   ├── config/
|   ├── ├── routes.js
|   ├── utils/
|   ├── ├── authenticated.js
|   ├── ├── sprite.js
|   ├── ├── nbaTeams.js
|   ├── ├── firebaseUtils.js
├── public/
│   ├── index.html
|   ├── images/
│   ├── ├── spritesheet.png
├── webpack.config.js
├── package.json
├── README.md
├── .gitignore
```

That's a pretty big list. Don't panic. Remember one of the benefits of using React is that we're able to keep things very compartmentalized as we see in our folder structure above. Although you probably already have a good idea of what's going to happen with the folder structure, let's take a little deeper dive and look at each piece and its purpose.

First, notice our components folder is split into three sections: ```login-register```, ```secure```, and any other components. As you can imagine, all of our components that deal with login/logout and registration will go in the login-register folder, our components which we want only authenticated users to view (because components will be tied to routes) will go in the secure folder, and any other component will just go in the components folder.

Our ```routes.js``` file in our ```config``` folder is going to be the definition of our routes with React Router.

Now let's take a look at the ```utils``` folder.
  - ```authenticated.js``` will be a mixin we put on any components we want to be a "protected" component (or route). React Router gives us a hook into its life cycle and this authenticated component will run before a component is mounted, it will check if the user is authenticated, if he/she is not, it will redirect them to the login route.
  - ```firebaseUtils.js``` will be a bunch of helper methods for communicating with firebase.
  - ```nbaTeams.js``` is just an array and an object full of all the teams who will have their own schedule in our app.
  - ```sprite.js``` will just return an object which we will use for our CSS for the ```spritesheet.png``` file later.

That's pretty much it. I know that seems like a lot, because it is. This is a pretty big app that has some pretty fundamental pieces to it.

#### Step 2: Protected Routes

The very first thing we're going to do is create a boilerplate for protecting certain routes in our application. Once this boilerplate is set up, authenticating specific routes will be a breeze. *I'm going to follow [THIS](https://github.com/rackt/react-router/blob/master/examples/auth-flow/app.js) example from the React Router docs pretty closely for this first part. Feel free to take a glimpse over there if you get stuck.*

Head over to your ```authenticated.js``` file in the ```utils``` folder. As mentioned earlier, this module we'll add in as a mixin on any component that we want the user to be authenticated to see. What will then happen is whenever a user goes to this specific component's route, the ```willTransitionTo``` hook we're about to write will catch that request, and run its callback which will check if they're logged in and if they're not, it will redirect them to the ```login``` route.

* In the ```authenticated.js``` file, require the ```Login``` component as well as the ```firebaseUtils``` file.
* Create an ```authenticated``` object and then use ```module.exports``` to export that object so we can require it in other files.
* Add a ```statics``` property to the ```authenticated``` object, which will also be an object.
* Inside your ```statics``` object, add a ```willTransitionTo``` method which has ```transition``` as its parameter.
*This is where we store where the user was trying to go.*

Now what we're going to do is invoke the ```isLoggedIn``` method on our firebaseUtils object, which will check if the user is logged in. If they're not, we'll redirect them to the login route.

* If ```firebaseUtils.isLoggedIn()``` is falsy, then set the ```attemptedTransition``` property of the ```Login``` component to the transition parameter. Then, use ```transition.redirect('login')``` to redirect to the login page.

The main point of that if statement was to check if the user was logged in and if not, redirect them to login. This wasn't the only purpose though. What's fantastic about React Router is it can cache the authenticated route you're wanting to go to, log you in, then continue to that route once you've logged in. That's the purpose of the ```Login.attemptedTransition = transition``` line. You cache the transition as a property on the Login component then in our Login component once we login, we'll redirect to that original route.

your ```willTransitionTo``` method should look like this,
```javascript
willTransitionTo: function(transition){
  if(!firebaseUtils.isLoggedIn()){
    Login.attemptedTransition = transition;
    transition.redirect('login');
  }
}
```

Now head over to the ```Login.js``` file.

Notice you have a few things included already. All your requires, a ```Router.Navigation``` mixin, an ```attemptedTransition``` statics method, and some JSX templates. The only thing we're missing is the handleSubmit method. Take a second to familiarize yourself with the given code, then dive into creating the ```handleSubmit``` method.

* Create a method called ```handleSubmit``` which takes ```e``` as a parameter.
* use ```e.preventDefault()``` to prevent the default action of clicking this button.
* create an ```email``` and a ```pw``` variable which are both values from the input boxes. *hint. Use ```this.refs.REFNAME.getDOMNode().value```.

So now we have the email and password, we're going to want to log the user in with firebase.

* invoke the ```loginWithPW``` method on the firebaseUtils object passing it two arguments. The first argument is an object with the keys ```email``` and ```password``` whose values are the email and pw variables we made early, and the second argument is a callback function which will get invoked when firebase has logged the user in.

Now is where the magic happens. Remember in the ```authenticated.js``` file when we added a ```attemptedTransition``` property on our Login component if a user tried to visit a route they weren't authenticated for? Well remember that took them to the login route and cached the attempted route as ```attemptedTransition```. So what we're going to want to do in this callback is check if ```attemptedTransition``` is a thing, because if it is, that means we got to this route by attempting to visit another route we weren't authenticated for and once we do login, we should continue to that route again.

* In the callback function (2nd parameter to the loginWithPW method), create an if statement that checks if ```Login.attemptedTransition``` is truthy. If it is, save the current value of ```Login.attemptedTransition``` to a variable called ```transition```, then set ```Login.attemptedTransition``` to null, then invoke the ```retry``` method on your current ```transition``` variable. ```retry()``` will continue to the route the user was originally trying to get to when they were taken to login. If ```Login.attemptedTransition``` was not truthy, then in your else statement use ```this.replaceWith('home')``` to take the user to the ```home``` state. *Tip: remember that when you use ```this``` inside your callback function, without attaching ```.bind(this)``` to the end of the callback function, ```this``` won't be what you want it to be.

To reiterate one more time on what's happening above. If a user tries to go to a route they're not authenticated for, our app will now take them to this Login component and cache the original route they were attempting to go to. When they login, if there was an original route they were trying to go to, once they log in they'll be taken to that route. If there wasn't an original route and they just went straight to the Login route, our app will just take them to the home route.

While we're working on Login/Logout stuff, let's hurry and create/finish the Logout component.

This component is pretty basic and will have the following criteria.

* the render method will just return a paragraph tag that says "You are now logged out".
* When this component mounts, you'll invoke the ```logout``` method on the ```firebaseUtils``` object.

Now head over to Register.js and let's finish this Component.

Everything is finished for you except for the handleSubmit method.

* Create a handle submit method which has the following characteristics.
  - Uses preventDefault to prevent the default action
  - grabs the email and password from the refs in the render method
  - invokes the ```createUser``` method on the ```firebaseUtils``` object passing it an object ({email: email, password: password}), and a callback function
  - The callback function will receive a result as its only parameter. If that result is truthy, use ```this.replaceWith('home')``` to take the user to the home route.

Now, whenever someone registers, they'll get added as a user to firebase, saved to our firebase database, then they'll be taken to the "home" route.

We've been calling a lot of methods on our firebaseUtils object. Let's now head over there and finish that file.

#### Step 3: Firebase Utility Functions

This firebaseUtils file is going to contain an object that will have a bunch of helper methods for interacting with our firebase. They are as follows

```getRef:``` returns a reference to your firebase. <br />
```createUser:``` Creates a new user in firebase then logs them in. <br />
```loginWithPW:``` Logs a user in (or authenticates them). <br />
```isLoggedIn:``` returns if the user is logged in or not. <br />
```logout:``` logs the current user out. <br />
```toArray:``` takes in an object and converts it to an array.

Notice also you're given a few things already. Be sure to update the "forge" variable with your Firebase url.
ref creates a new reference to your firebase and cachedUser will be the user once they log in.

formatEmailForFirebase takes in an email and makes it appropriate to use as a key in firebase

addNewUserToFB takes in a newUser object and saves their info under the ```user``` path in our firebase.

* Create a firebaseUtils object then use module.exports to export that module from this file.
* Give the firebaseUtils object a ```getRef``` method which returns the ```ref``` which was created earlier.
* Give the firebaseUtils object a ```createUser``` method which has a ```user``` and a ```cb``` parameter. Inside this createUser you're going to use firebase to create a new user in your firebase. The API for createUser can be found [HERE](https://www.firebase.com/docs/web/api/firebase/createuser.html). *Hint: Once you successfully create your user, go ahead and make it so that user gets logged in. This way your user won't have to register and then login but it will automatically log them in once they register.
* Create a loginWithPW method which uses Firebase' ```authWithPassword``` method to ([API FOUND HERE](https://www.firebase.com/docs/web/api/firebase/authwithpassword.html)) to log the user in. *this one can get a little hairy. Here's how I implemented it*.
```javascript
  loginWithPW: function(userObj, cb, cbOnRegister){
    ref.authWithPassword(userObj, function(err, authData){
      if(err){
        console.log('Error on login:', err.message);
        cbOnRegister && cbOnRegister(false);
      } else {
        authData.email = userObj.email;
        cachedUser = authData;
        cb(authData);
        this.onChange(true);
        cbOnRegister && cbOnRegister(true);
      }
    }.bind(this));
  }
```
* Next create a ```isLoggedIn``` method which will return true if either the ```cachedUser``` or ```ref.getAuth()``` are not null. If they're both null, return false.
* Next, create a logout method which calls ```ref.unauth()``` which will log the user out, resets the ```cachedUser``` to null, then invokes ```this.onChange(false)``` which we'll talk about later.
* Lastly create a ```toArray``` method which takes in a object, and returns an array with the indices in that array being the values that were in the object. The purpose of this is that firebase only returns us object, so we need to convert them to arrays in order to user ```.map``` and ```.filter``` on our data.

*I realize these instructions have been pretty vague. What I don't want to have happen is that you just copy my implementation of this app and get nothing out of it. If you're struggling right now I suggest you do these two things. First, go back to the Login/Register component and look how we're invoking certain methods on our firebaseUtils object. This will give you insight into how each method is being used. Next, go back to the sample app and the descriptions of each file and think about how you'd accomplish the certain tasks. I'll walk over my code later today but I don't want you to essentially just recreate what I have. Finding your own way of building the app will help you much more than copying my way*

#### Step 4: Menu

There are two more steps left before we're completely done with our protected routes. They are adding in our main Menu interface, and adding in our actual Routes in the config folder. Let's start with the interface.

Head over to ```Main.js```. Remember from the React Router lecture, the ```<RouteHandler />``` element will be swapped out with whichever component is currently active on that specific route. Meaning, if in our routes we said that we want the Login component to be active whenever we're at ```/login```, then ```<RouteHandler />``` will be swapped out with ```<Login />``` when we're at ```/login```. What that also means is that anything that surrounds ```<RouteHandler />``` will always be there no matter what route we're on. This is perfect for something like our menu where the user will have the option to sign in or sign out no matter what route their on.

This brings up an interesting example though. If the user is logged in, we don't want to show them the log in button. If they're logged out, we don't want to show them the log out button. In this section we'll introduce rendering dynamic content based on some piece of data. It sounds more difficult than it is.

* Before we modify any code, get comfortable with the Main.js file. Because there are a lot of parts to it, I gave you most the code up front. Don't move onto the next section until you're comfortable with what you're given.
* Now, find and remove the comment that says /*Code Here*/
* Define two variables```loginOrOut``` and ```register```. As you should notice, these two variables are being used in the render method of this component. That should give you a hint as to what we're about to do next.
* If the ```loggedIn``` state on our component is truthy (they're logged in), then loginOrOut should be ```<li><Link to="logout" className="navbar-brand">Logout</Link></li>``` and register should be ```null```. If the ```loggedIn``` state is not truthy (they're not logged in), then loginOrOut should be ```<li><Link to="login" className="navbar-brand">Login</Link></li>``` and register should be ```<li><Link to="register" className="navbar-brand"> Register </Link></li>```. So what we've done now is we're able to have a dynamic menu based on if the user is logged in or not.

The only other thing about this file that might look off is our ```componentWillMount``` function. Remember in our firebaseUtils object we call ```this.onChange(false)``` whenever a user logs out and ```this.onChange(true)``` whenever a user logs in. If we didn't do this, our menu would never re-render. But, by setting onChange to a function which calls setState, whenever onChange is invoked our component will rerender due to setState being called.

#### Step 5: Routes

We're almost done with our protected routes. All we need to do now is specify what our routes will look like in our routes.js file.

I don't want to give you the code for this one but remember that you can specify your routes using JSX. Check out [React Routers main API](https://github.com/rackt/react-router) under the "What's it look like" section for an example of how to do this.

Once you're done you should be able to register, login, and logout of the app.

**As I mentioned earlier, I realize this section was super heavy. If you're still struggling, I've made a Repo which is the bare minimum you need to get Authentication/Protected Routes working with Firebase and React Router which can be found [HERE](https://github.com/tylermcginnis/react-router-firebase-auth). I highly recommend you fork it and play around with it because it follows the exact same pattern we did above (including firebaseUtils, Login, Logout components, etc) without all the extra NBA Routes stuff. You'll find that once it clicks, you'll love how it works. Another great resource is Michael Jackson's talk from Reactconf. [Here's his talk](http://youtu.be/XZfvW1a8Xac?t=18m42s) and that will take you to the exact moment he talks about authentication with React Router. **

#### Step 6: Home Page

Now that the authentication is finished, let's write up the home page. As a reminder, the homepage looks like this,

![NBA Routes Preview](http://s24.postimg.org/oyxq948n9/nbaroutes.png)

It's essentially mapping over a list of all the teams and creating a UI for each of those teams that allows us to view that teams Schedule or add a new game for that team.

First thing we need to do is set the initial state of our component.

* Set a ```teams``` property on the initial state of the Home component whose value is an empty array.

Next thing we need to do is create the UI for each item.  You have been provided some default teams in the ```teamsObj``` object. We need to use ```teamsObj```  to create a new teams array which we can then use to map over.

* When the component mounts, using teamsObj, set the ```teams``` state to an array of objects whose keys are "id" and whose values are the names of the team. For example, something similar to this. ```[{id: "blazers"}, {id: "bulls"}]```.
 


Now what you need to do is map over ```this.state.teams``` creating the UI for each teams container. Here is what this basic template will look like inside of map,

```html
        <div className="col-sm-4" key={item.id}>
          <div style={}></div>
          <div className="col-sm-12">
            <div className="text-center">
              <div className="btn-group">
                <button className="btn btn-secondary">Schedule</button>
                <button className="btn btn-secondary">Add Game</button>
              </div>
            </div>
          </div>
        </div>
```

* create a ```teams``` variable that is the result of mapping over ```this.state.teams``` and returning the template above for each team.

Once you do that you'll have a teams variable which is an array of these templates, but looking at the template you should notice there are a few things missing.

First, we have an empty styles property.
Second, we have a Schedule button that doesn't do anything
Third, we have a empty AddGame button that doesn't do anything.

* Using teamsObj, give each element it's own style based on the ```item.id``` property. *Hint: If you're stuck put a debugger here and inspect the ```teamsObj``` object. It's an object full of teams with that teams specific css. So the style will need to be the teamsObj property which coordinates with that teams id (or item.id).*

Now we need to tell our app what to do when someone clicks on Schedule. We're going to use React Routers ```Link``` component to help us out here.

* Using ```<Link>```, when someone clicks on the "Schedule" button, have them be taken to the ```schedule``` route and give that route an object with a property of ```team``` and a value of ```item.id``` as params. *Hint: The API for Link can be found [HERE](https://github.com/rackt/react-router/blob/master/docs/api/components/Link.md)

* Using ```<Link>```, when someone clicks on the "Add Game" button, have them be taken to the ```addGame``` route and give that route an object with a property of ```team``` and a value of ```item.id``` as params.

Now if everything is working properly you should have a nice UI for your Home page. If you don't, go check your router.js file and make sure you've got this line ```<Route name="home" path="/" handler={Home} />``` specifically with ```path="/"```.

#### Step 7: Schedule Route

Alright only a few more components left. The next one we're going to build out is the Schedule component. It looks like this,

![Schedule Page ](http://s21.postimg.org/vsbi2a1c7/Screen_Shot_2015_02_18_at_2_04_45_PM.png)

It shows some of that teams information, then maps over the teams schedule while creating a new Box Score for each game in the schedule.

*Note: When we created the ```<Link>``` for this function we passed it a param which was the team's id. To get that param, we use the ```Router.State``` mixin that's already been created for you as well as calling ```this.getParams().team```. For example, if we're at ```nbaroutes.com/schedule/jazz``` then calling ```this.getParams().team``` will return us 'jazz'. There is still one more step we have to do in the router to get this functionality but we'll do that later.*

* Create an initial state object that has the following properties and values.
   - wins: 0
   - losses: 0
   - id: ''
   - schedule: []
   - name: (The name of the NBA Team's page we're on. For example, "Utah Jazz")

*Hint: For the name property, utilize ```nbaTeams.teamsHash``` as well as the teams id from the route parameter.

Now in our componentDidMount lifecycle we're going to set up our firebase refs in order to utilize the real time bindings of firebase.

* When the component mounts, do the following
  - create a ```team``` variable whose value is the current team id of the route we're on (use ```getParams()``` again).
  - Add a ```firebaseRef``` property to your ```this``` object and set it equal to the function invocation of ```firebaseUtils.getRef``` giving us a reference to our firebase in our component.
  - Now, use firebase's ```on('value', cb)``` [API HERE](https://www.firebase.com/docs/web/guide/retrieving-data.html) to get the data in the (team + '/schedule') firebase endpoint, use ```firebaseUtils.toArray``` to make it into an array, then use ```this.setState``` to set the data you got from our firebase as the ```schedule``` property on the component's state.

Next, we're going to do that same process but for our data that lives at ```/info``` rather than ```/schedule```.

  - Again, use firebase's ```on('value', cb)``` to to get data in the (team + '/info') firebase endpoint. This data will contain the teams wins and losses. Use ```this.setState``` to set the wins and losses properties on the component's state object with the wins/losses data we got back from firebase. *If there haven't been any games (wins/losses) yet, set the values to 0.*

At this point notice that there's a commented out ```GameBox``` component. You can probably guess the purpose of this component. Because it's pretty clear what the component does and what values it takes in, I'm going to leave out the instructions for creating it but that's what you should do next. If you've looked at the example and tried the best you can, flag down a mentor and we'd be happy to help you.

Once you've finished the Schedule and the GameBox components, head over to your routes.js file and add the ```schedule``` route. Once finished, your routes should look something like this,

```javascript
var routes = (
  <Route handler={Main} >
    <Route name="home" path="/" handler={Home} />
    <Route name="login" handler={Login} />
    <Route name="logout" handler={Logout} />
    <Route name="register" handler={Register} />
    <Route name="schedule" path="/schedule/:team" handler={Schedule} />
  </Route>
);
```

*Note: the ```:team``` paramter at the end of our schedule path. This is a placeholder for whatever endpoint we hit. In the use of our example, 'jazz' or any other team id.

#### Step 8: AddGames

The last step is the AddGame path which will allow authenticated users the ability to add new games to certain team's schedules. Because this repo is rather long, I've given you this code. However, that doesn't mean you should call it quits and be done at this point. There are some really fundamental things to take away from ```AddGame.js``` and ```NewGameForm.js```.

Specifically the way we're using our Authenticated Mixin to protect the AddGame route. Remember earlier when I mentioned how once the boilerplate route protection stuff is complete it would be a breeze to protect our routes? Well now we can see that. The only thing we have to do to make the route/component protected is to add our ```Authenticated``` object as a mixin (as seen in our ```mixins``` array in the AddGame component).

* The very last thing to do is head back over to your routes.js file and add the newGame route making sure the path is set up properly with the route paramater.

Double check that your app is working properly. As always, there's a solution branch you can check out to see how I went about creating this app.
