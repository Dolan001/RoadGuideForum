$("#menu-toggle").click(function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("menuDisplayed");
});
var infowindow;
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        mapTypeControl: false,
        center: {lat: 23.777176, lng: 90.399452},
        zoom: 16
    });
    var trafficLayer = new google.maps.TrafficLayer();
    trafficLayer.setMap(map);

    infoWindow = new google.maps.InfoWindow;

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);

            var marker = new google.maps.Marker({
                position: pos,
                map: map,
                icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'
            });
            map.setCenter(pos);
        }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        function handleLocationError(browserHasGeolocation, infoWindow, pos) {
            infoWindow.setPosition(pos);
            infoWindow.setContent(browserHasGeolocation ?
                'Error: The Geolocation service failed.' :
                'Error: Your browser doesn\'t support geolocation.');
            infoWindow.open(map);
        }
    }
    google.maps.event.addDomListener(window, 'load', intilize);

    function intilize() {
        var autocomplete1 = new google.maps.places.Autocomplete(document.getElementById('origin-input'));
        var autocomplete2 = new google.maps.places.Autocomplete(document.getElementById('destination-input'));
        google.maps.event.addListener(autocomplete1, 'place_changed', function () {
            var place1 = autocomplete1.getPlace();
            var location1 = place1.formatted_address;
            var lat1 = place1.geometry.location.lat();
            var lng1 = place1.geometry.location.lng();
            document.getElementById('address').innerHTML = location1;

        });
        google.maps.event.addListener(autocomplete2, 'place_changed', function () {
            var place2 = autocomplete2.getPlace();
            var location2 = place2.formatted_address;
            var lat2 = place2.geometry.location.lat();
            var lng2 = place2.geometry.location.lng();
            document.getElementById('address1').innerHTML = location2;
        })
/*
        var origin = document.getElementById('origin-input').value;
        var destination = document.getElementById('destination-input').value;
        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
            {
                origins: [origin],
                destinations: [destination],
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.IMPERIAL, // miles and feet.
                // unitSystem: google.maps.UnitSystem.metric, // kilometers and meters.
                avoidHighways: false,
                avoidTolls: false
            }, callback);

        var origin = $('#origin-input').val();
        var destination = $('#destination-input').val();
        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix(
            {
                origins: [origin],
                destinations: [destination],
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.IMPERIAL, // miles and feet.
                // unitSystem: google.maps.UnitSystem.metric, // kilometers and meters.
                avoidHighways: false,
                avoidTolls: false
            }, callback);
        function callback(response, status) {
            if (status != google.maps.DistanceMatrixStatus.OK) {
                alert(err);
            } else {
                var origin = response.originAddresses[0];
                var destination = response.destinationAddresses[0];
                if (response.rows[0].elements[0].status === "ZERO_RESULTS") {
                    alert("Better get on a plane. There are no roads between "  + origin + " and " + destination);
                } else {
                    var distance = response.rows[0].elements[0].distance;
                    var duration = response.rows[0].elements[0].duration;
                    console.log(response.rows[0].elements[0].distance);
                    var distance_in_kilo = distance.value / 1000; // the kilom
                    var distance_in_mile = distance.value / 1609.34; // the mile
                    var duration_text = duration.text;
                    var duration_value = duration.value;
                    $('#distanceInKm').text(distance_in_mile.toFixed(2));
                    $('#distanceInMile').text(distance_in_kilo.toFixed(2));
                    $('#timeText').text(duration_text);
                    $('#time').text(duration_value);
                }
            }
        }

        function callback(response, status) {
            if (status !== google.maps.DistanceMatrixStatus.OK) {
                alert(err);
            } else {
                var origin = response.originAddresses[0];
                var destination = response.destinationAddresses[0];
                if (response.rows[0].elements[0].status === "ZERO_RESULTS") {
                    alert("Better get on a plane. There are no roads between " + origin + " and " + destination);
                } else {
                    var distance = response.rows[0].elements[0].distance;
                    var duration = response.rows[0].elements[0].duration;
                    console.log(response.rows[0].elements[0].distance);
                    var distance_in_kilo = distance.value / 1000; // the kilom
                    var distance_in_mile = distance.value / 1609.34; // the mile
                    var duration_text = duration.text;
                    var duration_value = duration.value;
                    document.getElementById('distanceInKm').innerHTML = distance_in_kilo;
                    document.getElementById('distanceInMile').innerHTML = distance_in_mile;
                    document.getElementById('timeText').innerHTML = duration_text;
                    document.getElementById('time').innerHTML = duration_value
                }
            }
        }
        */
    };
    infowindow = new google.maps.InfoWindow();
    new AutocompleteDirectionsHandler(map);
}

/**
 * @constructor
 */
function AutocompleteDirectionsHandler(map) {
    this.map = map;
    this.originPlaceId = null;
    this.destinationPlaceId = null;
    this.travelMode = 'WALKING';
    var originInput = document.getElementById('origin-input');
    var destinationInput = document.getElementById('destination-input');
    var modeSelector = document.getElementById('mode-selector');
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.directionsDisplay.setMap(map);

    var originAutocomplete = new google.maps.places.Autocomplete(
        originInput, {placeIdOnly: true});
    var destinationAutocomplete = new google.maps.places.Autocomplete(
        destinationInput, {placeIdOnly: true});

    this.setupClickListener('changemode-walking', 'WALKING');
    this.setupClickListener('changemode-transit', 'TRANSIT');
    this.setupClickListener('changemode-driving', 'DRIVING');

    this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
    this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
}

// Sets a listener on a radio button to change the filter type on Places
// Autocomplete.
AutocompleteDirectionsHandler.prototype.setupClickListener = function (id, mode) {
    var radioButton = document.getElementById(id);
    var me = this;
    radioButton.addEventListener('click', function () {
        me.travelMode = mode;
        me.route();
    });
};

AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function (autocomplete, mode) {
    var me = this;
    autocomplete.bindTo('bounds', this.map);
    autocomplete.addListener('place_changed', function () {
        var place = autocomplete.getPlace();
        if (!place.place_id) {
            window.alert("Please select an option from the dropdown list.");
            return;
        }
        if (mode === 'ORIG') {
            me.originPlaceId = place.place_id;
        } else {
            me.destinationPlaceId = place.place_id;
        }
        me.route();
    });

};

AutocompleteDirectionsHandler.prototype.route = function () {
    if (!this.originPlaceId || !this.destinationPlaceId) {
        return;
    }
    var me = this;

    this.directionsService.route({
        origin: {'placeId': this.originPlaceId},
        destination: {'placeId': this.destinationPlaceId},
        travelMode: this.travelMode
    }, function (response, status) {
        if (status === 'OK') {
            me.directionsDisplay.setDirections(response);
            var center = response.routes[0].overview_path[Math.floor(response.routes[0].overview_path.length / 2)];
            infowindow.setPosition(center);
            var trafficLayer = new google.maps.TrafficLayer();
            trafficLayer.setMap(map);
            var distance = response.routes[0].legs[0].distance.text;
            var duration = response.routes[0].legs[0].duration.text;
            document.getElementById('distanceInKm').innerHTML = distance;
            document.getElementById('duration').innerHTML = duration
            //infowindow.setContent(response.routes[0].legs[0].duration.text + "<br>" + response.routes[0].legs[0].distance.text);
            //infowindow.open(me.map);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
};
//google.maps.event.addDomListener(window, "load", initMap);

//https://stackoverflow.com/questions/50099196/how-to-get-the-distance-between-two-locations-from-a-users-input
