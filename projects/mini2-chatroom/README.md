Mini Project 2: Chat Room
============

##Objectives
The purpose of this Mini Project is to get you used to using jQuery with React's life cycle events to make Ajax requests as well as checking and verifying your props with ```propTypes``` and ```getDefaultProps```. We'll be making a very basic Chatroom app shown [HERE](http://reactweek.com/projects/mini-chatroom).

###Step 1: Create the Structure for Your Application
* Rather than have you start from scratch, go ahead and fork/clone this repo. 

You'll notice the skeleton of this project is consistent with what we've used before. 

You're given 3 components to work with. They are - 
  - App.js: This component is mostly just a bootstrap wrapper around ```AddChat``` and ```ChatList```. It's the file where we'll use ```React.render``` to render our component. 
  - AddChat.js: This component is responsible for getting new chat items from the input field, then making Ajax requests to save those chats to our [Parse](https://parse.com/) backend. 
  - ChatList.js: This component is responsible for getting all of the chats at our Parse Endpoint and rendering those to the screen.

###Step 1.5: Check out the App.js File
* This time I've given you the finished App.js file. Head over there and get a good feel for what's going on. Notice all we really have is an AddChat component to which we're giving a URL and a ChatList component to which we're giving another URL.

###Step 2: AddChat Component
Let's start with our AddChat component. Remember, this component is responsible for getting new chats from the input field then making Ajax requests to Parse to save those chats. Notice that we are requiring jQuery at the top and saving it to the variable ```$```. We'll use this for our Ajax calls.

To make this component a little more dynamic, we're going to be passing in the URL endpoint as a prop. This makes this component more reusable because now anywhere else we need an input box that makes Ajax requests to a certain url, we can use this component and pass that URL in as a prop from the parent component. 

* Use ```propTypes``` to make sure that a ```url`` is passed in with a value that's a string.
  * It should look like this.
  ```javascript
  propTypes: {
    url: React.PropTypes.string.isRequired
  }
  ```
* Now, let's make it even more robust and, using ```getDefaultProps```, if no url is provided as a prop, set the url to be ```https://api.parse.com/1/classes/chat``` by default.
  * And that should look like this.
  ```javascript
  getDefaultProps: function(){
    return {
      url: "https://api.parse.com/1/classes/chat"
    }
  }
  ```
Admittedly, you'd probably never use propTypes and getDefaultProps together, but we're mostly concerned with getting practice with both of them, hence we'll use them both. 

Now that our url is being validated, let's go ahead and make a method that will make our ```POST``` request. 

* In this next section we'll be using jQuery's ```$.ajax``` to make our Ajax requests. If you're unfamiliar with this and want to better understand its syntax [check out the documentation on ```$.ajax``` here](http://api.jquery.com/jquery.ajax/).
* Create an ```addChat``` method that will use jQuery's ```$.ajax``` to make a ```POST``` request with an object whose key is ```text``` and whose value is the value from our input. **You'll need to add this line as a property on your request.**
```javascript
  beforeSend: function(request) {
    request.setRequestHeader("X-Parse-Application-Id", 'YOUR-PARSE-APP-ID');
    request.setRequestHeader("X-Parse-REST-API-Key", 'YOUR-PARSE-API-KEY');
    request.setRequestHeader("Content-Type", 'application/json');
  }
```
I realize if you were building a real production app you'd set up proxy server and not expose your keys on the front end. Good news is we're not building a real production app and we're just practicing how to make AJAX requests with React. If this bugs you, feel free to spin up your own server to make these requests.

To get your own Parse keys, sign up at [Parse.com](http://parse.com), create an app, click on "data" -> "web" -> "new project" then your keys should be there. If not, call over a mentor or research how to build a new app with Parse.

Once you've done that, your ```addChat``` method should look something like this. 
```javascript
addChat: function(){
  $.ajax({
    url: this.props.url,
    type: 'POST',
    data: JSON.stringify({text: this.refs.newChatInput.getDOMNode().value}),
    beforeSend: function(request) {
      request.setRequestHeader("X-Parse-Application-Id", 'YOUR-PARSE-APP-ID');
      request.setRequestHeader("X-Parse-REST-API-Key", 'YOUR-PARSE-API-KEY');
      request.setRequestHeader("Content-Type", 'application/json');
    },
    error: function() {
      console.log('error on post');
    },
    success: function() {
      console.log('Successful Post');
    }
  })
}
```

* Now, create a ```handleSubmit``` method that we'll put on the input box so whenever there's a ```onKeyDown``` event, our handleSubmit method will get invoked, it will check to see if the key which was typed was the enter key (```e.keyCode === 13```). If it was enter, invoke the ```addChat``` method we made earlier then reset the ```newChatInput``` ref to be an empty string. 


* Inside the ```form-group``` div in your ```render``` method create an input field with the following attributes
  - type is ```text```
  - placeholder is ```Compose Message```
  - ref is ```newChatInput```
  - has a class of ```form-control```
  - onKeyDown invokes the ```handleSubmit``` method
  
Once you get done, your AddChat.js file should look like this 
```javascript
var React = require('react');
var $ = require('jquery');

var AddChat = React.createClass({
  propTypes: {
    url: React.PropTypes.string.isRequired
  },
  getDefaultProps: function() {
    return {
      url: 'https://api.parse.com/1/classes/chat'
    };
  },
  addChat: function(){
    $.ajax({
      url: this.props.url,
      type: 'POST',
      data: JSON.stringify({text: this.refs.newChatInput.getDOMNode().value}),
      beforeSend: function(request) {
        request.setRequestHeader("X-Parse-Application-Id", 'YOUR-PARSE-APP-ID');
        request.setRequestHeader("X-Parse-REST-API-Key", 'YOUR-PARSE-API-KEY');
        request.setRequestHeader("Content-Type", 'application/json');
      },
      error: function() {
        console.log('error on post');
      },
      success: function() {
        this.refs.newChatInput.getDOMNode().value = '';
        console.log('Successful Post');
      }.bind(this)
    })
  },
  handleSubmit: function(e){
    if(e.keyCode === 13){
      this.addChat();
    }
  },
  render: function(){
    return (
      <div className="form-group">
        <input 
          type="text" 
          ref='newChatInput'  placeholder="Compose Message" 
          className="form-control" 
          onKeyDown={this.handleSubmit} />
      </div>
    )
  }
});

module.exports = AddChat;
```

###Step 3: ChatList Component

The purpose of this component is to receive a URL from its parent as a ```url``` property, consistently make ```GET``` requests to fetch the data at the given URL to update its own internal state, and then render an unordered list of all the items.

* Set the initial state of this component to be a ```chats``` property whose value is an empty array.
* Verify that the ```url``` from props was passed in and it's a string.
* If no ```url``` was passed in set the default url to ```https://api.parse.com/1/classes/chat```
* Create a getChats method that uses jQuery's ```$.ajax``` to make a GET request to the url which was passed in and on success, sets the current ```chats``` state to the data we received from the request.

Once finished, your getChats method should look similar to this.
```javascript
getChats: function(){
  $.ajax({
    url: this.props.url,
    type: 'GET',
    beforeSend: function(request) {
      request.setRequestHeader("X-Parse-Application-Id", 'YOUR-PARSE-APP-ID');
      request.setRequestHeader("X-Parse-REST-API-Key", 'YOUR-PARSE-API-KEY');
      request.setRequestHeader("Content-Type", 'application/json');
    },
    error: function(data) {
      console.log('There was an error in getting the chats');
    },
    success: function(data) {
      if (this.isMounted()) {
        this.setState({
          chats: data.results
        });
      }
    }.bind(this)
  })
}
```
A few things to note. Inside our success callback we're using ```this.isMounted```. The reason for this is because "when processing the response of an asynchronous request, be sure to check that the component is still mounted before updating its state by using this.isMounted()." [Source](http://facebook.github.io/react/tips/initial-ajax.html)

Now once our component mounts, we want to have our component invoke our ```getChats``` method every second so our ```chats``` state gets updated if there are new chats. 

* Inside ```componentDidMount``` use ```setInterval``` to make it so every second our ```getChats``` method is invoked. *Hint: We need a way to cancel our interval when the component unmounts. We can do this by saving the result of our setInterval invocation to a property on ```this``` so we can then clear the interval in ```componentDidUnmount```*
  * It will look like this
  ```javascript
  componentDidMount: function(){
    this.interval = setInterval(function(){
      this.getChats();
    }.bind(this), 1000)
  }
  ```
* Now when the component unmounts, use ```clearInterval``` (built into JavaScript) to clear the interval we created earlier. 

The code should look like this,
```javascript
  componentWillUnmount: function() {
    clearInterval(this.interval);
  }
```

* Now inside the render method create a ```list``` variable that is the result of mapping over ```chats``` and is a collection of ```<li>``` elements with the following properties
 - class of ```list-group-item```
 - key of ```item.objectId``` if item is the first parameter in your map callback
 - inside the ```<li>``` you'll output ```item.text``` 

* Once you have your ```list``` variable which is an array of ```<li>``` tags, display those between your ```<ul></ul>``` tags. 

Once you finish, your ```ChatList.js``` file should look like this.

```javascript
var React = require('react');
var $ = require('jquery');

var ChatList = React.createClass({
  getInitialState: function(){
    return {
      chats: []
    }
  },
  propTypes: {
    url: React.PropTypes.string.isRequired
  },
  getDefaultProps: function() {
    return {
      url: 'https://api.parse.com/1/classes/chat'
    };
  },
  getChats: function(){
    $.ajax({
      url: this.props.url,
      type: 'GET',
      beforeSend: function(request) {
        request.setRequestHeader("X-Parse-Application-Id", 'YOUR-PARSE-APP-ID');
        request.setRequestHeader("X-Parse-REST-API-Key", 'YOUR-PARSE-API-KEY');
        request.setRequestHeader("Content-Type", 'application/json');
      },
      error: function(data) {
        console.log('There was an error in getting the chats');
      },
      success: function(data) {
        if (this.isMounted()) {
          this.setState({
            chats: data.results
          });
        }
      }.bind(this)
    })
  },
  componentDidMount: function() {
    this.interval = setInterval(function(){
      this.getChats();
    }.bind(this), 1000)
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  render: function(){
    var list = this.state.chats.map(function(item, index){
       return <li className="list-group-item" key={item.objectId}> {item.text} </li>
     });
    return (
      <ul className="list-group">
        {list}
      </ul>
    )
  }
});

module.exports = ChatList;
```

Now that our ```AddChat``` and ```ChatList``` components are complete, the chatroom should be working.
