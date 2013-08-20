
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


/*
* Display messages retrieved from the parse server:
*/

//Tries to retrieve all the messages
var dataResults;
$.ajax('https://api.parse.com/1/classes/messages?order=-createdAt', {
  contentType: 'application/json',
  success: function(data){
    dataResults = data.results;
    for(var i = 0; i < data.results.length; i++){
      $('#chatMessages').append(escape(data.results[i].text));
      $('#chatMessages').append("<br />");
    }
    //console.log(data);
  },
  error: function(data) {
    console.log('Ajax request failed');
  }
});

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
    data : {username: username, password:password},
    success: function(data){
      if(typeof data === "object"){
      currentLoggedUser = data.username;
      console.log(data.username);
      formatUserData(data);
      console.log("Logged in with : " + data);
      }
    },
    error: function(data) {
    console.log('Login failed');
    $('#userStatus').html("Failed Login");
    }
  });
};

var formatUserData = function(obj){
  $('#userStatus').html('Logged in as : ' + obj.username);
};

// var sendMessage = function(){
//   $('textarea#messageText').val().

// };

//create a chatroom -> display the current chatroom we are in -> use that chatroom to send POST data to
//the string for the current chatroom
var currentChatroom;

//Chatroom functions
var makeChatroom = function(){
  var chatName = $('#chatroomName').val();
  var chatButton = $('<button class="chatNameButton">').text(chatName);

  chatButton.click(setChatroom);
  $('#allChatrooms').append('<br>').append(chatButton).append('<br>');


};

var setChatroom = function(){
  console.log("Current Chatroom: " + $(this).text());
  $('#chatMessages').html('');
  var chatNewName = $(this).text();
  currentChatroom = chatNewName;
  $.ajax('https://api.parse.com/1/classes/' + $(this).text() + '?order=-createdAt', {
    contentType: 'application/json',
    type:"GET",
    success: function(data){
      dataResults = data.results;
      var template = "<li></li>";
      for(var i = (data.results.length - 1); i >= 0; i--){
        $('#chatMessages').append("<span class='username'>"+ data.results[i].username +"</span> : ");
        $('#chatMessages').append(escape(data.results[i].text));
        $('#chatMessages').append("<br>");
      }
    },
    error: function(data) {
      console.log('Ajax request failed');
    }
  });
};

var updateCurrentChatroom = function(){
  $.ajax('https://api.parse.com/1/classes/' + currentChatroom + '?order=-createdAt', {
    contentType: 'application/json',
    type:"GET",
    success: function(data){
      dataResults = data.results;
      var template = "<li></li>";
      $('#chatMessages').append("<span class='username'>"+ currentLoggedUser +"</span> : ");
      $('#chatMessages').append(escape(data.results[0].text));
      $('#chatMessages').append("<br>");
    },
    error: function(data) {
      console.log('Ajax request failed');
    }
  });
};

var sendChatMessage = function(){
  var chatMessage = $('textarea#messageText').val();
  var messageObj = JSON.stringify({"text":chatMessage, "username":currentLoggedUser});
  $.ajax('https://api.parse.com/1/classes/' + currentChatroom, {
    contentType: 'application/json',
    type: "POST",
    data: messageObj,
    success: function(data){
      updateCurrentChatroom();
    },
    error: function(data){
      console.log("Failed sending a message");
    }
  });
};
// function ratchetmessages(){
//     messageObject ={
//       username: "Chief Keef",
//       text: "Where all the spambot shawties at?"
//     };
//     sendText = JSON.stringify(messageObject);
//     $.ajax({
//       type: "POST",
//       url: 'http://127.0.0.1:8081/classes/messages',
//       data: sendText,
//       contentType: 'application/json'
//     });
// }
// setInterval(ratchetmessages,5000);
// setInterval(function(){
//   chat.updater();
// },5000);