const BOUND = {
    "coordinate": {
        "x": 566,
        "y": 395
    },
    "latitude": {
        "max": 49.04954211817629,
        "min": 48.69506073208291
    },
    "longitude": {
        "max": 2.7828140416090412,
        "min": 2.0120551690790514
    },
    "x": {
        "max": 56570.44245264509,
        "min": 56171.03936832871
    },
    "y": 39416.55647098469
};
var SCALE = 100;
var THRESHOLD = 0.618;
var WAYMAX = 10;

var map;
var mask;
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

// callback
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
    initMask();
}

function initMask() {
    $.ajax({
        dataType: "json",
        url: "Data/mask.json",
        async: false,
        success: function (Mask) {
            mask = Mask.mask;
        }
    });
}

function initSearch(map) {
    var search = document.getElementById('search');
    var input = document.getElementsByClassName('searchInput');

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(search);
    initAutocomplete(map, input[0], 'src');
    initAutocomplete(map, input[1], 'dst');
}

function initStation(map) {
    $.getJSON("Data/reseau.json", function (Metro) {
        var Station = Metro.stations;

        $.each(Station, function (station, stationInformation) {
            var latlng = new google.maps.LatLng(stationInformation.lat, stationInformation.lng);
            var stationMarker = new google.maps.Marker({
                map: map,
                position: latlng,
                title: station,
                icon: getCircle(getMagnitude(getTraffic(stationInformation.nom)), 'red', 0.2)
            });
        });
    });
}

function isSafe(hazardArray) {
    var safe = true;

    $.each(hazardArray, function (hazard, hazardInformation) {
        if (hazardInformation.safety > THRESHOLD) {
            safe = false;
            return safe;
        }
    });

    return safe;
}

function getCircle(magnitude, fillColor, fillOpacity) {
    return {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: fillColor,
        fillOpacity: fillOpacity,
        scale: magnitude,
        strokeColor: 'white',
        strokeWeight: 0.5
    };
}

function getMagnitude(traffic) {
    return (traffic - 177017) / (50860744 - 177017) * 42;
}

function getRoute(src, dst) {
    var hazardArray = [];
    var wayPointArray;

    directionsRequest = {
        origin: src,
        destination: dst,
        travelMode: 'WALKING'
    };
    directionsService.route(directionsRequest, function (response, status) {
        if (status == 'OK') {
            var pace = getPace(response);

            hazardArray = getHazard(pace);
            wayPointArray = getWayPointArray(hazardArray);
            if (wayPointArray.length > 0 && wayPointArray.length < WAYMAX) {
                directionsRequest.waypoints = wayPointArray;
                directionsService.route(directionsRequest, function (response, status) {
                    if (status == 'OK') {
                        getPace(response);
                        directionsRenderer.setDirections(response);
                    }
                });
            }
            else
                directionsRenderer.setDirections(response);
        }
    });
}

// return traffic = integer(person)
function getTraffic(station) {
    var targetStation = station.toUpperCase();
    var traffic;

    $.ajax({
        dataType: "json",
        url: "Data/traffic.json",
        async: false,
        success: function (Station) {
            $.each(Station, function (station, stationInformation) {
                var tempStation = stationInformation.fields.station.toUpperCase();
                if (tempStation == targetStation) {
                    traffic = stationInformation.fields.trafic;
                }
            });
        }
    });

    if (typeof (traffic) == "undefined")
        return 0;
    else
        return traffic;
}

// return coordinate = { x, y }
function getCoordinate(latitude, longitude) {
    return {
        x: getX(latitude, longitude),
        y: getY(latitude, longitude)
    };
}

// return distance = float(m)
function getDistance(lat1, lng1, lat2, lng2) {
    var origin = new google.maps.LatLng(lat1, lng1);
    var target = new google.maps.LatLng(lat2, lng2);

    return google.maps.geometry.spherical.computeDistanceBetween(origin, target);
}

