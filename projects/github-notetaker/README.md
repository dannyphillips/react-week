# Github Notetaker

####Objectives
The purpose of this project is to familiarize yourself with the Flux architecture. In this project we'll be recreating [THIS](http://reactweek.com/projects/github-notetaker/#/) application. The user can type in any github username and then will be routed to a page where they can see that user's information, repositories, and have the ability to take notes on the specific developer. A use case for this (if you added auth which we won't be doing in this project) is for taking notes on candidates in technical interviews.

As few notes before we get started. Remember, Flux really shines when you have a large, data heavy application. Though we arguably have some data, this application definitely isn't large. Because of that, your first impression of Flux might be that you feel like you're doing a lot of typing without much benefit. Remember, this is just a small demo app. The real benefits of Flux will show themselves as your application gets larger. For more on this topic read [this blog post](https://medium.com/@dan_abramov/the-case-for-flux-379b7d1982c6).

Final Project Image:
![Github Notetaker](http://s17.postimg.org/4hgyl4ykf/notetaker.png)

Final Project Component Visualization:
![Github Notetaker Visualized](http://s15.postimg.org/x0j2q0de3/notetaker_compnents.png)

####Step 1: Familiarize Yourself with Code Base
  * Fork this repo and clone your fork
  * run ```npm install```
  * Familiarize yourself with the given code and file structure

For reference the final folder structure will look something like this.

![File structure](http://s11.postimg.org/sdttt61w3/filestructure.png)

####Step 1.5: Github API

As you've probably guessed, this project is going to use the Github API to get user profile data. The issue with that is their API rate limits you based on your IP after 60 requests in the same hour. As you can imagine, that limit would go rather quickly with all of you hitting it from the same IP. To counteract this you'll need to go [HERE](https://github.com/settings/applications/new) and create a Github App in order to get a client_id and a client_secret. For the Homepage URL and Callback URL I used ```http://tylermcginnis.github.io/github-notetaker``` and ```tylermcginnis.github.io/github-notetaker/login/callback``` feel free to do the same but swap out my username for yours. Now, this brings up another issue. You never want to have your secret key be accessible on the front end. Sadly because this is a React workshop, it would add another layer of complexity to have everyone set up their own proxy server to serve the github requests. If you want to do that, you're more than welcomed to. However, if you're not worried about it (or if you don't care for pushing/sharing this code or project anywhere) in the ```githubUtils``` there are two placeholder variables ```id``` and ```sec``` that you can plug your newly created keys into and you won't get rate limited.

####Step 2: Stores (Github Store)

The nice thing about Flux is you really have to think about the organization and structure of your application before you start hacking away. When you finish building out your Stores, you'll know a few things about your application. You'll know your data schema, your action types, and your app constants. Once you know this information, the rest of your app will simply be build to support it. This makes starting off building your stores the easy choice when building a flux application.

This app is going to have two Stores. A Github Store and a Notes Store. The Github Store will be responsible for keeping track of the specific user we're looking at as well as his or her bio and any repos they have. The Notes Store will be responsible for keeping track of the specific user we're looking at as well as any notes that have been written about him or her.

Let's start out by building our Github Store.
  - Head over to your "stores" folder and create a new file called ```githubStore.js```.
* Require your AppDispatcher in the ```dispatcher/AppDispatcher``` folder
* Require your appConstants in the ```constants/appConstants``` folder
* Require EventEmitter using ```require('events').EventEmitter```. *EventEmitter will allow us to emit changes from our Store and listen for those changes in our Components*
* Require objectAssign which can be found at ```react/lib/Object.assign```. *objectAssign allows us to extend an object with another object. We'll use it to give our githubStore object the ability to emit events by extending it (or copying properties) with the EventEmitter*
* Create a variable called ```CHANGE_EVENT``` and set it equal to the string "change".

One of the main reasons for a Store in Flux is to keep track of some state.

Make a variable called ```_state``` and set it equal to an object with the following properties/values.
 - user: ''
 - bio: {}
 - repos: []

Those three properties are going to be what our Github Store will be responsible for keeping track of. Everything we build in our Github Store from here out will all be in relationship to those three values. This makes it easy to reason about our code because if something happened with one of those three values, the perpetrator will be refined to a small location.

After you create your ```_state``` object, let's create three setter functions for modifying each property in our ```_state``` object.

* create a ```newUser``` function which takes in a string and sets the ```user``` property on the ```_state``` object to that string which was passed in.
* create a ```setBio``` function which takes in an object and sets the ```bio``` property on the ```_state``` object to that object which was passed in.
* create a ```setRepos``` function which takes in an object and sets the ```repos``` property on the ```_state``` object to that object which was passed in.

Now we have our data object and our setter functions, we need to create our actual store.

To do this, as mentioned earlier, we're going to use objectAssign. From the objectAssign docs, here's some more info about it.

```
var newObject = objectAssign(target, source, [source, ...])

Assigns enumerable own properties of source objects to the target object and returns the target object. Additional source objects will overwrite previous ones.
```

the target is going to be an empty object, the source is going to be the ```EventEmitter.prototype``` object, the source is going to be an object with properties we want our store to have, and the newObject is going to be an object with all of those properties combined.

* Use objectAssign to create a new object called githubStore which extends EventEmitter and has the following properties.
  - An ```addChangeListener``` method which takes in a callback function as its only parameter and then invokes the ```on``` method which was originally on EventEmitter.prototype passing it the change event variable we defined earlier as well as the callback which was passed in.
  - A ```removeChangeListener``` method which takes in a callback function as its only parameter and then invokes the ```removeListener``` method which was originally on EventEmitter.prototype passing it the change event variable we defined earlier as well as the callback which was passed in.
  - A ```getUser``` method which returns the ```user``` property on our ```_state``` object.
  - A ```getBio``` method which returns the ```bio``` property on our ```_state``` object
  - A ```getRepos``` method which returns the ```repos``` property on our ```_state``` object.

*If you're stuck with the code above, when I say "which was originally on the EventEmitter.prototype" what I'm meaning is that when we used objectAssign, those EventEmitter.prototype properties were copied over to our githubStore object. Now, to reference those methods in this case you can use the keyword ```this```. So for example, above our addChangeListener method should look like this.
```javascript
addChangeListener: function(cb){
  this.on(CHANGE_EVENT, cb);
}
```

Now the last thing we need to do is register actions with our Store so our Store will be able to listen for certain signals dispatched by the dispatcher. Remember the process for Flux goes like this, **(1) A user initiates some event, (2) that event invokes an action (3) which then triggers the dispatcher. The dispatcher then (4) dispatches an event which (5) is then caught by the Stores who subscribe to those events. The Store then (6) calls some internal setter method which alters its internal state, then the Store (7) emits a change event which brings us full circle back to the (8) view which updates its own internal state.**.

So our Store is responsible for numbers 5 - 7. We've created the ability to do number 6 and 7, but we still haven't had our Store subscribe to any events (5). Let's do that right now.

What you might have the thought of doing initially is to register the Dispatcher actions on the actual Store itself. In our example above, something like this ```githubStore.register(function...)```, however, that's not how it works. You register your actions listeners on the Dispatcher itself. This makes sense if you think of it as the Dispatcher is the one dispatching the event, so it could also be the one who registers what functionality will be invoked when those dispatches are received.

* Use ```AppDispatcher.register``` and pass in a function that receives "payload" as its only parameter. *This payload is going to have an ```action``` property which has an "actionType" property and a "data" property (which was specified when we dispatched the event)*.
* Inside our callback function, create a variable called ```action``` which gets assigned the value of ```payload.action```.
* Create a switch statement which is checking the ```action.actionType``` value.

Earlier I mentioned how in order to build out your stores, you'll need to know the action types that your app is going to use. In the case of our GithubStore, let's brainstorm some actions which will be happening. The user needs the ability to get the users github bio, get the users repos, and change the user. Let's now create three constants which will represent those three actions.

* Head over to your constants folder and create a new file called ```appConstants.js```.
* In that file create an object called ```appConstants``` and then export that object.
* In that object, create the following keys value pairs
  - GITHUB_USER_BIO: "GITHUB_USER_BIO"
  - GITHUB_USER_REPOS: "GITHUB_USER_REPOS"
  - GITHUB_CHANGE_USER: "GITHUB_CHANGE_USER"

Now anytime we want to represent any of the Github actions we mentioned above, we can use these constants to be consistent throughout our application.

Head back over to the ```githubStore.js``` file and inside the switch statement create the following cases.
 - ```appConstants.GITHUB_USER_BIO``` which will call the ```setBio``` setter function and pass it ```action.data``` then invoke ```githubStore.emit``` and pass it the change event variable we created at the top of the file.
 - ```appConstants.GITHUB_USER_REPOS``` which will call the ```setRepos``` setter function and pass it ```action.data``` then emit that a change occurred.
 - ```appConstants.GITHUB_CHANGE_USER``` which will call the ```newUser``` setter function and pass it ```action.data``` then emit that a change occurred.
 - Have the default case just return true

*One thing to note is that when a change occurred, we're not emitting what that change was, we're only emitting that a change occurred. Our view doesn't care about what changed, it just cares that something did change. With the *power of the virtual DOM* we can just tell our view to rerender every time there is a change without performance worries.*

* Use module.exports to export the githubStore.

Our githubStore is now complete. It has and can manage its own state as well as emit "change" when its data changes.

####Step 3: Notes Store

The NotesStore is going to look very similar to the GithubStore we just created except it will obviously be related to the notes about the user and not their github information. Because of the similarity, this section will be purposely vague. If you get stuck on the implementation detail, check out the githubStore.js file for help.

* Before we actually begin building the notesStore, you'll need to go to your firebase account and create a new project, once you do that, head over to your ```appConstants.js``` file and on the ```appConstants``` object add a property of ```FIREBASE_HOST``` whose value is your firebase URL endpoint

* In your ```stores``` folder create a file called ```notesStore.js```.
* Require
 - AppDispatcher
 - appConstants
 - objectAssign
 - EventEmitter
* Create a change event constant
* Create a state which has a ```notes``` whose value is set to an empty array and a ```user``` property whose value is an empty string.
* Create an addNote setter function which takes in a note parameter and adds that note to the state's note property
* creata a changeUser function which takes in a new user object as its parameter and then resets the state with the user property being the ```user``` property on the object which was passed in and the ```notes``` property being set to the ```notes``` property on the object which was passed in.
* Create your notesStore object with the following methods (which are self explanatory and similar to what we did in githubStore.js)
  - getState
  - addChangeListener
  - removeChangeListener

Let's now consider the actions the user should be able to make in regards to the Notes functionality. The user should be able to 1) Add a new note (ADD_NOTE) and 2) change the user (CHANGE_USER).

* Head over to appConstants.js and add the following constants into the object that's being exported.
* Now back in notesStore.js, register both of those actions (ADD_NOTE and CHANGE_USER) and add the proper functionality when the AppDispatcher dispatches either of those events.

*Note that although that the implementation for Notes is needing to make an external request to fetch/set the data, we're not doing that in the NotesStore but we'll do it in our Actions file. This keeps the traditional data flow Flux pattern of VIEWS -> DISPATCHER -> STORES constant.*

####Step 4: Actions (Github Actions)

Now that are stores are all set up, the next step is setting up our actions which will be dispatching our payloads.

Let's start off by creating a ```githubActions.js``` file in the ```actions``` folder.

This file needs to require three things. AppDispatcher, appConstants, and githubUtils

You might have noticed from step 1, but our githubUtils file is just returning us an object with a few helper methods for communicating with the Github API. One library we're using that we haven't talked about is [Axios](https://github.com/mzabriskie/axios). If you're coming from an Angular background Axios is very similar to $http. Axios is a "promise based http client for the browser and node". I'm a huge fan of it because it allows us to make promise based http requests without the need of something like jQuery. *If you've never used promises before, check out [this quick article](http://andyshora.com/promises-angularjs-explained-as-cartoon.html) explaining their purpose and how they work.*

Head back to your githubActions.js file.

* require AppDispatcher, appConstants, and githubUtils.
* Creata a githubActions object which has the following methods
  - getUserBio
  - getUserRepos
  - changeUser

Now let's build out these methods.

* ```getUserBio``` is going to take in a ```username``` parameter, then it's going to invoke the ```getBio``` method on the ```githubUtils``` object. Right after that invocation add a ```.then(function(response){})``` property.
*For those unfamiliar with promises, Axios returns us a promise and what the ```.then``` does is it says, "when we get the data back from github, we'll invoke the function that you passed into ```.then``` passing it the github data as the first argument. This is useful because once we get the data from GitHub, we want to use AppDispatcher to dispatch our payload.*

* In the function being passed to ```.then```, invoke the ```handleAction``` property on the AppDispatcher and pass it an object with the following properties/values
  - actionType: appConstants.GITHUB_USER_BIO
  - data: response.data

Because some of you might be unfamiliar with promises and .then, here's what that code should look like.

```javascript
getUserBio: function(username){
    githubUtils.getBio(username)
      .then(function(response){
        AppDispatcher.handleAction({ In
            actionType: appConstants.GITHUB_USER_BIO,
            data: response.data
        });
      });
  }
```

Now build out the ```getUserRepos``` and the ```changeUser``` methods. *hint: Both of these methods take in a ```username``` parameter. ```getUserRepos``` will call the ```getRepos``` method on ```githubUtils``` and then dispatch the ```GITHUB_USER_REPOS``` event passing along ```response.data``` as the data. The ```changeUser``` method will just dispatch the ```GITHUB_CHANGE_USER``` constant passing along ```username``` as the data.

* Last step as always is export the ```githubActions``` object you just made.

####Step 5: NoteActions

The next Actions file we need to create is for our NoteActions.

* Inside the ```actions``` folder create a file called ```noteActions.js```.
* In this file require AppDispatcher, appConstants, and firebaseUtils.
* Create an object called ```noteActions``` which has a ```addNote``` method which takes in a ```noteObj``` parameter and a ```changeUser``` method which takes in a ```username``` parameter.

```addNote``` will do two things. 1) Dispatch an ```ADD_NOTE``` event and 2) add a note to firebase.

* Inside of the ```addNote``` method, invoke the ```handleAction``` method on ```AppDispatcher``` passing it an object with a ```actionType``` property whose value is ```appConstants.ADD_NOTES``` and a ```data``` property whose value is ```noteObj.note```.
* That's not all for the ```addNote``` method. After you invoke ```handleAction``` then also invoke the ```addNote``` method on the ```firebaseUtils``` object passing it ```noteObj```.

Now let's build out the ```changeUser``` method.

What ```changeUser``` is going to do is it's going to set use some firebase magic to get all the data in a certain firebase location, and when that data is ready (or whenever that data has changed), it's going to dispatch an action including in the payload the user as well as the new data.

Because this method is a little "firebase-y", here's what the code should look like.

```javascript
changeUser: function(username){
  firebaseUtils.homeInstance().child(username).on('value', function(snapshot){
    AppDispatcher.handleAction({
      actionType: appConstants.CHANGE_USER,
      data: {
        user: username,
        notes: firebaseUtils.toArray(snapshot.val())
      }
    });
  });
}
```

* Last step as always, export the ```noteActions``` object.

Now that our Stores and Actions are finished, we know quite a bit about our application and the rest should be a breeze. All we need to do now is build out our components and then set up routing.

####Step 6: Component Overview

Before we jump into creating our components, let's take an overview of each component we'll build.

 - Main (Finished) - This component is what has our <RouteHandler /> as well as our Menu
 - Home (Finished) - This component is rendered on the '/' path.
 - SearchGithub (Finished) - The component responsible for getting a username and transitioning to the profile view with that username.
 - Profile (Finished but Commented Out) - A component which is essentially the bootstrapped wrapper for our components on the profile page. *Once we build out the other components, we'll uncomment the code in this component*.

Github Components
  - Left - The component which renders the left bio panel on the profiles page.
  - Middle - The component which renders the middle repos panel on the profiles page.

Notes Components
 - AddNote - Manages the input box and action creator for creating a new note
 - NotesList - Create an unordered list of all of the users notes.
 - Notes - The component which manages the notes state as well as renders the AddNote and NotesList components

As you can see, a lot of the components are already built for you. You'll just need to build the Github components and the Notes components.

Let's first start with the Github components.

####Step 7: Github Components (Left)

Let's work on the Left component. Remember, the Left component is what's responsible for rendering the User Profile view.

* Inside ```component/Github``` create a file called ```Left.js```.
* Require React, githubActions, and githubStore
* Create a component called ```Left``` which renders an empty ```<div>```
* export the ```Left``` component
* Add the following properties to the initial state of your components
 - user: which is the result of invoking the ```getUser``` method on our ```githubStore``` object.
 - bio: which is the result of invoking the ```getBio``` method on our ```githubStore``` object.

*note how we've taken the data (even the initial data) out of our component and put it into a store then we just fetch the data from the store when we need it*

Whenever a transition occurs, the ```componentWillReceiveProps``` life cycle will be invoked with an object being the route parameters. This allows us to change our data whenever a transition (going from one user to the different user) occurs.

* Inside the ```componentWillReceiveProps``` lifecycle method, have the method take in an ```obj``` parameter, and invoke the ```changeUser``` method on ```githubActions``` passing it ```obj.username``` and invoke the ```getUserBio``` method on ```githubActions``` passing it ```obj.username``` as well. *So what we've done here is every time a new username is entered, we'll kick off these two actions, which will update the user and the users bio in our store*.

Remember in our Store when we created the ```addChangeListener``` method? The purpose of that was so when we emitted our change event, we could invoke a method in our view that would update the state with the data that is in the store. Let's create that view method now.

* Add an ```_onChange``` method to your ```Left``` component which uses ```setState``` to reset the user and bio properties with whatever is in the Github Store (using ```getUser``` and ```getBio```).

Now in our componentDidMount we need to add invoke ```addChangeListener``` on the Store and pass it our ```_onChange``` method as well as a few other things.

* When the ```Left``` component mounts do the following
  - Invoke the ```changeUser``` method on the ```githubActions``` object passing it ```this.props.username``` as its only argument.
  - Invoke the ```getUserBio``` method on the ```githubActions``` object passing it ```this.props.username``` as its only argument.
  - Invoke the ```addChangeListener``` method on the ```githubStore``` object passing it ```this._onChange``` as its only argument.

Now, the last thing we need to do before we render is to remove the change listener when the component unmounts.

* When the ```Left``` component unmounts, invoke the ```removeChangeListener``` on the ```githubStore``` object passing it ```this._onChange``` as its only argument.

The last thing we need to do is render our bio template. The tricky part about this is that not every Github user has all of their profile filled out. So we'll need to check if a certain property is truthy before we render that list item. Here's how I implemented it. Feel free to change it up.

```javascript
  render: function(){
    return (
      <div>
        <h3> User Profile </h3>
        <ul className="list-group">
          {this.state.bio.avatar_url && <li className="list-group-item"> <img src={this.state.bio.avatar_url} className="img-rounded img-responsive"/> </li>}
          {this.state.bio.name && <li className="list-group-item"> Name: {this.state.bio.name} </li>}
          {this.state.bio.login && <li className="list-group-item"> Username: {this.state.bio.login} </li>}
          {this.state.bio.email && <li className="list-group-item"> Email: {this.state.bio.email} </li>}
          {this.state.bio.location && <li className="list-group-item"> Location: {this.state.bio.location} </li>}
          {this.state.bio.company && <li className="list-group-item"> Company: {this.state.bio.company} </li>}
          {this.state.bio.followers && <li className="list-group-item"> Followers: {this.state.bio.followers} </li>}
          {this.state.bio.following && <li className="list-group-item"> Following: {this.state.bio.following} </li>}
          {this.state.bio.following && <li className="list-group-item"> Public Repos: {this.state.bio.public_repos} </li>}
          {this.state.bio.blog && <li className="list-group-item"> Blog: <a href={this.state.bio.blog}> {this.state.bio.blog} </a></li>}
        </ul>
      </div>
    )
  }
```

####Step 8: Github Components (Middle)

In your ```components/Github``` folder create a file called ```Middle.js```. This Middle component will be responsible for getting and rendering the list of users Repos. It's going to follow a very similar pattern as the Left component so directions will be more vague.

* Require React, githubActions, and githubStore.
* Create a component called Middle with an empty ```<div>``` in its render method
* Set the initial state to ```repos``` whose value is the repos from the githubStore
* When the github username changes (componentWillReceiveProps) invoke ```getUserRepos``` on ```githubActions``` passing it the new username.
* Create a _onChange method which will update the ```repos``` state with the data that's in the store.
* When the component mounts, pass ```getUserRepos``` on ```githubActions``` the username prop and then add the ```_onChange``` event listener to the store.
* Inside of render map over all the items in ```this.state.map``` creating ```<li>``` elements for each item.

Here's my render implementation.
```javascript
render: function(){
  var repos = this.state.repos.map(function(repo, index){
    return (
      <li className="list-group-item" key={index}>
        {repo.html_url && <p><h4><a href={repo.html_url}>{repo.name}</a></h4></p>}
        {repo.description && <p> {repo.description} </p>}
      </li>
    )
  });
  return (
    <div>
      <h3> User Repos </h3>
      <ul className="list-group">
        {repos}
      </ul>
    </div>
  )
}
```

####Step 9: Notes Components

Like we've done before, this last step is going to be fairly vague as a way for you to get used to building used to Flux type components without relying too much on the instructions. To accomplish this, I'll give you the render method of each component but you'll have to tie the pieces together with Flux.

* In your ```components/Notes``` folder you should have a ```NotesList.js``` file already. Create two more files. One called ```AddNote.js``` and another called ```Notes.js```.

The render method for the Notes component looks like this,
```javascript
  render: function(){
    return (
      <div>
        <h3> Notes for {this.props.username} </h3>
        <AddNote username={this.props.username} />
        <NotesList notes={this.state.notes}/>
      </div>
    )
  }
```

and the render method for the ```AddNote``` component looks like this,
```javascript
render: function(){
    return (
      <div className="input-group cushion">
        <input type="text" ref="note" className="form-control" placeholder="Add Note" />
        <span className="input-group-btn">
          <button className="btn btn-default" type="button" onClick={this.handleSubmit}>Submit</button>
        </span>
      </div>
    )
  }
```

and note that ```NotesList``` is finished already since it's a "pure" component (it doesn't have its own state) it just receives some props, maps over those and renders an unordered list.

If you get stuck, check out the Left and Middle components as well as the Notes store. The patterns in those files are very similar to what you're going to do in these two new components.

Once you finish those last two components, head over to ```Profile.js``` and uncomment the commented code.
