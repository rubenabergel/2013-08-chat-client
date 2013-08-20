
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

$( "#messageBody" ).delegate( "span", "click", function() {
  console.log("TEST");
});


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
      //hide login form, when user has been logged in
      $('#loginDiv').css("display","none");
      }
    },
    error: function(data) {
    console.log('Login failed');
    $('#userStatus').html("Failed Login");
    }
  });
};

var formatUserData = function(obj){
  $('#userStatus').html('Logged in as : <span class="username"> ' + obj.username + "</span>");
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
  if((/^[a-zA-Z]+$/).test(chatName)){
    //if valid string for chatroom name (no numbers allowed in name for chatroom)
    var chatButton = $('<button class="chatNameButton blue">').text(chatName);
    chatButton.click(setChatroom);
    $('#allChatrooms').append('<br>').append(chatButton).append('<br>');
  } else {
    alert("Chatroom name contains invalid characters, only letters are allowed.");
    var chatName = $('#chatroomName').val("");
  }
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
      $('#chatroomTitle').text(currentChatroom);
      dataResults = data.results;
      var template = "<li></li>";
      for(var i = (data.results.length - 1); i >= 0; i--){
        //add click event to the span
        var chatUsername = $('<span class=\'username\'>').text(data.results[i].username + ' : ' );
        chatUsername.click(addUserAsFriend);

        //$('#chatMessages').append("<span class='username'>"+ data.results[i].username +"</span> : ");
        $('#chatMessages').append(chatUsername);
        $('#chatMessages').append(data.results[i].text);
        $('#chatMessages').append("<br>");
      }
    },
    error: function(data) {
      console.log('Ajax request failed');
    }
  });
};

var addUserAsFriend = function(){
  console.log("TEST " + $(this).text());
};

var updateCurrentChatroom = function(){
  $.ajax('https://api.parse.com/1/classes/' + currentChatroom + '?order=-createdAt', {
    contentType: 'application/json',
    type:"GET",
    success: function(data){
      dataResults = data.results;
      var template = "<li></li>";
      var chatUsername = $('<span class=\'username\'>').text(currentLoggedUser+ ' : ' );
      chatUsername.click(addUserAsFriend);

      // $('#chatMessages').append("<span class='username'>"+ currentLoggedUser +"</span> : ");
      $('#chatMessages').append(chatUsername);
      $('#chatMessages').append(data.results[0].text);
      $('#chatMessages').append("<br>");
    },
    error: function(data) {
      console.log('Ajax request failed');
    }
  });
};

var sendChatMessage = function(){
  if(currentLoggedUser === undefined){
    alert("You must be logged in");
  } else {
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
}
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