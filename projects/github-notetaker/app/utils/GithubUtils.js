var appConstants = require('../constants/appConstants');
var axios = require('axios');

var id = "YOUR_CLIENT_ID_HERE";
var sec = "YOUR_SECRET_ID_HERE";
var param = "?client_id=" + id + "&client_secret=" + sec;

var githubUtils = {
  getBio: function(username){
    var url = "https://api.github.com/users/" + username + param;
    return axios.get(url);
  },
  getRepos: function(username){
    var url = "https://api.github.com/users/" + username + "/repos" + param;
    return axios.get(url);
  }
};

module.exports = githubUtils;