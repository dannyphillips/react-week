# Todo Collection
============

## Running the server

```sh
npm install
npm start
```

##Objectives
In this project we're going to build off of the mini project from this morning. During the mini project we built a very composable Todo List. What we're going to do with this project is take our Todo List and create an App that allows us to have a collection of Todo Lists. The end result will be something like this, (URL TO FINAL PROJECT).

Here's an image showing the final product.
![Todo Collection Finished](http://tylermcginnis.com/ReactWeek/todo-collection-final.png)

and here's an image showing the relationships between the React components. 
![Todo Collection Components](http://tylermcginnis.com/ReactWeek/todo-collection-components.png)

Because everyone is at different levels, this project has three steps to it. 
1) You should be able to create new lists and have each list manage its own state. 
2) The ability to remove lists.
3) The ability to assign a list a background color. 

Everyone should try to finish all three tasks, but the minimum bar should be finishing the first step. The way these instructions are going to work is we'll work on finishing #1 before we add any functionality for #2 or #3. Agile-ish.

###Step 1: Clone your Mini Project and Make AddList Component
We're going to have the same work flow as we had before. Start from the inner most components and work our way back out. 

* Since this project is a continuation of the mini project from earlier, go ahead and copy/clone your mini project to start this project. 
* Once you've cloned your Mini Project go to your ```app``` directory and create a new file called ```AddList.js```. This file is going to contain our new ```AddList``` component. 

This component is going to be fairly basic. It's going to just be (initially) an empty input box and a submit button. Whenever a user enters in information and clicks submit, this component will invoke a method on its parent component passing that method the name of the new list. 

* Create a new React component called AddList and then export it at the bottom of the file.
* Set the initial state of this component to ```listName``` with an empty value.

Now, just as we did in the mini project, we need to update our state as the user types in the input field. 

* Create a ```handleChange``` method which will update the ```listName``` state of the component to whatever is being typed into the input field.
* Create a ```handleSubmit``` method that will invoke the ```add``` method that's going to be passed in from the parent component passing that method the current state.
* After you invoke ```add``` passing it the current state you're going to want to reset the current ```listName``` state to be an empty string.

So at this point we have our initial state, and we have our helper methods that are going to allow us to keep the initial state updated as well as add the list to the Parent components List array.

The last thing we need to do is create a ```render``` method to tell React how we'd like to represent this component in the DOM.

* Create a render method which will contain the following
  1) An h3 tag with the text being "Create New List". *To center text in bootstrap add a class of "text-center"*
  2) An input tag whose value is tied to our ```listName``` state and ```onChange``` will invoke our ```handleChange``` method we created earlier.
  3) A button element that when the user clicks on it will invoke our ```handleSubmit``` method we built earlier. *To make buttons look nice in bootstrap use the class "btn btn-primary"*


###Step 2: Minor Changes to ListContainer

Head over to your ListContainer.js file because we just need to make some minor changes. 

Since we're going to have multiple lists stacking next to each other, we no longer need to offset our one list. 

* Remove the ```col-md-offset-3``` from your ```className``` inside your render function.

Another small change we need to make is with the styling. Because we're going to have multiple lists stacked side by side, it would make more sense to put borders around each one. 

* Add the following object as a variable in your render method.
```javascript
var styles = {
  container: {
    border: "1px solid rgb(208, 208, 208)",
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 5
  }
};
```

* Now, add the ```container``` style to your div with the classname of ```col-sm-12``` in your render method.

Now all of our todo lists will have some spacing between them as well as a border around them.

The very last thing we want to do in our ListContainer.js file is to make the names of our Todolists dynamic. Right now, all of our Todo Lists are titled "Todo List". That's pretty lame. As we know from our AddList component we just made, we'll be specifying the name of each List when we make our list. This will be passed as a ```title``` property on the props object of ListContainer.

* Swap out "Todo List" with the ```title``` property on the ```props``` object.

###Step 3: Changes to App Component

In the Mini Project our App component was just a wrapper around our ListContainer component. However, now that we're adding the ability to add multiple lists, our App component will now be responsible for maintaining that new state. 

* Set the initial state of App to have a ```lists``` property whose value is an empty Array. This lists property will be the container for all of our todo lists we create.

