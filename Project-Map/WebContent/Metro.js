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
}

function initCorrespondence() {
    $.getJSON("reseau.json", function (Metro) {
        var Correspondence = Metro.corresp;
    })
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
                // icon: getCircle(10)
                icon: getCircle(getTraffic(stationInfomation.nom))
            });
        })
    })
}

function initRoute() {
    $.getJSON("reseau.json", function (Metro) {
        var Route = Metro.routes;
    })
}

function initLine() {
    $.getJSON("reseau.json", function (Metro) {
        var Line = Metro.lignes;
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