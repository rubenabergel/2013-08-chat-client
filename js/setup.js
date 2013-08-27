
// Don't worry about this code, it will ensure that your ajax calls are allowed by the browser



/*
* Display messages retrieved from the parse server:
*/

//Tries to retrieve all the messages
var dataResults;

//friendsList
var currentFriendsList = {};
//To sign up a user, send a POST request to the users root.
//When the creation is successful:
//    *the HTTP Response is a "201 Created"
//    *Location contains the URL for the new user,
//    Example:
//      Status: 201 Created
//      Location: http://127.0.0.1:8000/1/users/g7y9tkhB7a

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
  url: 'http://127.0.0.1:8000/1/users',
  data: message
  }).done(function(msg, args2, arg3){
    console.log('arg2', args2);
    console.log('args3', arg3);
    console.log('msg',msg);
    if(typeof msg === "string"){
      console.log('string', msg);
      var msgi = JSON.parse(msg);
      console.log('parse', msgi);
      $('#userStatus').html(msgi.createdAt);
      newUser = msgi;
      console.log('signup success');
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
    type:"POST",
    url: 'http://127.0.0.1:8000/1/login',
    contentType: "application/json",
    data : JSON.stringify({"username": username, "password":password}),
    success: function(data){
      if(typeof data === "string"){
      var datai = JSON.parse(data);
      currentLoggedUser = datai.username;
      console.log(datai.username);
      formatUserData(datai);
      console.log("Logged in with : " + datai);
      //hide login form, when user has been logged in
      $('#loginDiv').css("display","none");
      $('#friendsList').css("display", "block");
      console.log('LOGIN successful');
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
  $.ajax('http://127.0.0.1:8000/1/classes/' + $(this).text() + '?order=-createdAt', {
    contentType: 'application/json',
    type:"POST",
    success: function(data){
      data = JSON.stringify(data);
      $('#chatroomTitle').text(currentChatroom);
      console.log('VIcTORY');
      console.log(data);
      dataResults = data.results;
      var template = "<li></li>";
      for(var i = (data.results.length - 1); i >= 0; i--){
       if(currentFriendsList[data.results[i].username] === data.results[i].username){
          chatUsername = $('<span class=\'username userfriends\'>').text(data.results[i].username + ' : ' );
        } else {
          chatUsername = $('<span class=\'username\'>').text(data.results[i].username + ' : ' );
        }
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
   var friendsName = $(this).text().replace(/[^\w\s]/gi, '').replace(/\s+/g, '');
   console.log(friendsName);
  if ((!currentFriendsList[friendsName]) && (friendsName !== currentLoggedUser)){
    currentFriendsList[friendsName] = friendsName;
    $('#friendListNames').append(' * <span class="username">' + friendsName + '<span><br>');
}
};

// make a function
// when friendlist[friedname] ==== username within chatrrom
// bold the message

var updateCurrentChatroom = function(){
  $.ajax('http://127.0.0.1:8000/1/classes/' + currentChatroom + '?order=-createdAt', {
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
    $.ajax('http://127.0.0.1:8000/1/classes/' + currentChatroom, {
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