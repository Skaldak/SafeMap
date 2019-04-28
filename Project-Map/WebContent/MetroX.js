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
    var card = document.getElementById('pac-card');
    var input = document.getElementById('pac-input');
    var types = document.getElementById('type-selector');
    var strictBounds = document.getElementById('strict-bounds-selector');

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);

    var autocomplete = new google.maps.places.Autocomplete(input);

    // Bind the map's bounds (viewport) property to the autocomplete object,
    // so that the autocomplete requests use the current map bounds for the
    // bounds option in the request.
    autocomplete.bindTo('bounds', map);

    // Set the data fields to return when the user selects a place.
    autocomplete.setFields(
        ['address_components', 'geometry', 'icon', 'name']);

    var infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById('infowindow-content');
    infowindow.setContent(infowindowContent);
    var marker = new google.maps.Marker({
      map: map,
      anchorPoint: new google.maps.Point(0, -29)
    });

    autocomplete.addListener('place_changed', function() {
      infowindow.close();
      marker.setVisible(false);
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);  // Why 17? Because it looks good.
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

      infowindowContent.children['place-icon'].src = place.icon;
      infowindowContent.children['place-name'].textContent = place.name;
      infowindowContent.children['place-address'].textContent = address;
      infowindow.open(map, marker);
    });

    // Sets a listener on a radio button to change the filter type on Places
    // Autocomplete.
    function setupClickListener(id, types) {
      var radioButton = document.getElementById(id);
      radioButton.addEventListener('click', function() {
        autocomplete.setTypes(types);
      });
    }

    setupClickListener('changetype-all', []);
    setupClickListener('changetype-address', ['address']);
    setupClickListener('changetype-establishment', ['establishment']);
    setupClickListener('changetype-geocode', ['geocode']);

    document.getElementById('use-strict-bounds')
        .addEventListener('click', function() {
          console.log('Checkbox clicked! New state=' + this.checked);
          autocomplete.setOptions({strictBounds: this.checked});
        });
  
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