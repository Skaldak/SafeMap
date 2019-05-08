package map;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;

public class Metro {
	public Set<Correspondence> correspondenceSet;
	public Set<Station> stationSet;
	public Set<Route> routeSet;
	public Set<Line> lineSet;

	public Metro() throws JsonProcessingException, IOException {
		initCorrespondence();
		initStation();
		initRoute();
		initLine();
	}

	public void initCorrespondence() throws JsonProcessingException, IOException {
		ObjectMapper correspondenceMapper = new ObjectMapper();
		JsonNode correspondenceNode = correspondenceMapper.readTree(new URL("http://localhost:8086/Project-Map/reseau.json")).path("corresp");
//				.readTree(new File(System.getProperty("user.dir") + "/src/map/reseau.json")).path("corresp");
		correspondenceSet = new HashSet<>();

		for (JsonNode correspondence : correspondenceNode) {
			Correspondence newCorrespondence = new Correspondence();

			for (JsonNode equivalence : correspondence) {
				newCorrespondence.Equivalence.add(equivalence.textValue());
			}

			correspondenceSet.add(newCorrespondence);
		}
	}

	public void initStation() throws JsonProcessingException, IOException {
		ObjectMapper stationMapper = new ObjectMapper();
		JsonNode stationNode = stationMapper.readTree(new URL("http://localhost:8086/Project-Map/reseau.json")).path("stations");
//											 readTree(new File(System.getProperty("user.dir") + "/src/map/reseau.json")).path("stations");
		stationSet = new HashSet<>();

		for (JsonNode station : stationNode) {
			Station newStation = new Station();

			newStation.Hub = station.path("isHub").booleanValue();
			newStation.Commune = station.path("commune").textValue();
			newStation.Name = station.path("nom").textValue();
			newStation.Type = station.path("type").textValue();
			newStation.Number = station.path("num").textValue();
			newStation.PostCode = station.path("cp").asInt();
			newStation.Latitude = station.path("lat").asDouble();
			newStation.Longitude = station.path("lng").asDouble();
			for (JsonNode line : station.path("lignes").path(newStation.Type)) {
				newStation.Line.add(line.textValue());
			}
			for (JsonNode route : station.path("routes")) {
				ArrayNode routeArray = (ArrayNode) route;
				List<Integer> routeList = new ArrayList<>();

				routeList.add(routeArray.get(0).intValue());
				routeList.add(routeArray.get(1).intValue());
				newStation.Route.add(routeList);
			}

			stationSet.add(newStation);
		}
	}

	public void initRoute() throws JsonProcessingException, IOException {
		ObjectMapper routeMapper = new ObjectMapper();
		JsonNode routeNode = routeMapper.readTree(new URL("http://localhost:8086/Project-Map/reseau.json")).path("routes");
//				readTree(new File(System.getProperty("user.dir") + "/src/map/reseau.json")).path("routes");
		routeSet = new HashSet<>();

		for (JsonNode route : routeNode) {
			Route newRoute = new Route();
			List<String> allIntersectionList = new ArrayList<>();

			newRoute.Direction = route.path("direction").textValue();
			newRoute.Type = route.path("type").textValue();
			newRoute.Line = route.path("ligne").textValue();
			for (JsonNode arret : route.path("arrets"))
				newRoute.Arret.add(arret.textValue());
			for (JsonNode intersection : route.path("intersections").path("all"))
				allIntersectionList.add(String.valueOf(intersection.intValue()));
			newRoute.Intersection.put("all", allIntersectionList);
			for (String intersection : allIntersectionList) {
				ArrayNode intersectionArray = (ArrayNode) route.path("intersections").path(intersection);
				List<String> intersectionList = new ArrayList<>();
				Iterator<JsonNode> intersectionIterator = intersectionArray.iterator();

				while (intersectionIterator.hasNext())
					intersectionList.add(intersectionIterator.next().toString());

				newRoute.Intersection.put(intersection, intersectionList);
			}

			routeSet.add(newRoute);
		}
	}

	public void initLine() throws JsonProcessingException, IOException {
		ObjectMapper lineMapper = new ObjectMapper();
		JsonNode lineNode = lineMapper.readTree(new URL("http://localhost:8086/Project-Map/reseau.json")).path("lignes");
//				.readTree(new File(System.getProperty("user.dir") + "/src/map/reseau.json")).path("lignes");
		lineSet = new HashSet<>();

		for (JsonNode line : lineNode) {
			Line newLine = new Line();

			newLine.Name = line.path("name").textValue();
			newLine.Number = line.path("num").textValue();
			newLine.Color = line.path("color").textValue();
			newLine.Type = line.path("type").textValue();
			for (JsonNode arret : line.path("arrets")) {
				ArrayNode arretArray = (ArrayNode) arret;
				List<String> arretList = new ArrayList<>();
				Iterator<JsonNode> arretIterator = arretArray.iterator();

				while (arretIterator.hasNext())
					arretList.add(arretIterator.next().toString());

				newLine.Arret.add(arretList);
			}
			for (JsonNode label : line.path("labels")) {
				ArrayNode labelArray = (ArrayNode) label;
				List<Double> labelList = new ArrayList<>();

				labelList.add(labelArray.get(0).asDouble());
				labelList.add(labelArray.get(1).asDouble());

				newLine.Label.add(labelList);
			}
			newLine.Show = line.path("show").booleanValue();

			lineSet.add(newLine);
		}
	}
}
