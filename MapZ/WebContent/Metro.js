const LATITUDEBOUND = {
    "max": 49.04954211817629,
    "min": 48.69506073208291
};
const LONGITUDEBOUND = {
    "max": 2.7828140416090412,
    "min": 2.0120551690790514
};
const XBOUND = 57000;
const YBOUND = 40000;
const RADIUS = 4490;

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
        } else if (type == 'dst') {
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
    var paris = {
        lat: 48.8566,
        lng: 2.3522
    };
    map = new google.maps.Map(document.getElementById('map'), {
        center: paris,
        zoom: 12
    });

    initDirection(map);
    initSearch(map);
    initStation(map);
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

function getNormalizedTraffic(station) {
    return (getTraffic(station) - 177017.0) / (50860744.0 - 177017.0);
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

            var LatitudeLeftInterval = google.maps.geometry.spherical.computeDistanceBetween(TopLeft, BottomLeft);
            var LatitudeRightInterval = google.maps.geometry.spherical.computeDistanceBetween(TopRight, BottomRight);
            var LongitudeUpperInterval = google.maps.geometry.spherical.computeDistanceBetween(TopLeft, TopRight);
            var LongitudeLowerInterval = google.maps.geometry.spherical.computeDistanceBetween(BottomLeft, BottomRight);

            console.log("Min Interval = %d m\n", minInterval);
            console.log("Max Interval = %d m\n", maxInterval);
            console.log("Max Latitude = %d\n", maxLatitude);
            console.log("Min Latitude = %d\n", minLatitude);
            console.log("Max Longitude = %d\n", maxLongitude);
            console.log("Min Longitude = %d\n", minLongitude);
            console.log("Latitude Left Interval = %d m\n", LatitudeLeftInterval);
            console.log("Latitude Right Interval = %d m\n", LatitudeRightInterval);
            console.log("Longitude Upper Interval = %d m\n", LongitudeUpperInterval);
            console.log("Longitude Lower Interval = %d m\n", LongitudeLowerInterval);
        }
    })
}

function getX(latitude, longitude) {
    const origin = new google.maps.LatLng(latitude, LONGITUDEBOUND.min);
    var target = new google.maps.LatLng(latitude, longitude);

    return google.maps.geometry.spherical.computeDistanceBetween(origin, target);
}

function getY(latitude, longitude) {
    const origin = new google.maps.LatLng(LATITUDEBOUND.min, longitude);
    var target = new google.maps.LatLng(latitude, longitude);

    return google.maps.geometry.spherical.computeDistanceBetween(origin, target);
}

function getCoordinate(latitude, longitude) {
    return {
        x: getX(latitude, longitude),
        y: getY(latitude, longitude)
    };
}

function getMask() {
    $.ajax({
        dataType: "json",
        url: "reseau.json",
        async: false,
        success: function (Metro) {
            var mask = new Array(XBOUND);
            var Station = Metro.stations;

            mask.forEach(function (xMask) {
                xMask = new Array(YBOUND).fill(0);
            });
            $.each(Station, function (station, stationInfomation) {
                var coordinateStation = getCoordinate(stationInfomation.lat, stationInfomation.lng);
                var normalizedTraffic = getNormalizedTraffic(stationInfomation.nom);

                for (var x = 0; x < XBOUND; x++) {
                    for (var y = 0; y < YBOUND; y++) {}
                }
            })
        }
    })
}