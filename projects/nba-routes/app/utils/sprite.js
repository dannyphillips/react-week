var parent = {
  backgroundImage: "url(images/spritesheet.png)",
  backgroundRepeat: "no-repeat",
  display: "block",
  width: 200,
  height: 200,
  margin: "20px auto"
};

var clone = function(obj){
  var newObj = {};
  for(var key in obj){
    newObj[key] = obj[key];
  }
  return newObj;
};

var teams = [
  {name: 'blazers', pos: "-215px -5px"},
  {name: 'bulls', pos: "-635px -5px"},
  {name: 'cavs', pos: "-5px -215px"},
  {name: 'celtics', pos: "-215px -215px"},
  {name: 'hawks', pos: "-425px -215px"},
  {name: 'heat', pos: "-635px -215px"},
  {name: 'jazz', pos: "-5px -425px"},
  {name: 'knicks', pos: "-215px -425px"},
  {name: 'lakers', pos: "-425px -425px"},
  {name: 'nets', pos: "-425px -5px"},
  {name: 'pacers', pos: "-635px -425px"},
  {name: 'pelicans', pos: "-5px -635px"},
  {name: 'raptors', pos: "-215px -635px"},
  {name: 'sixers', pos: "-5px -5px"},
  {name: 'thunder', pos: "-425px -635px"},
  {name: 'wizards', pos: "-635px -635px"}
];

var teamsObj = {};
for(var i = 0; i < teams.length; i++){
  teamsObj[teams[i].name] = clone(parent);
  teamsObj[teams[i].name].backgroundPosition = teams[i].pos;
};

module.exports = teamsObj;