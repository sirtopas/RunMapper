// Creates the gservice factory. This will be the primary means by which we interact with Google Maps
angular.module('gservice', [])
    .factory('gservice', function($rootScope, $http){

    // Initialize Variables
    // -------------------------------------------------------------
    // Service our factory will return
    var googleMapService = {};

    // New vars
    var map;

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

        // Clicking on the Map moves the bouncing red marker
        google.maps.event.addListener(map, 'click', function(e) {
            locations.push({location:e.latLng});
            $rootScope.locations.push({location:e.latLng});
            
            var marker = new google.maps.Marker({
                position: e.latLng,
                map: map,
                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            });
        });
    };

    // Refresh the page upon window load. Use the initial latitude and longitude
    google.maps.event.addDomListener(window, 'load', googleMapService.refresh(selectedLat, selectedLong));

    return googleMapService;
});