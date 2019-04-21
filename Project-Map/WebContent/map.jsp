<%@page import="map.Station"%>
<%@page import="jdk.jfr.StackTrace"%>
<%@page import="java.io.IOException"%>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>

<head>
<meta charset="ISO-8859-1">
<title>Safe Map</title>
<script
	src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCVIc1EU_Lxw-8Yh5Mt82rgtKCkbKb0Rbg&callback=initMap"
	async defer></script>
<script type="text/javascript"
	src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCVIc1EU_Lxw-8Yh5Mt82rgtKCkbKb0Rbg&libraries=places"></script>
<script src="jquery-3.3.1.js" type="text/javascript"></script>
<script src="Metro.js" type="text/javascript"></script>
<style>
#map {
	height: 100%;
	width: 85%;
}

html, body {
	height: 100%;
	margin: 0;
	padding: 0;
}
</style>
</head>

<body>
	<div id="map"></div>
	<div id="search">
		<form id="searchForm" method="GET">
			<fieldset>
				<p>
					<label></label>
				</p>
			</fieldset>
		</form>
	</div>
</body>
</html>