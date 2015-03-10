var React = require('react/addons');

var ColorList = React.createClass({
  render: function(){
    var styles = {
      colorBG: {
        width: "20%",
        height: 50,
        display: "inline-block",
        cursor: "pointer",
        border: "none"
      }
    };
    var colors = [
      {color: "pink", hex: "#FFACEC"},
      {color: "white", hex: "#ECF0F1"},
      {color: "blue", hex: "#3498DB"},
      {color: "yellow", hex: "#E7D171"},
      {color: "green", hex: "#7AE77C"}
    ];
    var colorList = colors.map(function(item){
      var newStyle = React.addons.update(styles, {
          colorBG: {background:  {$set: item.hex}}
      });
      return (
        <button
          style={newStyle.colorBG}
          key={item.color}
          onClick={this.props.chooseColor.bind(null, newStyle.colorBG.background)}
        />
      );
    }.bind(this));

    return (
      <div>
        {colorList}
      </div>
    )
  }
});

module.exports = ColorList;