Our ```lists``` array will eventually get filled up with different objects each representing their own state. This object will eventually contain the title, the index, and the background color of the component. But for now, we'll just have it contain the title and the index.

* Create an ```addNewList``` method on our component that takes in an object with a ```listName``` property, then, add an object with a key of ```newTitle``` and a value of the new title (which you'll get from the object parameter) and another key of index whose value is the current length of the ```lists``` array. *Remember, treat your state as if it's immutable. Don't use ```this.state.lists.push()``` instead look into using something like ```concat```. 

Now we need to modify our render method. 

* Inside of our render method map over the current ```lists``` state and make an array full of ```ListContainer``` components saving them to a variable named ```componentList```. This will get a little tricky. A few tips to remember
  1) When you use map you'll love the binding of the ```this``` keyword inside your map. Consider using ```.bind(this``` on the outside of your callback function you pass to map to fix this problem. 
  2) Our ```ListContainer``` component needs two things. A ```title``` and a ```key```. If you're stuck on this step look up at ```addNewList``` and check what exactly we're pushing into our ```lists``` array. 

Once you have your ```componentList``` variable, we'll need to swap out some stuff in the return statement of our render method in order to get the UI to be how we want.

* Remove the current ```<ListContainer />``` component and replace it with the AddList component (don't forget to pass it ```addNewList``` as an ```add``` attribute. Then under that, output your ```componentList``` variable using ```{componentList}``` that syntax. 

That should do it for step one. You should now be able to create new Todo lists and each Todo list should be able to add invididual todo items. Once you get that working, let's look out how we'll get to the point of removing todo lists. 

###Step 4: Remove Lists (ListContainer)

At this point you should be feeling fairly comfortable with React. If you are, go ahead and attempt this section without looking at this README for guidance. You'll find that if you can get through this step on your own, you'll be much better off. However, if you're still feeling a little uncomfortable with everything, keep following these steps. 

Now what we want to do is make it so after we add a list, we have the option to remove that list and all its todo items. 

The nice thing about React is to implement this change, we don't have to change a whole lot of code. We know that each Todo list needs an "X" to remove it, and we know we need some function wherever the collection of todolists live to remove a certain list. Both of those functionalities live in just App.js (which is where the collection of lists lives) and ListContainer.js (which is where the "X" button will go). 

Let's first start with our ListContainer.js file. We need to add two things.
  1) Some more CSS which will handle the styling of the remove icon.
  2) An element which will contain the X to remove the item and any functionality along with it. 
  
* Head over to your styles object we made earlier and add this new property. 
```css 
  remove: {
    top: 15,
    color: "rgb(222, 79, 79)",
    float: "left",
    cursor: 'pointer'
  }
```

That's just the basic styling of our remove "X" button.

* Head down to your render template and above your title add a new span element with the following attributes
  1) className of "glyphicon glyphicon-remove"
  2) The style we just created
  3) Whenever this "X" is clicked, run the ```remove``` method that's on the props object passing it the index (which will also be on props).

###Step 5: Remove Lists (App.js)

Now that our ListContainer has the UI for removing a certain list, let's modify our App.js file to have the remove functionality.

* Add a ```handleRemoveList``` method on the ```App``` component which takes in an index, and removes that list in the passed in index from the ```lists``` state.

Now we need to modify when we're building our ```componentList``` variable to include our new ```handleRemoveList``` method we just built as an attribute to every ```ListContainer```. We also need to pass it the index we're currently on in our map. 

* Add a ```remove``` attribute to ```<ListContainer />``` with the value being the ```handleRemoveList``` method we just made.
* Add a ```index``` property with the value being the current index we're on in our map. *hint: You can access the index ```map``` is on as the second parameter to your ```map``` function. 

If Webpack is running you should now be able to add and remove lists.

###Step 6: TodoList Background Colors

The very last step you'll need to do is make it so each Todolist can now have its own background color which will be specified when the user creates the new todolist. If you've made it this far that means you're doing really well. I'm not going to walk through steps on how to do this because often times these steps can be crunches to your real education (when you're wanting to rip your hair out because something isn't working). 

Take a glance at the full sample (URL HERE) and then take an attempt on how you'd add this functionality. 

As always, mentors are here to help you if you get stuck.

