
// On initialise la latitude et la longitude au centre de la France / Initialize map at the center of France
var lat = 48.8534;
var lon = 2.3488;
var macarte = null;


// Fonction d'initialisation de la carte / Init the map
function initMap() {

var overlapGraph = 0; // Permet d'alterner entre radioInput et mutiple select boxes / Switch between radioinput and selectboxes

//-------------------------------Layers Group -----------------------------------

var Pharmacies = L.layerGroup();
var Parcs = L.layerGroup();
var Hopitaux = L.layerGroup();
var CentresSportifs = L.layerGroup();
var RetrievedData; // Recuperation de données du geocoding --> Adresse vers localisation / Retrieve forward Geocoding and store it --> Convert address into lattitue and longitude


//----------------------------- TileLayers Overlay ------------------------------

var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
mbUrl = 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

var grayscale   = L.tileLayer(mbUrl, {id: 'mapbox.light', attribution: mbAttr}),
streets  = L.tileLayer(mbUrl, {id: 'mapbox.streets',   attribution: mbAttr}),
init = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
		// Il est toujours bien de laisser le lien vers la source des données
		attribution: 'données © OpenStreetMap/ODbL - rendu OSM France',
		minZoom: 1,
		maxZoom: 20
	}),
WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
}),
CartoDB_DarkMatter = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 19
}),

Thunderforest_TransportDark = L.tileLayer('https://{s}.tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png?apikey={apikey}', {
	attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	apikey: 'db5ae1f5778a448ca662554581f283c5',
	maxZoom: 22
});

//---------------------------Init Map ----------------------------------------


macarte = L.map('map', {
	center: [lat, lon],
	zoom: 13,
	layers: [streets, Pharmacies] // Base layers at launch
});


var lc = L.control.locate({
	position: 'topright',
	strings: {
		//title: "Show me where I am, yo!"
	}
}).addTo(macarte);

macarte.on('baselayerchange', function(e) {
  //alert('Changed to ' + e.name);
});




var GeoLocationArrayPharma = [];
var listDistancePharma = [];

var GeoLocationArrayParcs = [];
var listDistanceParcs = [];

var GeoLocationArrayHospitals = [];
var listDistanceHospitals = [];

var GeoLocationArraySportsCenters = [];
var listDistanceSportsCenters = [];

var x = 0;