// return hazardArray = [{ latitude, longitude, safety }]
function getHazard(pace) {
    var hazard = [];

    for (var paceCount = 1; paceCount < pace.length - 1; paceCount++) {
        if (pace[paceCount].safety > pace[paceCount - 1].safety && pace[paceCount].safety >= pace[paceCount + 1].safety) {
            hazard.push(pace[paceCount]);
        }
    }

    return hazard;
}

// return kernel[3][3] = mask[][]
function getKernel(x, y) {
    var kernel = {
        "x": [],
        "y": [],
        "safety": []
    };
    var rangeX = [], rangeY = [];

    rangeX.push(x);
    rangeY.push(y);
    if (x > 0) rangeX.push(x - 1);
    if (x < BOUND.coordinate.x) rangeX.push(x + 1);
    if (y > 0) rangeY.push(y - 1);
    if (x < BOUND.coordinate.y) rangeY.push(y + 1);

    for (var xCount = 0; xCount < rangeX.length; xCount++) {
        for (var yCount = 0; yCount < rangeY.length; yCount++) {
            kernel.x.push(rangeX[xCount]);
            kernel.y.push(rangeY[yCount]);
            kernel.safety.push(mask[rangeY[yCount]][rangeX[xCount]]);
        }
    }

    return kernel;
}

// return latlng = { latitude, longitude }
function getLatLng(x, y) {
    var latitude = y * SCALE * (BOUND.latitude.max - BOUND.latitude.min) / BOUND.y + BOUND.latitude.min;
    var bound = getDistance(latitude, BOUND.longitude.min, latitude, BOUND.longitude.max);
    var longitude = x * SCALE * (BOUND.longitude.max - BOUND.longitude.min) / bound + BOUND.longitude.min;

    return {
        "latitude": latitude,
        "longitude": longitude
    };
}

// return mask = float(0~1)
function getMask(latitude, longitude) {
    var coordinate = getCoordinate(latitude, longitude);

    return mask[coordinate.y][coordinate.x];
}

// pace = { latitude, longitude, safety }
function getPace(response) {
    var pace = [];

    $.each(response.routes[0].legs, function (leg, legInformation) {
        $.each(legInformation.steps, function (step, stepInformation) {
            $.each(stepInformation.path, function (path, pathInformation) {
                var paceLatitude = pathInformation.lat();
                var paceLongitude = pathInformation.lng();
                var paceSafety = getMask(paceLatitude, paceLongitude);

                pace.push({ latitude: paceLatitude, longitude: paceLongitude, safety: paceSafety });
            });
        });
    });

    return pace;
}

// return wayPoint = { latitude, longitude }
function getWayPoint(hazard) {
    var target;

    if (hazard.safety > THRESHOLD) {
        target = getCoordinate(hazard.latitude, hazard.longitude);

        while (mask[target.y][target.x] > THRESHOLD) {
            var kernel = getKernel(target.x, target.y);
            var index;
            var next = {};

            next.safety = Math.min.apply(null, kernel.safety);
            index = kernel.safety.findIndex(function (safety) { return safety == next.safety; });
            next.x = kernel.x[index];
            next.y = kernel.y[index];

            target = next;
        }
    }
    else return null;

    return getLatLng(target.x, target.y);
}

// return wayPointArray = [{ latitude, longitude }]
function getWayPointArray(hazardArray) {
    var wayPointArray = [];

    $.each(hazardArray, function (hazard, hazardInformation) {
        var wayPoint = getWayPoint(hazardInformation);
        if (wayPoint != null) {
            var wayPointLatLng = new google.maps.LatLng(wayPoint.latitude, wayPoint.longitude);

            wayPointArray.push({
                location: wayPointLatLng,
                stopover: true
            });
        }
    });

    return wayPointArray;
}

// return x = integer(0~566)
function getX(latitude, longitude) {
    return Math.round(getDistance(latitude, BOUND.longitude.min, latitude, longitude) / SCALE);
}

// return x = integer(0~395)
function getY(latitude, longitude) {
    return Math.round(getDistance(BOUND.latitude.min, longitude, latitude, longitude) / SCALE);
}

function navigate() {
    var src = $('#srcInput').val();
    var dst = $('#dstInput').val();

    getRoute(src, dst);
}