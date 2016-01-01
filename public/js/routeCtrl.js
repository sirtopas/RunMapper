// Creates the routeCtrl Module and Controller. Note that it depends on the 'geolocation' module and service.
var routeCtrl = angular.module('routeCtrl', ['geolocation', 'gservice']);
routeCtrl.controller('routeCtrl', function($scope, $http, $rootScope, geolocation, gservice){
   
    // Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.formData = {};
    $rootScope.legs = 0;
    var coords = {};

    // Get User's actual coordinates based on HTML5 at window load
    geolocation.getLocation().then(function(data){

        // Set the latitude and longitude equal to the HTML5 coordinates
        coords = {lat:data.coords.latitude, long:data.coords.longitude};

        // Display coordinates in location textboxes rounded to three decimal points
        $scope.formData.longitude = parseFloat(coords.long).toFixed(3);
        $scope.formData.latitude = parseFloat(coords.lat).toFixed(3);

        gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
    });
    
    $scope.clearRoute = function() {
        var summaryPanel = document.getElementById('summary-panel');
        var distancePanel = document.getElementById('total-distance');
        var elevationPanel = document.getElementById('total-elevation');
        
        summaryPanel.innerHTML = '';
        distancePanel.innerHTML = '';
        elevationPanel.innerHTML = '';
        $rootScope.legs = 0;

        gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
    };
});