function UpdateTraj(control){
	var inputs = document.getElementsByName('leaflet-exclusive-group-layer-1');
	var isCheckedPharma = inputs[0].checked;
	var isCheckedParcs = inputs[1].checked;
	var isCheckedHospitals = inputs[2].checked;
	var isCheckedSportsCenters = inputs[3].checked;

	var listDistancePharma = [];
	var listDistanceParcs = [];
	var listDistanceHospitals = [];
	var listDistanceSportsCenters = [];

	//console.log(control.getWaypoints()[0]);

	for (i in GeoLocationArrayPharma){
			listDistancePharma.push(haversineDistance(control.getWaypoints()[0].latLng, GeoLocationArrayPharma[i], 0)); // Append all the distance data from our location
		}


		for (i in GeoLocationArrayParcs){
			listDistanceParcs.push(haversineDistance(control.getWaypoints()[0].latLng, GeoLocationArrayParcs[i], 0));
		}


		for (i in GeoLocationArrayHospitals){
			listDistanceHospitals.push(haversineDistance(control.getWaypoints()[0].latLng, GeoLocationArrayHospitals[i], 0));
		}


		for (i in GeoLocationArraySportsCenters){
			listDistanceSportsCenters.push(haversineDistance(control.getWaypoints()[0].latLng, GeoLocationArraySportsCenters[i], 0));
		}


		if(isCheckedPharma){

			control.spliceWaypoints(1, 1, {lat: GeoLocationArrayPharma[listDistancePharma.indexOf(Math.min.apply(Math, listDistancePharma))][1] , lng: GeoLocationArrayPharma[listDistancePharma.indexOf(Math.min.apply(Math, listDistancePharma))][0]});
		}

		if(isCheckedParcs){

			control.spliceWaypoints(1, 1, {lat: GeoLocationArrayParcs[listDistanceParcs.indexOf(Math.min.apply(Math, listDistanceParcs))][1] , lng: GeoLocationArrayParcs[listDistanceParcs.indexOf(Math.min.apply(Math, listDistanceParcs))][0]});

		}

		if(isCheckedHospitals){

			control.spliceWaypoints(1, 1, {lat: GeoLocationArrayHospitals[listDistanceHospitals.indexOf(Math.min.apply(Math, listDistanceHospitals))][1] , lng: GeoLocationArrayHospitals[listDistanceHospitals.indexOf(Math.min.apply(Math, listDistanceHospitals))][0]});


		}

		if(isCheckedSportsCenters){

			control.spliceWaypoints(1, 1, {lat: GeoLocationArraySportsCenters[listDistanceSportsCenters.indexOf(Math.min.apply(Math, listDistanceSportsCenters))][1] , lng: GeoLocationArraySportsCenters[listDistanceSportsCenters.indexOf(Math.min.apply(Math, listDistanceSportsCenters))][0]});

		}

	}

	function FromToDestinationCommand(path, control){
		listWordsInit = path[0].split(' ');
		listWordsDest = path[1].split(' ');

		myurlInit = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
		myurlDest = "https://api.mapbox.com/geocoding/v5/mapbox.places/";

		for(i in listWordsInit){

			myurlInit += listWordsInit[i];
			if(i < listWordsInit.length -1){

				myurlInit += "&";
			}
		}
		for(i in listWordsDest){

			myurlDest += listWordsDest[i];
			if(i < listWordsDest.length -1){

				myurlDest += "&";
			}
		}
		myurlInit += ".json?access_token=pk.eyJ1IjoibGllZG1hbiIsImEiOiJjamR3dW5zODgwNXN3MndqcmFiODdraTlvIn0.g_YeCZxrdh3vkzrsNN-Diw";
		myurlDest += ".json?access_token=pk.eyJ1IjoibGllZG1hbiIsImEiOiJjamR3dW5zODgwNXN3MndqcmFiODdraTlvIn0.g_YeCZxrdh3vkzrsNN-Diw";

		$.ajax({
			url: myurlInit,
			beforeSend: function(xhr) {
            	// xhr.setRequestHeader("Authorization", "Bearer 6QXNMEMFHNY4FJ5ELNFMP5KRW52WFXN5")
            },
            success: function(data){
        		useReturnDataAndCalc(data, control, 0); // Save the data, and calculate the route. 		
        	}

        })

		$.ajax({
			url: myurlDest,
			beforeSend: function(xhr) {
            	// xhr.setRequestHeader("Authorization", "Bearer 6QXNMEMFHNY4FJ5ELNFMP5KRW52WFXN5")
            }, 
            success: function(data){
        		useReturnDataAndCalc(data, control, 1); // Save the data, and calculate the route. 		
        	}

        })

	}

	function SetOrigin(transcript, control){
		var words = transcript.split(' ');

		myurlInit = "https://api.mapbox.com/geocoding/v5/mapbox.places/";

		for(i in words){

			myurlInit += words[i];
			if(i < words.length -1){

				myurlInit += "&";
			}


		}
		myurlInit += ".json?access_token=pk.eyJ1IjoibGllZG1hbiIsImEiOiJjamR3dW5zODgwNXN3MndqcmFiODdraTlvIn0.g_YeCZxrdh3vkzrsNN-Diw";

		$.ajax({
			url: myurlInit,
			beforeSend: function(xhr) {
            	// xhr.setRequestHeader("Authorization", "Bearer 6QXNMEMFHNY4FJ5ELNFMP5KRW52WFXN5")
            }, 
            success: function(data){
        		useReturnDataAndCalc(data, control, 0); // Save the data, and calculate the route. 		
        	}

        })


	} 

	function SetDestination(transcript, control){
		if(transcript.includes("direction")){

			var words = transcript.split(' ');

			myurlDest = "https://api.mapbox.com/geocoding/v5/mapbox.places/";

			for(i in words){

				myurlDest += words[i];
				if(i < words.length -1){

					myurlDest += "&";
				}


			}
			myurlDest += ".json?access_token=pk.eyJ1IjoibGllZG1hbiIsImEiOiJjamR3dW5zODgwNXN3MndqcmFiODdraTlvIn0.g_YeCZxrdh3vkzrsNN-Diw";

			$.ajax({
				url: myurlDest,
				beforeSend: function(xhr) {
            		// xhr.setRequestHeader("Authorization", "Bearer 6QXNMEMFHNY4FJ5ELNFMP5KRW52WFXN5")
            	}, 
            	success: function(data){
        			useReturnDataAndCalc(data, control, 1); // Save the data, and calculate the route. 		
        		}

        	})
		}


	}



	function AllVoicesCommands(control){

		if(event.keyCode == 32) {
			if ('webkitSpeechRecognition' in window) {
				var recognition = new webkitSpeechRecognition();
				var text = '';

					recognition.lang = "fr-FR"; // French language, better for french streets
					recognition.continuous = false;
					recognition.interimResults = true;

					recognition.start();
					$('#result').text();
					//$('#btn').removeClass('btn-primary').html('Enregistrement en cours...');

					$('#h1').hide();
					recognition.onresult = function (event) {
						$('#result').text('');
						for (var i = event.resultIndex; i < event.results.length; ++i) {
							if (event.results[i].isFinal) { // If the user stop talking --> End the recognition
								recognition.stop();
								var transcript = event.results[i][0].transcript;
								$('#result').text(transcript);
								
								var path = transcript.split('direction');

								if(path.length >= 2){
									
									FromToDestinationCommand(path, control);
									
								}
								else{
									
									SetOrigin(transcript, control);

									SetDestination(transcript, control);
								}
							}
							else{
								$('#result').text($('#result').text() + event.results[i][0].transcript);
							}
						}
					};
				}else{
					$('#btn').hide();
				}
			}

		}


		function onLocationFound(e) {

			var inputs = document.getElementsByName('leaflet-exclusive-group-layer-1');
			var isCheckedPharma = inputs[0].checked;
			var isCheckedParcs = inputs[1].checked;
			var isCheckedHospitals = inputs[2].checked;
			var isCheckedSportsCenters = inputs[3].checked;

			for (i in GeoLocationArrayPharma){
			listDistancePharma.push(haversineDistance(e.latlng, GeoLocationArrayPharma[i], 0)); // Append all the distance data from our location
		}


		for (i in GeoLocationArrayParcs){
			listDistanceParcs.push(haversineDistance(e.latlng, GeoLocationArrayParcs[i], 0));
		}


		for (i in GeoLocationArrayHospitals){
			listDistanceHospitals.push(haversineDistance(e.latlng, GeoLocationArrayHospitals[i], 0));
		}


		for (i in GeoLocationArraySportsCenters){
			listDistanceSportsCenters.push(haversineDistance(e.latlng, GeoLocationArraySportsCenters[i], 0));
		}

		if (x == 0){

			if(isCheckedPharma){
				var waypoints = [
			L.latLng(e.latlng), // Our location
			L.latLng({lat: GeoLocationArrayPharma[listDistancePharma.indexOf(Math.min.apply(Math, listDistancePharma))][1] , lng: GeoLocationArrayPharma[listDistancePharma.indexOf(Math.min.apply(Math, listDistancePharma))][0]}), // The closest step wanted
			L.latLng({lat: 48.8534 , lng: 2.3488}) // The final destination
			]

		}

		if(isCheckedParcs){
			var waypoints = [
			L.latLng(e.latlng),
			L.latLng({lat: GeoLocationArrayParcs[listDistanceParcs.indexOf(Math.min.apply(Math, listDistanceParcs))][1] , lng: GeoLocationArrayParcs[listDistanceParcs.indexOf(Math.min.apply(Math, listDistanceParcs))][0]}),
			L.latLng({lat: 48.8534 , lng: 2.3488})
			]

		}

		if(isCheckedHospitals){
			var waypoints = [
			L.latLng(e.latlng),
			L.latLng({lat: GeoLocationArrayHospitals[listDistanceHospitals.indexOf(Math.min.apply(Math, listDistanceHospitals))][1] , lng: GeoLocationArrayHospitals[listDistanceHospitals.indexOf(Math.min.apply(Math, listDistanceHospitals))][0]}),
			L.latLng({lat: 48.8534 , lng: 2.3488})
			]

		}

		if(isCheckedSportsCenters){
			var waypoints = [
			L.latLng(e.latlng),
			L.latLng({lat: GeoLocationArraySportsCenters[listDistanceSportsCenters.indexOf(Math.min.apply(Math, listDistanceSportsCenters))][1] , lng: GeoLocationArraySportsCenters[listDistanceSportsCenters.indexOf(Math.min.apply(Math, listDistanceSportsCenters))][0]}),
			L.latLng({lat: 48.8534 , lng: 2.3488})
			]

		}

		var control = L.Routing.control({ // Routing Controls
			router: L.routing.mapbox('pk.eyJ1IjoibGllZG1hbiIsImEiOiJjamR3dW5zODgwNXN3MndqcmFiODdraTlvIn0.g_YeCZxrdh3vkzrsNN-Diw'), // API key of MapBox
			waypoints: waypoints,
			routeWhileDragging: true,
			showAlternatives: true,
			//geocoder: L.Control.Geocoder.nominatim(),
			geocoder: L.Control.Geocoder.mapbox('pk.eyJ1IjoibGllZG1hbiIsImEiOiJjamR3dW5zODgwNXN3MndqcmFiODdraTlvIn0.g_YeCZxrdh3vkzrsNN-Diw'),
			altLineOptions: {
				styles: [
				{ color: 'black', opacity: 0.15, weight: 9 },
				{ color: 'white', opacity: 0.8, weight: 6 },
				{ color: 'blue', opacity: 0.5, weight: 2 }
				]
			}


		}).addTo(macarte).on('waypointschanged', function (e) {
    //console.log(e);
});
		x = 1;

		$("[name='leaflet-exclusive-group-layer-1']").change( function () {
        //alert('Layers selected: ' + $(this).parent().text());
        UpdateTraj(control);

    });

    	macarte.on('mouseup', function(e) { //If drag start position
    		//UpdateTraj(control); // Permit to set a update the step depending on the start

    	});

    	document.addEventListener('keydown', function(event) {
				//console.log(event.keyCode);
				AllVoicesCommands(control);
				
			});

		macarte.on('click', function(e) { // Create button when user click on the map 
			UpdateTraj(control); 
			var container = L.DomUtil.create('div'),
			startBtn = createButton('Start from this location', container), 
			destBtn = createButton('Go to this location', container);
			SpeechBtnInit = createButton('Speech Start', container);
			SpeechBtnDest = createButton('Speech Destination', container);
			SpeechBtnComplet = createButton('Speech Complete Route', container);
			

			L.popup()
			.setContent(container)
			.setLatLng(e.latlng)
			.openOn(macarte);



			L.DomEvent.on(startBtn, 'click', function() {

				control.spliceWaypoints(0, 1, e.latlng);
				macarte.closePopup();
				UpdateTraj(control); 
			});



			L.DomEvent.on(destBtn, 'click', function() {
				control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);
				macarte.closePopup();
				UpdateTraj(control); 
			});



			L.DomEvent.on(SpeechBtnComplet, 'click', function() {

				if ('webkitSpeechRecognition' in window) {
					var recognition = new webkitSpeechRecognition();
					var text = '';

					recognition.lang = "fr-FR"; // French language, better for french streets
					recognition.continuous = false;
					recognition.interimResults = true;

					recognition.start();
					$('#result').text();
					//$('#btn').removeClass('btn-primary').html('Enregistrement en cours...');

					$('#h1').hide();
					recognition.onresult = function (event) {
						$('#result').text('');
						for (var i = event.resultIndex; i < event.results.length; ++i) {
							if (event.results[i].isFinal) { // If the user stop talking --> End the recognition
								recognition.stop();
								var transcript = event.results[i][0].transcript;
								$('#result').text(transcript);
								
								var path = transcript.split('direction');
								if(path.length < 2){
									alert('Demande non reconnu :(');
									return false;
								}


								FromToDestinationCommand(path, control);

							}
							else{
								$('#result').text($('#result').text() + event.results[i][0].transcript);
							}
						}
					};
				}else{
					$('#btn').hide();
				}
			});






			L.DomEvent.on(SpeechBtnDest, 'click', function() {

				if ('webkitSpeechRecognition' in window) {
					var recognition = new webkitSpeechRecognition();
					var text = '';

					recognition.lang = "fr-FR"; // French language, better for french streets
					recognition.continuous = false;
					recognition.interimResults = true;

					recognition.start();
					$('#result').text();
					//$('#btn').removeClass('btn-primary').html('Enregistrement en cours...');

					$('#h1').hide();
					recognition.onresult = function (event) {
						$('#result').text('');
						for (var i = event.resultIndex; i < event.results.length; ++i) {
							if (event.results[i].isFinal) { // If the user stop talking --> End the recognition
								recognition.stop();
								var transcript = event.results[i][0].transcript;
								var words = transcript.split(' ');
								$('#result').text(transcript);
								
								SetDestination(transcript, control);

							}
							else{
								$('#result').text($('#result').text() + event.results[i][0].transcript);
							}
						}
					};
				}else{
					$('#btn').hide();
				}
			});




			L.DomEvent.on(SpeechBtnInit, 'click', function() {

				if ('webkitSpeechRecognition' in window) {
					var recognition = new webkitSpeechRecognition();
					var text = '';

					recognition.lang = "fr-FR";
					recognition.continuous = false;
					recognition.interimResults = true;

					recognition.start();
					$('#result').text();
					//$('#btn').removeClass('btn-primary').html('Enregistrement en cours...');

					$('#h1').hide();
					recognition.onresult = function (event) {
						$('#result').text('');
						for (var i = event.resultIndex; i < event.results.length; ++i) {
							if (event.results[i].isFinal) {
								recognition.stop();
								var transcript = event.results[i][0].transcript;
								var words = transcript.split(' ');
								//$('#btn').addClass('btn-primary').html('Démarrer l\'enregistrement');
								$('#result').text(transcript);
								
								SetOrigin(transcript, control);

							}
							else{
								$('#result').text($('#result').text() + event.results[i][0].transcript);
							}
						}
					};
				}else{
					$('#btn').hide();
				}

			});

		});

}
}

