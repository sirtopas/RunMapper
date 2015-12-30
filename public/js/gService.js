// Creates the gservice factory. This will be the primary means by which we interact with Google Maps
angular.module('gservice', [])
    .factory('gservice', function($rootScope, $http){

        // Initialize Variables
        // -------------------------------------------------------------
        // Service our factory will return
        var googleMapService = {};

        // New vars
        var geocoder;
        var map;
        var marker;

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
            // initialize(latitude, longitude);
            initialize();
        };

function initialize(){
    var latlng=new google.maps.LatLng(-33.897,150.099);
    var myOptions={
        zoom:9,
        center:latlng,
        mapTypeId:google.maps.MapTypeId.HYBRID
        };
    map = new google.maps.Map(document.getElementById("map"),myOptions);
        
    var rendererOptions={map:map};
    directionsDisplay=new google.maps.DirectionsRenderer(rendererOptions);

    // Clicking on the Map moves the bouncing red marker
    google.maps.event.addListener(map, 'click', function(e){
        locations.push({location:e.latLng});
        if(locations.length == 5){
            showRoute();
        }
        
        var marker = new google.maps.Marker({
            position: e.latLng,
            animation: google.maps.Animation.BOUNCE,
            map: map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });
    });
}

var showRoute = function() {
    var org=locations[locations.length - 1];
    var dest=locations[0];
    var request= {
        origin:org,
        destination:dest,
        waypoints:locations,
        travelMode:google.maps.DirectionsTravelMode.WALKING
        };
    
    directionsService=new google.maps.DirectionsService();
    directionsService.route(request,function(response,status) {
        if(status==google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            var route = response.routes[0];
            var summaryPanel = document.getElementById('summary-panel');
            var totalDistance = 0;

            for (var i = 0; i < route.legs.length; i++) {
                totalDistance += route.legs[i].distance.value;
                var routeSegment = i + 1;
                summaryPanel.innerHTML += '<b>Route Segment: ' + routeSegment + '</b><br>';
                summaryPanel.innerHTML += route.legs[i].start_address + ' to ';
                summaryPanel.innerHTML += route.legs[i].end_address + '<br>';
                summaryPanel.innerHTML += route.legs[i].distance.text + '<br><br>';
            }
            totalDistance = totalDistance / 1000;
            summaryPanel.innerHTML += totalDistance + 'km <br><br>';
        }
        else
            alert('Failed to get directions');
        });
}

// Initializes the map
var initialize2 = function(latitude, longitude) {

    // Uses the selected lat, long as starting point
    var myLatLng = {lat: selectedLat, lng: selectedLong};

    // If map has not been created already...
    if (!map){

        // Create a new map and place in the index.html page
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 3,
            center: myLatLng,
            mapTypeId: google.maps.MapTypeId.HYBRID
        });
    }

    // Loop through each location in the array and place a marker
    locations.forEach(function(n, i){
        var marker = new google.maps.Marker({
            position: n.latlon,
            map: map,
            title: "Runner Map",
            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        });

        // For each marker created, add a listener that checks for clicks
        google.maps.event.addListener(marker, 'click', function(e){

            // When clicked, open the selected marker's message
            currentSelectedMarker = n;
            n.message.open(map, marker);
        });
    });

    // Set initial location as a bouncing red marker
    var initialLocation = new google.maps.LatLng(latitude, longitude);
    var marker = new google.maps.Marker({
        position: initialLocation,
        animation: google.maps.Animation.BOUNCE,
        map: map,
        icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
    });
    lastMarker = marker;

    // Function for moving to a selected location
    map.panTo(new google.maps.LatLng(latitude, longitude));

    // Clicking on the Map moves the bouncing red marker
    google.maps.event.addListener(map, 'click', function(e){
        var marker = new google.maps.Marker({
            position: e.latLng,
            animation: google.maps.Animation.BOUNCE,
            map: map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });

        // When a new spot is selected, delete the old red bouncing marker
        if(lastMarker){
            lastMarker.setMap(null);
        }

        // Create a new red bouncing marker and move to it
        lastMarker = marker;
        map.panTo(marker.position);
        
        // Update Broadcasted Variable (lets the panels know to change their lat, long values)
        googleMapService.clickLat = marker.getPosition().lat();
        googleMapService.clickLong = marker.getPosition().lng();
        $rootScope.$broadcast("clicked");
    });
};

// Refresh the page upon window load. Use the initial latitude and longitude
google.maps.event.addDomListener(window, 'load',
    googleMapService.refresh(selectedLat, selectedLong));

return googleMapService;
});