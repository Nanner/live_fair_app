var module = angular.module('starter');

module.factory('utils', function ($http, $q, $ionicPopup) {
    
    return {
        
        getMonthName: function(month) {
            switch(month) {
                case 1:
                    return "Janeiro";
                    break;
                case 2: 
                    return "Fevereiro";
                    break;
                case 3:
                    return "Março";
                    break;
                case 4:
                    return "Abril";
                    break;
                case 5:
                    return "Maio";
                    break;
                case 6:
                    return "Junho";
                    break;
                case 7:
                    return "Julho";
                    break;
                case 8:
                    return "Agosto";
                    break;
                case 9:
                    return "Setembro";
                    break;
                case 10:
                    return "Outubro";
                    break;
                case 11:
                    return "Novembro";
                    break;
                case 12:
                    return "Dezembro";
                    break;
                default: 
                    break;
            }    
        },
 
        showAlert: function(message, title) {
            var alertPopup = $ionicPopup.alert({
             title: title,
             template: message
           }); 
        }
    };
});

module.factory('calendar', function ($http, $q, $ionicPopup, $cordovaCalendar) {
    
    return {

        createEvent: function(eventTitle, eventLocation, eventNotes, year, month, day, startHour, startMinute, endHour, endMinute) {
            $cordovaCalendar.createEvent({
                title: eventTitle,
                location: eventLocation,
                notes: eventNotes,
                startDate: new Date(year, month, day, startHour, startMinute, 0, 0, 0),
                endDate: new Date(year, month, day, endHour, endMinute, 0, 0, 0)
            }).then(function (result) {
                console.log("Event created successfully");
            }, function (err) {
                console.error("There was an error: " + err);
            });
        },
        
        createEventInteractively: function(eventTitle, eventLocation, eventNotes, year, month, day, startHour, startMinute, endHour, endMinute) {
            $cordovaCalendar.createEventInteractively({
                title: eventTitle,
                location: eventLocation,
                notes: eventNotes,
                startDate: new Date(year, month, day, startHour, startMinute, 0, 0, 0),
                endDate: new Date(year, month, day, endHour, endMinute, 0, 0, 0)
            }).then(function (result) {
                console.log("Event created successfully");
            }, function (err) {
                console.error("There was an error: " + err);
            });
        }        
    
    };
});