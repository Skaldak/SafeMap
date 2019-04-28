<%@page import="map.Station"%>
<%@page import="jdk.jfr.StackTrace"%>
<%@page import="java.io.IOException"%>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>

<head>
	<meta charset="ISO-8859-1">
	<title>MapX</title>
	<link rel="stylesheet" type="text/css" href="theme.css">
	<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCVIc1EU_Lxw-8Yh5Mt82rgtKCkbKb0Rbg&callback=initMap"
		async defer>
	</script>
	<script type="text/javascript"
		src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCVIc1EU_Lxw-8Yh5Mt82rgtKCkbKb0Rbg&libraries=places">
	</script>
	<script src="jquery-3.3.1.js" type="text/javascript"></script>
</head>

<body>
	<div id="search" class="search">
		<div id="searchContainer" class="searchContainer">
			<p>
				<input id="srcInput" class="searchInput" type="text" placeholder="Source">
			</p>
			<p>
				<input id="dstInput" class="searchInput" type="text" placeholder="Destination">
			<p>
		</div>
	</div>
	<div id="map">
		<div id="infoContent">
			<img src="" width="16" height="16" id="placeIcon">
			<span id="placeName" class="title"></span>
			<br>
			<span id="placeAddress"></span>
		</div>
	</div>
	<script src="Metro.js" type="text/javascript"></script>
</body>

</html>