var module = angular.module('fairModule');


module.controller('fairProgramCtrl', function ($scope, $state, $stateParams, calendar, liveFairApi, schedule, utils,$localStorage) {
if(!$localStorage.get('userEmail'))
    $state.go('login');

 $scope.username = $localStorage.get('userEmail');
 $scope.userID = $localStorage.get('userID');
 $scope.fairID = $stateParams.fairID;

 console.log(schedule);

 $scope.schedule=schedule;

 $scope.newEvent = function(fairID)
 {
  var sDate = new Date($scope.sdate);
  var eDate = new Date($scope.edate);
  liveFairApi.newLiveFairEvent($scope.local, sDate, eDate, $scope.speakers, $scope.subject, fairID);
  $state.reload();
};

$scope.logout = function()
{
    liveFairApi.logout();
    $state.go('login');
};
});

module.controller('listFairsCtrl', function ($scope, $state, $stateParams, listfairs, utils, liveFairApi, $localStorage) {

 if(!$localStorage.get('userEmail'))
    $state.go('login');

    $scope.failedToResolve = listfairs == "failed to resolve";
    if($scope.failedToResolve)
        return;


$scope.logout = function()
{
    liveFairApi.logout();
    $state.go('login');
};

    $(".alert-message").alert();
window.setTimeout(function() { $(".alert-message").alert('close'); }, 2000);

    $('.inputTags').tagsinput({
       maxTags: 5
   }); 

    $scope.username = $localStorage.get('userEmail');
    $scope.userID = $localStorage.get('userID');
    $scope.listfairs = listfairs;

    for(var i =  $scope.listfairs.length - 1; i >= 0; i--) {
        if( $scope.listfairs[i].organizerOrganizerID != $scope.userID) {
            $scope.listfairs.splice(i, 1);
        }
    }

    $scope.formatMonth = function() {
        for(i = 0; i < $scope.listfairs.length; i++) {
            $scope.listfairs[i].month = utils.getMonthName($scope.listfairs[i].month);
        }
    };

    $scope.loadFairVisitors=function(fairID)
    {
        $state.go('visitors', {fairID: fairID});
    };

    $scope.loadFairCompanies=function(fairID)
    {
        $state.go('companies', {fairID: fairID});
    };

    $scope.loadFairProgram=function(fairID)
    {
        $state.go('program', {fairID: fairID});
    };

    $scope.loadPastFairs = function(){
        $scope.listfairs = listfairs;
        for(var i =  $scope.listfairs.length - 1; i >= 0; i--) {
            if( $scope.listfairs[i].organizerOrganizerID != $scope.userID) {
                $scope.listfairs.splice(i, 1);
            }
        }

        var pastFairs=[];
        var curdate = new Date();
        for(i = 0; i < $scope.listfairs.length; i++) {
            var fairDate = new Date($scope.listfairs[i].endDate);
            if( fairDate < curdate)
            {
             pastFairs.push($scope.listfairs[i]);
         }
     }
     $scope.listfairs=pastFairs;
     console.log($scope.listfairs.length);

 };

 $scope.loadNextFairs = function(){
    $scope.listfairs = listfairs;
    for(var i =  $scope.listfairs.length - 1; i >= 0; i--) {
        if( $scope.listfairs[i].organizerOrganizerID != $scope.userID) {
            $scope.listfairs.splice(i, 1);
        }
    }

    var nextFairs=[];
    var curdate = new Date();
    for(i = 0; i < $scope.listfairs.length; i++) {
        var fairDate = new Date($scope.listfairs[i].startDate);
        if( fairDate > curdate)
        {
            nextFairs.push($scope.listfairs[i]);
        }  
    }
    $scope.listfairs=nextFairs;
    console.log($scope.listfairs.length);
};

$scope.loadCurrentFairs = function(){
    $scope.listfairs = listfairs;
    for(var i =  $scope.listfairs.length - 1; i >= 0; i--) {
        if( $scope.listfairs[i].organizerOrganizerID != $scope.userID) {
            $scope.listfairs.splice(i, 1);
        }
    }

    var nextFairs=[];
    var curdate = new Date();
    for(i = 0; i < $scope.listfairs.length; i++) {
        var sDate = new Date($scope.listfairs[i].startDate);
        var eDate = new Date($scope.listfairs[i].endDate);
        if( sDate <= curdate && curdate <= eDate)
        {
            nextFairs.push($scope.listfairs[i]);
        }  
    }
    $scope.listfairs=nextFairs;
    console.log($scope.listfairs.length);
};

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            
            reader.onload = function (e) {
                $('#blah').attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
    
    $("#imgInp").change(function(){
        readURL(this);
    });


$scope.newFair = function(userID)
{
    console.log(userID);
    var organizerID = userID;
    var filename = $('#imgInp').val().replace(/^.*[\\\/]/, '');
    console.log($scope.map);
  var interestsList = $(".inputTags").tagsinput('items');
  console.log(interestsList);
  var sDate = new Date($scope.sdate);
  var eDate = new Date($scope.edate);
  liveFairApi.newLiveFair(organizerID, $scope.name, $scope.description, sDate, 
    eDate, $scope.local,$scope.address, $scope.city, filename,interestsList,$scope.map);
  $state.reload();
};
});

module.controller('fairVisitorsCtrl', function ($scope, $state, $stateParams, utils, liveFairApi, $localStorage) {
    if(!$localStorage.get('userEmail'))
    $state.go('login');
  
   $scope.username = $localStorage.get('userEmail');
   var fairID = $stateParams.fairID;
   $scope.fair = liveFairApi.getLiveFair(fairID);
   liveFairApi.getLiveFairVisitors(fairID).$promise.then(function(visitorsIDs) {
    console.log(visitorsIDs);

    $scope.visitors = [];

    visitorsIDs.forEach(function(e){
        $scope.visitors.push(liveFairApi.getProfile(e.visitorID));
    });

    console.log($scope.visitors);   
});

$scope.changeState = function(userID, userState)
{
    liveFairApi.changeState(userID,userState);
    $state.reload();
};

   $scope.checkBlocked=function(result)
   {
    if(result==true)
        return true;
    else
        return false;
};



$scope.logout = function()
{
    liveFairApi.logout();
    $state.go('login');
};
});


module
.filter("asDate", function () {
    return function (input) {
        return new Date(input);
    }
});

module.controller('fairCompaniesCtrl', function ($scope, $state, $stateParams, utils, liveFairApi, $localStorage) {
   if(!$localStorage.get('userEmail'))
    $state.go('login');

   $scope.username = $localStorage.get('userEmail');
   var fairID = $stateParams.fairID;
   $scope.fair = liveFairApi.getLiveFair(fairID);

   liveFairApi.getLiveFairStands(fairID).$promise.then(function(fairCompanies) {

    $scope.fairCompanies = fairCompanies;
    $scope.companies = [];

    fairCompanies.forEach(function(e){
        $scope.companies.push(liveFairApi.getProfile(e.companyID));
    });

    console.log($scope.companies);   


});

$scope.changeState = function(userID, userState)
{
    liveFairApi.changeState(userID,userState);
    $state.reload();
};
   $scope.checkBlocked=function(result)
   {
    if(result==true)
        return true;
    else
        return false;
};

$scope.logout = function()
{
    liveFairApi.logout();
    $state.go('login');
};


});


module.controller('ModalInstanceCtrl', function ($state,$scope, $modalInstance, companie,companies, liveFairApi)
{
$scope.companie = companie;
$scope.companies = companies;
 $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };


$scope.editComp = function (comp)
{   
    console.log($scope.companies.email);
    console.log($scope.companies.description);
    console.log($scope.companies.contact);
    console.log(comp.companyID);
    console.log($scope.companie.companyName);
    console.log($scope.companie.website);
    console.log($scope.companie.address);
    liveFairApi.editProfile(comp.companyID, $scope.companie.companyName, $scope.companies.description,
     $scope.companies.contact, $scope.companie.address, $scope.companies.email, $scope.companie.website);
    $state.reload();
    $modalInstance.dismiss('cancel');
};


});

module.controller('CompanieController', function($scope, $timeout, $modal, $log) {

    // MODAL WINDOW
    $scope.open = function (companie,companies) {

    console.log(companie);
    console.log(companies);
        var modalInstance = $modal.open({
          controller: "ModalInstanceCtrl",
          templateUrl: 'myModalContent.html',
            resolve: {
                companie: function()
                {
                    return companie;
                },
                 companies: function()
                {
                    return companies;
                }
            }
             });

    };


});

module.filter('orderObjectBy', function(){
 return function(input, attribute) {
    if (!angular.isObject(input)) return input;

    var array = [];
    for(var objectKey in input) {
        array.push(input[objectKey]);
    }

    array.sort(function(a, b){
        a = parseInt(a[attribute]);
        b = parseInt(b[attribute]);
        return a - b;
    });
    return array;
 }
});

module.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);