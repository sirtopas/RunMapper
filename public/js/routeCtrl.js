// Creates the routeCtrl Module and Controller. Note that it depends on the 'geolocation' module and service.
var routeCtrl = angular.module('routeCtrl', ['geolocation', 'gservice']);
routeCtrl.controller('routeCtrl', function($scope, $http, $rootScope, geolocation, gservice){
   
    // Initializes Variables
    // ----------------------------------------------------------------------------
    $scope.formData = {};
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
    
    // Functions
    // ----------------------------------------------------------------------------
    $scope.showRoute = function() {
        var org = $rootScope.locations[$rootScope.locations.length - 1];
        var dest = $rootScope.locations[0];
        var request = {
            origin:org,
            destination:dest,
            waypoints:$rootScope.locations,
            travelMode:google.maps.DirectionsTravelMode.WALKING
        };
    
        directionsService=new google.maps.DirectionsService();
        directionsService.route(request,function(response,status) {
            if(status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
                var route = response.routes[0];
                var summaryPanel = document.getElementById('summary-panel');
                var distancePanel = document.getElementById('total-distance');
                var elevationPanel = document.getElementById('total-elevation');

                var totalDistance = 0;

                for (var i = 0; i < route.legs.length; i++) {
                    totalDistance += route.legs[i].distance.value;
                    var routeSegment = i + 1;
                    summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment + '</b><br>';
                    summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
                    summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
                    summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
                }
                
                summaryPanel.innerHTML += totalDistance / 1000 + 'km <br><br>';
                distancePanel.innerHTML += '<h3>Total Distance:</h3>' + totalDistance / 1000 + 'km';
                elevationPanel.innerHTML += '<h3>Total Elevation:</h3>' + totalDistance / 1000 + 'km';
            }
            else
                alert('Failed to get directions');
            });
        gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
    };
    
    $scope.clearRoute = function() {
        var summaryPanel = document.getElementById('summary-panel');
        var distancePanel = document.getElementById('total-distance');
        var elevationPanel = document.getElementById('total-elevation');
        
        summaryPanel.innerHTML = '';
        distancePanel.innerHTML = '';
        elevationPanel.innerHTML = '';

        gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
    };
});