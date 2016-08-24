angular.module("contactsApp", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            // .when("/", {
            //     templateUrl: "list.html",
            //     controller: "ListController",
            //     resolve: {
            //         contacts: function(Contacts) {
            //           console.log("contacts resolve happens");
            //             return Contacts.getContacts();
            //         }
            //     }
            // })
            // .when("/new/contact", {
            //     controller: "NewContactController",
            //     templateUrl: "contact-form.html"
            // })
            // .when("/contact/:contactId", {
            //     contro ller: "EditContactController",
            //     templateUrl: "contact.html"
            // })
            // route for the rooms pages
            .when("/", {
                templateUrl: "rooms_list.html",
                controller: "MoveController",
                resolve: {
                    rooms: function(RoomsService) {
                        return RoomsService.getRooms();
                    }
                }
            })
            .when('/rooms/:roomId', {
              templateUrl : 'rooms/rooms_temp.html',
              controller  : 'MoveController',
              resolve: {
                rooms: function(RoomsService) {
                  console.log("rooms resolve happens");
                  return RoomsService.getRooms();
                }
              }
            })
            .otherwise({
                redirectTo: "/"
            })
    })
    .service("RoomsService", function($http) {
      console.log("RoomsService is getting used");
        this.getRooms = function() {
            return $http.get("/rooms").
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding rooms.");
                });
        }

        this.getRoom = function(roomId) {
          var url = "/rooms/" + roomId;
          console.log("roomId", roomId);
          return $http.get(url).
              then(function(response) {
                  return response;
              }, function(response) {
                  alert("Error finding this contact.");
              });
        }
    })
    // .service("Contacts", function($http) {
    //   console.log("The Contacts service is getting used");
    //
    //     this.getContacts = function() {
    //       console.log("getContacts happens");
    //         return $http.get("/contacts").
    //             then(function(response) {
    //                 return response;
    //             }, function(response) {
    //                 alert("Error finding contacts.");
    //             });
    //     }
    //     this.createContact = function(contact) {
    //       console.log("contact inside service for post", contact);
    //         return $http.post("/contacts", contact).
    //             then(function(response) {
    //                 return response;
    //             }, function(response) {
    //                 alert("Error creating contact.");
    //             });
    //     }
    //     this.getContact = function(contactId) {
    //       console.log("getContact happens");
    //         var url = "/contacts/" + contactId;
    //         console.log("contactId", contactId);
    //         return $http.get(url).
    //             then(function(response) {
    //                 return response;
    //             }, function(response) {
    //                 alert("Error finding this contact.");
    //             });
    //     }
    //     this.editContact = function(contact) {
    //         var url = "/contacts/" + contact._id;
    //         console.log("edit contact id", contact._id);
    //         return $http.put(url, contact).
    //             then(function(response) {
    //                 return response;
    //             }, function(response) {
    //                 alert("Error editing this contact.");
    //                 console.log(response);
    //             });
    //     }
    //     this.deleteContact = function(contactId) {
    //         var url = "/contacts/" + contactId;
    //         return $http.delete(url).
    //             then(function(response) {
    //                 return response;
    //             }, function(response) {
    //                 alert("Error deleting this contact.");
    //                 console.log(response);
    //             });
    //     }
    // })
    .controller("MoveController", function($scope, $routeParams, rooms, $location)  {
      var roomsData = rooms.data;
      var room_num = parseInt($routeParams.roomId, 10);
      $scope.room_id = $routeParams.roomId;
      $scope.rooms = rooms.data;
      $scope.room_num = parseInt($routeParams.roomId, 10);

      document.getElementById("primaryInputBox").focus();

      // This controls all available directions in the entire game.
      // The grid is plus/minus 1 horizontal & plus/minus 10 vertical.
      // The grid must change for wider than 20 rooms across.
      // In other words, +100 or +1000 when moving north, etc.
      $scope.myFunc = function(text) {
        var thisRoomNumber = $routeParams.roomId;
        for ( prop in roomsData ) {
          if (roomsData[prop].roomName === "room"+thisRoomNumber){

            // Find the directions in the database.
            northValue = roomsData[prop].exit.north;
            southValue = roomsData[prop].exit.south;
            eastValue = roomsData[prop].exit.east;
            westValue = roomsData[prop].exit.west;

            //Alternate keys for same directions
            var northKey = (text === 'north' || text === 'n');
            var southKey = (text === 'south' || text === 's');
            var eastKey = (text === 'east' || text === 'e');
            var westKey = (text === 'west' || text === 'w');
            // If the input matches a possible direction from the database
            if (northKey && northValue === true){
              var newRoom = (room_num + 10).toString();
              $location.path('rooms/' + newRoom);
            } else if (southKey && southValue === true){
              var newRoom = (room_num - 10).toString();
              $location.path('rooms/' + newRoom);
            } else if (eastKey && eastValue === true){
              var newRoom = (room_num + 1).toString();
              $location.path('rooms/' + newRoom);
            } else if (westKey && westValue === true){
              var newRoom = (room_num - 1).toString();
              $location.path('rooms/' + newRoom);
            } else {
              $scope.gameMessage = "Bork!";
              console.log("Bork!");
              // Clear the input on failure
              document.getElementById("primaryInputBox").value=null;
            }
          }
        }
      };
    })

    // .controller("ListController", function(contacts, $scope) {
    //     $scope.contacts = contacts.data;
    // })
    // .controller("NewContactController", function($scope, $location, Contacts) {
    //     $scope.back = function() {
    //         $location.path("/");
    //     }
    //
    //     $scope.saveContact = function(contact) {
    //         Contacts.createContact(contact).then(function(doc) {
    //           console.log("contact inside save", contact);
    //             var contactUrl = "/contact/" + doc.data._id;
    //             $location.path(contactUrl);
    //         }, function(response) {
    //             alert(response);
    //         });
    //     }
    // })
    // .controller("EditContactController", function($scope, $routeParams, Contacts) {
    //     Contacts.getContact($routeParams.contactId).then(function(doc) {
    //         $scope.contact = doc.data;
    //     }, function(response) {
    //         alert(response);
    //     });
    //
    //     $scope.toggleEdit = function() {
    //         $scope.editMode = true;
    //         $scope.contactFormUrl = "contact-form.html";
    //     }
    //
    //     $scope.back = function() {
    //         $scope.editMode = false;
    //         $scope.contactFormUrl = "";
    //     }
    //
    //     $scope.saveContact = function(contact) {
    //         Contacts.editContact(contact);
    //         $scope.editMode = false;
    //         $scope.contactFormUrl = "";
    //     }
    //
    //     $scope.deleteContact = function(contactId) {
    //         Contacts.deleteContact(contactId);
    //     }
    // })
