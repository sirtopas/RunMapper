// Creates the gservice factory. This will be the primary means by which we interact with Google Maps
angular.module('gservice', [])
    .factory('gservice', function($rootScope, $http){

    // Initialize Variables
    // -------------------------------------------------------------
    // Service our factory will return
    var googleMapService = {};
    var map;
    var doMark = true;    
    var waypointA;
    var waypointB;
    var totalDistance = 0;

    // Array of locations obtained from API calls
    var locations = [];

    // Selected Location (initialize to center of America)
    var selectedLat = 39.50;
    var selectedLong = -98.35;

    // Handling Clicks and location selection
    googleMapService.clickLat  = 0;
    googleMapService.clickLong = 0;
    
    // Functions
    // --------------------------------------------------------------
    // Refresh the Map with new data. Function will take new latitude and longitude coordinates.
    googleMapService.refresh = function(latitude, longitude){
        // Clears the holding array of locations
        locations = [];
        // Set the selected lat and long equal to the ones provided on the refresh() call
        selectedLat = latitude;
        selectedLong = longitude;
        // Then initialize the map.
        initialize(latitude, longitude);
    };

    var initialize = function(latitude, longitude) {
        $rootScope.locations = [];
        
        var latlng = new google.maps.LatLng(latitude,longitude);
        var myOptions = {
            zoom:17,
            center:latlng,
            mapTypeId:google.maps.MapTypeId.HYBRID
        };
        
        map = new google.maps.Map(document.getElementById("map"),myOptions);
        
        var rendererOptions = {map:map};
        directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
        
        google.maps.event.addListener(map, "click", function(event) {
            if (!waypointA) {
                waypointA = new google.maps.Marker({
                    position: event.latLng,
                    map: map
                });
            } 
            else {
                waypointB = new google.maps.Marker({        
                    position: event.latLng
                });
                
                directionsRenderer = new google.maps.DirectionsRenderer( {'draggable':true} );
                directionsRenderer.setMap(map);
                directionsService = new google.maps.DirectionsService();

                directionsService.route({ 'origin': waypointA.getPosition(), 'destination':  waypointB.getPosition(), 'travelMode': google.maps.DirectionsTravelMode.WALKING}, function(response,status) {
                if(status == google.maps.DirectionsStatus.OK) {
                    $rootScope.legs++;
                    directionsRenderer.setDirections(response);
                    var route = response.routes[0];
                    var summaryPanel = document.getElementById('summary-panel');
                    var distancePanel = document.getElementById('total-distance');
                    var elevationPanel = document.getElementById('total-elevation');

                    totalDistance += route.legs[0].distance.value;
                    summaryPanel.innerHTML += '<b>Route Segment: ' + $rootScope.legs + '</b><br>';
                    summaryPanel.innerHTML += route.legs[0].start_address + ' to ';
                    summaryPanel.innerHTML += route.legs[0].end_address + '<br>';
                    summaryPanel.innerHTML += route.legs[0].distance.text + '<br><br>';
                    
                    distancePanel.innerHTML = '<h3>Total Distance:</h3>' + totalDistance / 1000 + 'km';
                    elevationPanel.innerHTML = '<h3>Total Elevation:</h3>' + totalDistance / 1000 + 'km';
                    
                    waypointA = waypointB;
                }
                else
                    alert('Failed to get directions');
                });		
            }
        });
    };
    
    // Refresh the page upon window load. Use the initial latitude and longitude
    google.maps.event.addDomListener(window, 'load', googleMapService.refresh(selectedLat, selectedLong));

    function markNow() {
        if (doMark == false)
        {
            google.maps.event.addListener(map, "click", function(event) {
                marker = new google.maps.Marker({
                    position: event.latLng,
                    map: map
                });

                google.maps.event.addListener(marker, "click", function() {
                    infowindow.open(map, marker);
                });
            });
        };
    };
        
    return googleMapService;
});


