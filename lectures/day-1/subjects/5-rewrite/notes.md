Let's see what that original jQuery code looks like in React:

```js
var App = React.createClass({
  getInitialState () {
    return { items: [] }
  },

  handleSearch: debounce(function (event) {
    this.fetch(event.target.value);
  }, 500),

  handleRemove (removedItem) {
    this.setState({
      items: this.state.items.filter(item => item !== removedItem)
    });
  },

  fetch (term) {
    $.getJSON(url, (items) => {
      this.setState({ items: items });
    });
  },

  render () {
    return (
      <div>
        <input onKeyUp={this.handleSeach} />
        <ul>
          {this.props.data.map(item => (
            <Result item={item} onRemove={this.handleRemove}/>
          ))}
        </ul>
      </div>
    );
  }
});

var Result = React.createClass({
  getInitialState () {
    return {
      timeAgoText: timeAgo(this.props.item.posted_at),
      prompt: false
    };
  },

  componentDidMount () {
    this.interval = setInterval(() => {
      this.setState({
        timeAgoText: timeAgo(this.props.item.posted_at)
      });
    }, 5000);
  },

  componentWillUnmount () {
    clearInterval(this.interval);
  },

  remove () {
    this.props.onRemove(this.props.item);
  },

  prompt () {
    this.setState({ prompt: true });
  },

  closeModal () {
    this.setState({ prompt: false });
  },

  render () {
    var { title, description } = this.props.item;
    var { timeAgoText } = this.state;
    return (
      <li>
        <h2>
          {title}
          <button onClick={this.prompt}>remove</button>
         </h2>
         <p>Posted {timeAgoText}</p>
         <p>{description}</p>
         <Modal isOpen={this.state.prompt}>
           Are you sure sure?
           <button onClick={this.closeModal}>No</button>
           <button onClick={this.remove}>Yes</button>
         </Modal>
      </li>
    );
  }
});

React.render(<App/>, document.getElementById('app'));
```

- What state is there?
- Where is it mutated?

Note that `App` is not a unique component, it can be composed with any
other components. Maybe right now it owns the app, maybe later its just
a part of a bigger app, nothing about it needs to change.

```js
var BiggerApp = React.createClass({
  render () {
    return (
      <div>
        <Sidebar/>
        <Header/>
        <App/> {/* <-- nothing changed at all */}
      </div>
    );
  }
});
```

