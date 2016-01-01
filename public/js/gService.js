// Creates the gservice factory. This will be the primary means by which we interact with Google Maps
angular.module('gservice', [])
    .factory('gservice', function($rootScope, $http){

    // Initialize Variables
    // -------------------------------------------------------------
    // Service our factory will return
    var googleMapService = {};

    // New vars
    var map;
    var doMark = true;    
    var wayA;
    var wayB;
    var ren;
    var ser;

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
        
        var control = document.createElement('DIV');
        control.index = 1;
        
        map.controls[google.maps.ControlPosition.TOP_RIGHT].push(control);
        google.maps.event.addDomListener(control, 'click', function() {
            doMark = false;
            markNow();
        });
        
        var rendererOptions = {map:map};
        directionsDisplay = new google.maps.DirectionsRenderer(rendererOptions);
        
        google.maps.event.addListener(map, "click", function(event) {
            if (!wayA) {
                wayA = new google.maps.Marker({
                    position: event.latLng,
                    map: map
                });
            } 
            else {
                wayB = new google.maps.Marker({        
                    position: event.latLng,
                    map: map
                });
                
                ren = new google.maps.DirectionsRenderer( {'draggable':true} );
                ren.setMap(map);
                ren.setPanel(document.getElementById("directionsPanel"));
                ser = new google.maps.DirectionsService();

                //Cria a rota, o DirectionTravelMode pode ser: DRIVING, WALKING, BICYCLING ou TRANSIT
                ser.route({ 'origin': wayA.getPosition(), 'destination':  wayB.getPosition(), 'travelMode': google.maps.DirectionsTravelMode.WALKING},function(res,sts) {
                    if(sts=='OK')ren.setDirections(res);
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


