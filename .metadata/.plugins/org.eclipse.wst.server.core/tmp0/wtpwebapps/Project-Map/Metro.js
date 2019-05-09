var map;
var srcLocation, dstLocation;
var directionsRequest, directionsService, directionsRenderer;

function initAutocomplete(map, input, type) {
    var autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.bindTo('bounds', map);
    autocomplete.setFields(['geometry', 'name']);

    var marker = new google.maps.Marker({
        map: map,
    });

    autocomplete.addListener('place_changed', function () {
        marker.setVisible(false);

        var place = autocomplete.getPlace();

        if (!place.geometry) {
            window.alert("404 '" + place.name + "'");
            return;
        } else if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(12.5);
        }
        marker.setPosition(place.geometry.location);
        if (type == 'src') {
            marker.setIcon(getCircle(16, 'green', 0.5));
            srcLocation = place.geometry.location;
            if (dstLocation !== null && dstLocation !== undefined)
                getRoute(srcLocation, dstLocation);
        }
        else if (type == 'dst') {
            marker.setIcon(getCircle(16, 'red', 0.5));
            dstLocation = place.geometry.location;
            if (srcLocation !== null && srcLocation !== undefined)
                getRoute(srcLocation, dstLocation);
        }
        marker.setVisible(true);
    });
}

function initDirection(map) {
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
}

function initMap() {
    // var paris = {
    //     lat: 48.8566,
    //     lng: 2.3522
    // };
    // map = new google.maps.Map(document.getElementById('map'), {
    //     center: paris,
    //     zoom: 12
    // });

    // initDirection(map);
    // initSearch(map);
    // initStation(map);
    analyse();
}

function initSearch(map) {
    var search = document.getElementById('search');
    var input = document.getElementsByClassName('searchInput');

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(search);
    initAutocomplete(map, input[0], 'src');
    initAutocomplete(map, input[1], 'dst');
}

function initStation(map) {
    $.getJSON("reseau.json", function (Metro) {
        var Station = Metro.stations;

        $.each(Station, function (station, stationInfomation) {
            var latlng = new google.maps.LatLng(stationInfomation.lat, stationInfomation.lng);
            var stationMarker = new google.maps.Marker({
                map: map,
                position: latlng,
                title: station,
                icon: getCircle(getMagnitude(getTraffic(stationInfomation.nom)), 'red', 0.2)
            });
        })
    })
}

function getCircle(magnitude, fillColor, fillOpacity) {
    return {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: fillColor,
        fillOpacity: fillOpacity,
        scale: magnitude,
        strokeColor: 'white',
        strokeWeight: .5
    };
}

function getMagnitude(traffic) {
    return (traffic - 177017) / (50860744 - 177017) * 42;
}

function getRoute(src, dst) {
    directionsRequest = {
        origin: src,
        destination: dst,
        travelMode: 'WALKING'
    };

    directionsService.route(directionsRequest, function (result, status) {
        if (status == 'OK') {
            directionsRenderer.setDirections(result);
        }
    })
}

function getTraffic(station) {
    var targetStation = station.toUpperCase();
    var traffic;

    $.ajax({
        dataType: "json",
        url: "traffic.json",
        async: false,
        success: function (Station) {
            $.each(Station, function (station, stationInfomation) {
                var tempStation = stationInfomation.fields.station.toUpperCase();
                if (tempStation == targetStation) {
                    traffic = stationInfomation.fields.trafic;
                }
            })
        }
    })

    if (typeof (traffic) == "undefined")
        return 0;
    else
        return traffic;
}

function navigate() {
    var src = $('#srcInput').val();
    var dst = $('#dstInput').val();

    getRoute(src, dst);
}

function analyse() {
    $.ajax({
        dataType: "json",
        url: "reseau.json",
        async: false,
        success: function (Metro) {
            var Station = Metro.stations;
            var minInterval = Infinity;
            var maxInterval = 0;
            var minLatitude = Infinity;
            var maxLatitude = 0;
            var minLongitude = Infinity;
            var maxLongitude = 0;

            $.each(Station, function (station1, stationInfomation1) {
                var minAdjacent = Infinity;
                var latlng1 = new google.maps.LatLng(stationInfomation1.lat, stationInfomation1.lng);

                $.each(Station, function (station2, stationInfomation2) {
                    var latlng2 = new google.maps.LatLng(stationInfomation2.lat, stationInfomation2.lng);

                    if (stationInfomation1.lat != stationInfomation2.lat && stationInfomation1.lng != stationInfomation2.lng) {
                        var adjacent = google.maps.geometry.spherical.computeDistanceBetween(latlng1, latlng2);

                        if (adjacent < minAdjacent)
                            minAdjacent = adjacent;
                    }
                })
                if (minAdjacent > maxInterval)
                    maxInterval = minAdjacent;
                else if (minAdjacent < minInterval)
                    minInterval = minAdjacent;

                if (stationInfomation1.lat > maxLatitude)
                    maxLatitude = stationInfomation1.lat;
                else if (stationInfomation1.lat < minLatitude)
                    minLatitude = stationInfomation1.lat;
                if (stationInfomation1.lng > maxLongitude)
                    maxLongitude = stationInfomation1.lng;
                else if (stationInfomation1.lng < minLongitude)
                    minLongitude = stationInfomation1.lng;
            })

            var TopLeft = new google.maps.LatLng(maxLatitude, minLongitude);
            var TopRight = new google.maps.LatLng(maxLatitude, maxLongitude);
            var BottomLeft = new google.maps.LatLng(minLatitude, minLongitude);
            var BottomRight = new google.maps.LatLng(minLatitude, maxLongitude);

            var latitudeInterval1 = google.maps.geometry.spherical.computeDistanceBetween(TopLeft, BottomLeft);
            var latitudeInterval2 = google.maps.geometry.spherical.computeDistanceBetween(TopRight, BottomRight);
            var longitudeInterval1 = google.maps.geometry.spherical.computeDistanceBetween(TopLeft, TopRight);
            var longitudeInterval2 = google.maps.geometry.spherical.computeDistanceBetween(BottomLeft, BottomRight);

            document.write("Min Interval = %d m\n", minInterval);
            document.write("Max Interval = %d m\n", maxInterval);
            document.write("Max Latitude = %d\n", maxLatitude);
            document.write("Min Latitude = %d\n", minLatitude);
            document.write("Max Longitude = %d\n", maxLongitude);
            document.write("Min Longitude = %d\n", minLongitude);
            document.write("Latitude Interval1 = %d m\n", latitudeInterval1);
            document.write("Latitude Interval2 = %d m\n", latitudeInterval2);
            document.write("Longitude Interval = %d m\n", longitudeInterval1);
            document.write("Longitude Interva2 = %d m\n", longitudeInterval2);
        }
    })
}

function getX(latitude, longitude) {

}

function getY(latitude, longitude) {

}