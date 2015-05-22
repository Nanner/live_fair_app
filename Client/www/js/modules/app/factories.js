var module = angular.module('starter');

module.factory('utils', function ($http, $q, $ionicPopup, $ionicLoading) {

    var filtersStartDate;
    var filtersEndDate;
    var profileIdToOpen;
    var profileInfo;

    return {

        getDayMonthYearDate: function(time) {
            var month = time.getUTCMonth(); //months from 1-12
            var day = time.getUTCDate();
            var year = time.getUTCFullYear();

            return new Date(year, month, day);
        },

        getDayMonthYearString: function(time) {
            var month = time.getUTCMonth() + 1; //months from 1-12
            var day = time.getUTCDate();
            var year = time.getUTCFullYear();

            var newdate = year + "/" + month + "/" + day;
            return newdate;
        },

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
        },

        setStartDate: function(startDate) {
            filtersStartDate = startDate;
        },

        setEndDate: function(endDate) {
            filtersEndDate = endDate;
        },

        getStartDate: function() {
            return filtersStartDate;
        },

        getEndDate: function() {
            return filtersEndDate;
        },

        showLoadingPopup: function() {
            $ionicLoading.show({
                template: 'Aguarde...'
            });
        },

        hideLoadingPopup: function() {
            $ionicLoading.hide();
        },

        setProfileIdToOpen: function(profileID) {
            profileIdToOpen = profileID;
        },

        getProfileIdToOpen: function() {
            return profileIdToOpen;
        },

        setProfileInfo: function(profile) {
            profileInfo = profile;
        },

        getProfileInfo: function() {
            return profileInfo;
        }
    };
});

module.factory('calendar', function ($http, $q, $ionicPopup, $cordovaCalendar) {
    
    return {

        createEvent: function(eventTitle, eventLocation, eventNotes, startDate, endDate) {
            $cordovaCalendar.createEvent({
                title: eventTitle,
                location: eventLocation,
                notes: eventNotes,
                startDate: startDate,
                endDate: endDate
            }).then(function (result) {
                console.log("Event created successfully");
            }, function (err) {
                console.error("There was an error: " + err);
            });
        },
        
        createEventInteractively: function(eventTitle, eventLocation, eventNotes, startDate, endDate) {
            $cordovaCalendar.createEventInteractively({
                title: eventTitle,
                location: eventLocation,
                notes: eventNotes,
                startDate: startDate,
                endDate: endDate
            }).then(function (result) {
                console.log("Event created successfully");
            }, function (err) {
                console.error("There was an error: " + err);
            });
        }        
    
    };
});

module.factory('contacts', function ($http, $q, $ionicPopup, $cordovaContacts) {
    
    return {

        getContactList: function() {
            $cordovaContacts.find({filter: ''}).then(function(result) {
                $scope.contacts = result;
            }, function(error) {
                console.log("ERROR: " + error);
            });
        },
        
        removeContact: function(name) {
            $cordovaContacts.remove({"displayName": name}).then(function(result) {
                console.log(JSON.stringify(result));
            }, function(error) {
                console.log(error);
            });
        },
        
        addContact: function(name, phone, email, website, address) {
            $cordovaContacts.save({"displayName": name, "name": {"givenName": name,"formatted": name,"middleName":null,"familyName":null,"honorificPrefix":null,"honorificSuffix":null},"phoneNumbers":[{"type":"other","value":phone ,"id":0,"pref":false}],"emails":[{"type":"home","value": email,"id":0,"pref":false}],"addresses":[{"postalCode":"","type":"work","id":0,"locality":" ","pref":"false","streetAddress": address,"region":" ","country":" "}],"urls":[{"type":"other","value": website,"id":0,"pref":false}]}).then(function(result) {
                console.log(JSON.stringify(result));
            }, function(error) {
                console.log(error);
            });
        }
    
    };
});

module.factory('contacts', function ($http, $q, $ionicPopup, $cordovaContacts) {
    
    return {

        getContactList: function() {
            $cordovaContacts.find({filter: ''}).then(function(result) {
                $scope.contacts = result;
            }, function(error) {
                console.log("ERROR: " + error);
            });
        },
        
        removeContact: function(name) {
            $cordovaContacts.remove({"displayName": name}).then(function(result) {
                console.log(JSON.stringify(result));
            }, function(error) {
                console.log(error);
            });
        },
        
        addContact: function(name, phone, email, website, address) {
            $cordovaContacts.save({"displayName": name, "name": {"givenName": name,"formatted": name,"middleName":null,"familyName":null,"honorificPrefix":null,"honorificSuffix":null},"phoneNumbers":[{"type":"other","value":phone ,"id":0,"pref":false}],"emails":[{"type":"home","value": email,"id":0,"pref":false}],"addresses":[{"postalCode":"","type":"work","id":0,"locality":" ","pref":"false","streetAddress": address,"region":" ","country":" "}],"urls":[{"type":"other","value": website,"id":0,"pref":false}]}).then(function(result) {
                console.log(JSON.stringify(result));
            }, function(error) {
                console.log(error);
            });
        }
    
    };
});

module.factory('camera', function ($http, $q, $ionicPopup) {
    
    return {
        getPicture: function(options) {
          var q = $q.defer();

          navigator.camera.getPicture(function(result) {
            // Do any magic you need
            q.resolve(result);
          }, function(err) {
            q.reject(err);
          }, options);

          return q.promise;
        }    
    };
});