function useReturnDataAndCalc(data, control, Dest){
	RetrievedData = data;
    //console.log(RetrievedData);
    if(Dest == 1){ // If it was the destination
    	control.spliceWaypoints(control.getWaypoints().length - 1, 1, {lat : RetrievedData.features[0].center[1], lng : RetrievedData.features[0].center[0]});
    	UpdateTraj(control);
    }
    if(Dest == 0){
    	control.spliceWaypoints(0, 1, {lat : RetrievedData.features[0].center[1], lng : RetrievedData.features[0].center[0]});
    	UpdateTraj(control);
    }

};

macarte.on('locationfound', onLocationFound);

function createButton(label, container) {
	var btn = L.DomUtil.create('button', '', container);
	btn.setAttribute('type', 'button');
	btn.innerHTML = label;
	return btn;
}


var baseLayers = {

	"Detailed" : init,
	"Grayscale": grayscale,
	"Streets": streets,
	"Imagery" : WorldImagery,
	"DarkScale" : CartoDB_DarkMatter,
	"Transport_Dark" : Thunderforest_TransportDark
};

var overlays = {
	"Pharmacies": Pharmacies,
	"Parcs" : Parcs,
	"Hospitals" : Hopitaux,
	"Sports Centers" : CentresSportifs,

};

