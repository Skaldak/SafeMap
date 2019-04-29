var map;
var srcLocation, dstLocation;
var directionsRequest, directionsService, directionsRenderer;

function initAutocomplete(map, input, type) {
    var autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.bindTo('bounds', map);
    autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);

    var info = new google.maps.InfoWindow();
    var infoContent = document.getElementById('infoContent');

    info.setContent(infoContent);

    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    if (type == 'src')
        marker.setIcon(getCircle(16, 'green', 0.5));
    else if (type == 'dst')
        marker.setIcon(getCircle(16, 'red', 0.5));

    autocomplete.addListener('place_changed', function () {
        info.close();
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
        marker.setVisible(true);
        if (type == 'src') {
            srcLocation = place.geometry.location;
            if (dstLocation !== null && dstLocation !== undefined)
                getRoute(srcLocation, dstLocation);
        }
        else if (type == 'dst') {
            dstLocation = place.geometry.location;
            if (srcLocation !== null && srcLocation !== undefined)
                getRoute(srcLocation, dstLocation);
        }

        var address = '';

        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }
        infoContent.children['placeIcon'].src = place.icon;
        infoContent.children['placeName'].textContent = place.name;
        infoContent.children['placeAddress'].textContent = address;
        info.open(map, marker);
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
    // initStation(map);
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
        travelMode: "TRANSIT",
        transitOptions: {
            modes: ['RAIL']
        }
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