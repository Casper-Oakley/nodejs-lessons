
var app = angular.module('chatr', []);
app.controller('chatbox', function($scope, socket) {
  /*$scope.messages = [{
    user: "Casper",
    message: "Isn't this neat!"
  }, {
    user: "Bob",
    message: "Yes it is!"
  }];*/
  $scope.messages = [];

  $scope.newMessage = "";
  $scope.username = "Casper";

  $scope.sendMessage = function() {
    socket.emit('send-message', { user: $scope.username, message: $scope.newMessage});
    console.log('sent ;)');
  };

  socket.on('receive-message', function(data) {
    $scope.messages.push(data);
  });
});


//Factory causing reapplies on any on event and emit event firing
app.factory('socket', function ($rootScope) {
  var socket = io.connect('http://localhost:3000');
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});