var groupedOverlays = {
	"Filtres":{
		"Pharmacies": Pharmacies,
		"Parcs" : Parcs,
		"Hospitals" : Hopitaux,
		"Sports Centers" : CentresSportifs,

	}

};


var options = {
	exclusiveGroups: ["Filtres", "Mode"],
      // Show a checkbox next to non-exclusive group labels for toggling all
      groupCheckboxes: true
  };


  if(overlapGraph == 1){
  	var controllayers = L.control.layers(baseLayers, overlays).addTo(macarte); // Multiple Selectbox
  	//console.log(controllayers.getOverlays());
  }
  else{

  	var layerControl = L.control.groupedLayers(baseLayers, groupedOverlays, options); // RadioInput
  	macarte.addControl(layerControl);

  }


  function haversineDistance(coords1, coords2, isMiles) { // Calculate distance using coordonates
  	function toRad(x) {
  		return x * Math.PI / 180;
  	}

  	var lon1 = coords1.lng;
  	var lat1 = coords1.lat;
  	var lon2 = coords2[0];
  	var lat2 = coords2[1];

  var R = 6371; // km

  var x1 = lat2 - lat1;
  var dLat = toRad(x1);
  var x2 = lon2 - lon1;
  var dLon = toRad(x2)
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
  Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  if(isMiles){
  	d /= 1.60934;
  }

  return d;
}  



