function initMap() {
    var parisCenter = {
        lat: 48.8566,
        lng: 2.3522
    };
    var map = new google.maps.Map(document.getElementById('map'), {
        center: parisCenter,
        zoom: 12
    });
    var parisMarker = new google.maps.Marker({
        position: parisCenter,
        map: map
    });

    initStation(map);
    initSearch(map);

    // var directionsService = new google.maps.DirectionsService();
    // var directionsDisplay = new google.maps.DirectionsRenderer();
    // var srcLatLng = new google.maps.LatLng(48.88430478953, 2.3670850145355);
    // var dstLatLng = new google.maps.LatLng(48.93761835474619, 2.3620002027025153);

    // directionsDisplay.setMap(map);
    // getRoute(srcLatLng, dstLatLng, directionsService, directionsDisplay);
}

function initSearch(map) {
    var search = document.getElementById('search');
    var input = document.getElementsByClassName('searchInput');

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(search);
    initAutocomplete(map, input[0]);
    initAutocomplete(map, input[1]);
}

function initAutocomplete(map, input) {
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
            map.setZoom(14);
        }
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

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

function initStation(map) {
    $.getJSON("reseau.json", function (Metro) {
        var Station = Metro.stations;

        $.each(Station, function (station, stationInfomation) {
            var latlng = new google.maps.LatLng(stationInfomation.lat, stationInfomation.lng);
            var stationMarker = new google.maps.Marker({
                map: map,
                position: latlng,
                title: station,
                icon: getCircle(getTraffic(stationInfomation.nom))
            });
        })
    })
}

function getCircle(magnitude) {
    return {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: 'red',
        fillOpacity: .2,
        scale: (magnitude - 177017) / (50860744 - 177017) * 42,
        strokeColor: 'white',
        strokeWeight: .5
    };
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

function getRoute(src, dst, directionsService, directionsDisplay) {
    var directionsRequest = {
        origin: src,
        destination: dst,
        travelMode: "TRANSIT",
        transitOptions: {
            modes: ['RAIL']
        }
    };

    directionsService.route(directionsRequest, function (result, status) {
        if (status == 'OK') {
            alert(status);
            directionsDisplay.setDirections(result);
        }
    })
}