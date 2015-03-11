# TodoFire

####Objectives
Because the project today is rather large, this mini project will be short. We're going to take the first Mini Project we did (basic todo list), and add firebase to it to persist our list. [Live version here](http://reactweek.com/projects/mini-todofire/). 

####Step 1: Clone Todo List
* Head over to your Mini Project from Day 1 (Todolist) and clone it. 
* Once you clone it, cd into the directory and run ```rm -rf .git``` to remove all the old git stuff.
* If you'd like, fork this project then use ```git remote add origin https://github.com/USERNAME/react-mini3-todofire``` to link your code with github.
* Run ```npm install``` to install all the proper dependencies.
* Run ```npm install --save firebase``` to add firebase as a dependency. 
* run ```webpack -w``` to watch our file for changes.

####Step 2: Create a firebase
* Head over to firebase.com and sign up.
* Create a new project calling it whatever you like. 

####Step 3: Add Firebase Ref.

The very first thing we want to do is add a reference to our Firebase when our main component, which is handling our todo list, mounts.

* At the top of ```ListContainer``` require the firebase module.
* In the ```ListContainer``` component add a ```componentDidMount``` method which has the following things inside it
  - create a reference to your new firebase *using new Firebase(YOUR-URL)* and save that to a variable called ```firebaseRef``` that lives on the component's *```this```* object. 
  - Now, use that ref we just made to invoke the firebase ```.on``` method and pass it ```child_added``` as well as a callback function which has ```snapshot``` as its only parameter.
  - Inside the callback function use ```setState``` to add an object to our state's ```list``` array. This object is going to have a property of 'key' whose value is ```snapshot.key()``` and another property of 'val' whose value is ```snapshot.val()```. The reason we need both the key and val is because in order to remove items (which we'll do later) with firebase we have to know the random characters firebase assigns to the value we want to remove. *hint: Remember, don't modify state directly. Though it seems weird, it's pretty common practice to use ```.concat``` inside of ```this.setState``` to modify the state.*

The componentDidMount method should now look similar to this. 
```javascript
componentDidMount: function(){
  this.firebaseRef = new Firebase("https://reactweek-todofire.firebaseio.com/todos");
  this.firebaseRef.on('child_added', function(snapshot){
    this.setState({
      list: this.state.list.concat([{key: snapshot.key(), val: snapshot.val()}])
    })
  }.bind(this));
}
```

Now what will happen is the callback function in our ```.on``` method will run for every item that's at the /todos endpoint as well as anytime another item gets added there.

We're not quite done though. We also need to set up a ```child_removed``` hook which will tell us which item was removed from our firebase so we can then update that state removing that item. 

* Just like with ```child_added``` invoke ```.on('child_removed'``` passing it a callback which has a parameter of snapshot.
* Now, use ```snapshot.key()``` to get the specific key of the item which was removed and save it to a variable called key
* Create a reference to your state and save it to a variable called ```list```.
* Loop through list, checking if any of the items in the list have a ```key``` property which is equal to the key which was removed. If so, slice it out and break from the loop.
* Once your loop is finished use ```setState``` to set the state with the removed item deleted. *You can also use filter to do this as I did in my code below.*

Your componentDidMount method should now look like this,
```javascript
componentDidMount: function(){
  this.firebaseRef = new Firebase("https://reactweek-todofire.firebaseio.com/todos");
  this.firebaseRef.on('child_added', function(snapshot){
    this.setState({
      list: this.state.list.concat([{key: snapshot.key(), val: snapshot.val()}])
    })
  }.bind(this));

  this.firebaseRef.on('child_removed', function(snapshot){
    var key = snapshot.key();
    var newList = this.state.list.filter(function(item){
      return item.key !== key;
    });
    this.setState({
      list: newList
    });
  }.bind(this));
}
```
####Step 4: Handle Add Item

The next method we need to modify is the handleAddItem method. Right now it's just concerned with the local ```list``` state. However, we want it to be concerned with our actual firebase database. 

* Remove ```this.setState``` from ```handleAddItem``` and instead use the ```.push()``` method that's on the firebase ref you created earlier to push the new item into your firebase.

Your code should look like this.

```javascript
handleAddItem: function(newItem){
  this.firebaseRef.push(newItem);
}
```

Pretty slick right? We don't need to worry about updating the list because our ```child_added``` callback we added to ```componentDidMount``` is doing all that for us.

####Step 5: Handle Remove Item
Since we cached the firebase key on each object in our list array we can now use ```.remove()``` to remove that item from our firebase.

* create a variable called item and set it equal to the item in our list located at the index that's being passed in to handleRemoveItem.
* Using our firebase reference, use ```.child()``` and pass in the key property that's on the item variable we just got, then invoke ```.remove()```. 

Your code should look like this,

```javascript
handleRemoveItem: function(index){
  var item = this.state.list[index];
  this.firebaseRef.child(item.key).remove();
}
```

####Step 6: Change Items Prop
Since we changed our list data structure earlier from being just an array or strings to now an array of object, we either have to modify our List component, or do some changes to our array before we pass the list array into the List component. I vote for modifying the data before we pass it in so we can keep our List component the same. 

* Use map to map over ```this.state.list``` so that you only pass List all of the ```.val``` properties on the list. 
Like this,

```<List items={this.state.list.map(function(item){return item.val})} remove={this.handleRemoveItem}/>```

and that's it. Now our todo list is persisting our data with firebase.

*It was a little annoying trying to keep our components state in sync with our firebase. Because of this, the Firebase devs made a nice Mixin you can use with React in order to keep both in sync. Check it out at [HERE](https://www.firebase.com/docs/web/libraries/react/?utm_source=reactfire)