for (pharmacie in pharmaciesData) {

	GeoLocationArrayPharma.push([pharmaciesData[pharmacie].fields.lng, pharmaciesData[pharmacie].fields.lat]); // Add the location to the list


	var circle = L.circle([pharmaciesData[pharmacie].fields.lat, pharmaciesData[pharmacie].fields.lng], {
		color: '#8073ac',
		fillColor: '#8073ac',
		fillOpacity: 0.5,
		radius: 10
	}).bindPopup("Nom de le pharmacie : " + pharmaciesData[pharmacie].fields.rs + " Adresse : " + pharmaciesData[pharmacie].fields.numvoie + " " + pharmaciesData[pharmacie].fields.typvoie + " " + pharmaciesData[pharmacie].fields.voie + " Telephone : 0" + pharmaciesData[pharmacie].fields.telephone ).addTo(Pharmacies);

}

for (Parc in ParcsData){

	GeoLocationArrayParcs.push([ParcsData[Parc].fields.geom_x_y[1], ParcsData[Parc].fields.geom_x_y[0]]);

	var circle = L.circle([ParcsData[Parc].fields.geom_x_y[0], ParcsData[Parc].fields.geom_x_y[1]], {
		color: '#32CD32',
		fillColor: '#32CD32',
		fillOpacity: 0.5,
		radius: 10
	}).bindPopup(ParcsData[Parc].fields.nom_ev).addTo(Parcs);

}

