
/*if(!/(&|\?)username=/.test(window.location.search)){
  var newSearch = window.location.search;
  if(newSearch !== '' & newSearch !== '?'){
    newSearch += '&';
  }
  newSearch += 'username=' + (prompt('What is your name?') || 'anonymous');
  window.location.search = newSearch;
}*/

// Don't worry about this code, it will ensure that your ajax calls are allowed by the browser
$.ajaxPrefilter(function(settings, _, jqXHR) {
  jqXHR.setRequestHeader("X-Parse-Application-Id", "voLazbq9nXuZuos9hsmprUz7JwM2N0asnPnUcI7r");
  jqXHR.setRequestHeader("X-Parse-REST-API-Key", "QC2F43aSAghM97XidJw8Qiy1NXlpL5LR45rhAVAf");
});

var message = {
  'username': 'shawndrost',
  'text': 'trololo',
  'roomname': '4chan' // Optional
};

/*
* Display messages retrieved from the parse server:
*/

// //Tries to retrieve all the messages
// var dataResults;
// $.ajax('https://api.parse.com/1/classes/messages', {
//   contentType: 'application/json',
//   success: function(data){
//     dataResults = data.results;
//     for(var i = 0; i < data.results.length; i++){
//       $('#chatMessages').append(data.results[i].text);
//       $('#chatMessages').append("<br />");
//     }
//     //console.log(data);
//   },
//   error: function(data) {
//     console.log('Ajax request failed');
//   }
// });

//To sign up a user, send a POST request to the users root.
//When the creation is successful:
//    *the HTTP Response is a "201 Created"
//    *Location contains the URL for the new user,
//    Example:
//      Status: 201 Created
//      Location: https://api.parse.com/1/users/g7y9tkhB7a

//For taken usernames, it will give a bad request
var newUser;
var signupUser = function(){
  var username = document.forms["userForm"]["username"].value;
  var password = document.forms["userForm"]["password"].value;
  var message = JSON.stringify({"username":username, "password":password});
  console.log(username + " " + password);
  $.ajax({
  contentType: "application/json",
  type:"POST",
  url: 'https://api.parse.com/1/users',
  data: message
  }).done(function(msg){
    console.log(msg);
    if(typeof msg === "object"){
      $('#userStatus').html(msg.createdAt);
      newUser = msg;
    }
  });
};

var toggleCreateUserForm = function(){
  $('#createUser').toggle();
};
var currentLoggedUser;
var loginUser = function(){
  var username = document.forms["userForm"]["username"].value;
  var password = document.forms["userForm"]["password"].value;
  //with GET, do not stringify
  $.ajax({
    type:"GET",
    url: 'https://api.parse.com/1/login',
    contentType: "application/json",
    data : {username: username, password:password}
  }).done(function(msg){
    if(typeof msg === "object"){
      currentLoggedUser = msg;
      console.log(msg);
    }
  });
};

