<%@page import="map.Station"%>
<%@page import="jdk.jfr.StackTrace"%>
<%@page import="java.io.IOException"%>
<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>

<head>
<meta charset="ISO-8859-1">
<title>MapZ</title>
<link rel="stylesheet" type="text/css" href="theme.css">
<script
	src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDdLS6wx1Y3sRxA3q6FqzFlvMhAMtr0eHM&callback=initMap&libraries=geometry,places"
	async defer>
	
</script>
<script src="jquery-3.3.1.js" type="text/javascript"></script>
</head>

<body>
	<div id="search" class="search">
		<div id="searchContainer" class="searchContainer">
			<div>
				<p>
					<input id="srcInput" class="searchInput" type="text"
						placeholder="Source">
				</p>
			</div>
			<div>
				<p>
					<input id="dstInput" class="searchInput" type="text"
						placeholder="Destination">
				<p>
			</div>
			<div>
				<p>
					<input id="searchButton" class="searchInput" type="submit"
						value="Navigate" onclick="navigate()" />
				</p>
			</div>
		</div>
		<div id="trackbar" ><input id="range" type="range" name="points" min="1" max="1000" step="1" value="618" /></div>
	</div>
	<div id="map"></div>
	<script src="Metro.js" type="text/javascript"></script>
</body>

</html>