for (Hopital in HopitauxData){

	GeoLocationArrayHospitals.push([HopitauxData[Hopital].fields.wgs84[1], HopitauxData[Hopital].fields.wgs84[0]]);

	var circle = L.circle([HopitauxData[Hopital].fields.wgs84[0], HopitauxData[Hopital].fields.wgs84[1]], {
		color: '#F00',
		fillColor: '#F00',
		fillOpacity: 0.5,
		radius: 10
	}).bindPopup("Adresse : " + HopitauxData[Hopital].fields.adresse_complete + " Telephone : " + HopitauxData[Hopital].fields.num_tel).addTo(Hopitaux);

}

for (CentresSportif in CentresSportifsData){

	GeoLocationArraySportsCenters.push([CentresSportifsData[CentresSportif].fields.geo_point_2d[1], CentresSportifsData[CentresSportif].fields.geo_point_2d[0]]);

	var circle = L.circle([CentresSportifsData[CentresSportif].fields.geo_point_2d[0], CentresSportifsData[CentresSportif].fields.geo_point_2d[1]], {
		color: '#F00',
		fillColor: '#F00',
		fillOpacity: 0.5,
		radius: 10
	}).bindPopup("Type : " + CentresSportifsData[CentresSportif].fields.eqt_type ).addTo(CentresSportifs);
}




/*
    function locate() {
    x = 0;
     macarte.locate({setView: true, maxZoom: 16});
    }

    // call locate every 3 seconds... forever
    setInterval(locate, 3000);

    */



//---------------- Affichage du titre de la carte ------------------------------
/*

var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
	this._div.innerHTML = '<h4>Java Project</h4>' ;
    };

    info.addTo(macarte);     
    */

//---------------------Affichage Legende ----------------------------------
/*
function getColor(d) {
	return  d > 100  ? '#b35806' :
	d > 65   ? '#b35806' :
	d > 35   ? '#fdb863' :
	'#8073ac';
}

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend'),
	grades = [0, 35, 65, 100],
	labels = [];

        div.innerHTML += "Scores des territoires :" + "</br>";

        for (var i = 0; i < grades.length-1; i++) {
        	div.innerHTML +=
        	'</br>'+
        	'<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
        	grades[i] + ' - ' + (grades[i + 1] + '</br>');
        }

        return div;
    };

legend.addTo(macarte);
*/

}

