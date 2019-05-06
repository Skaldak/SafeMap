package map;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

public class Main {
	public static void main(String[] args) throws IOException {
		double maxAdjacent = 0;
		double minLatitudeD = Double.POSITIVE_INFINITY;
		double minLongitudeD = Double.POSITIVE_INFINITY;

		Metro metro = new Metro();
		Set<Double> latitudeSet = new HashSet<>();
		Set<Double> longitudeSet = new HashSet<>();
		FileWriter fileWriter = new FileWriter(new File(System.getProperty("user.dir") + "/src/map/analyses.txt"));

		for (Station station1 : metro.stationSet) {
			double minAdjacentDistance = Double.POSITIVE_INFINITY;
			double minLatitudeDifference = Double.POSITIVE_INFINITY;
			double minLongitudeDifference = Double.POSITIVE_INFINITY;

			latitudeSet.add(station1.Latitude);
			longitudeSet.add(station1.Longitude);
			for (Station station2 : metro.stationSet) {
				if (!station1.equals(station2)) {
					double distance = Math.sqrt(Math.pow(station1.Latitude - station2.Latitude, 2)
							+ Math.pow(station1.Longitude - station2.Longitude, 2));
					double latitudeDifference = Math.abs(station1.Latitude - station2.Latitude);
					double longitudeDifference = Math.abs(station1.Longitude - station2.Longitude);
					if (distance < minAdjacentDistance)
						minAdjacentDistance = distance;
					if (latitudeDifference < minLatitudeDifference)
						minLatitudeDifference = latitudeDifference;
					if (longitudeDifference < minLongitudeDifference)
						minLongitudeDifference = longitudeDifference;
				}
			}
			if (minAdjacentDistance > maxAdjacent)
				maxAdjacent = minAdjacentDistance;
			if (minLatitudeDifference < minLatitudeD)
				minLatitudeD = minLatitudeDifference;
			if (minLongitudeDifference < minLongitudeD)
				minLongitudeD = minLongitudeDifference;
		}

		double maxLatitude = Collections.max(latitudeSet);
		double minLatitude = Collections.min(latitudeSet);
		double maxLongitude = Collections.max(longitudeSet);
		double minLongitude = Collections.min(longitudeSet);

		fileWriter.write("maxAdjacent = \n");
		fileWriter.write(String.valueOf(maxAdjacent));
		fileWriter.write("\nmaxLatitude = \n");
		fileWriter.write(String.valueOf(maxLatitude));
		fileWriter.write("\nminLatitude = \n");
		fileWriter.write(String.valueOf(minLatitude));
		fileWriter.write("\nspanLatitude = \n");
		fileWriter.write(String.valueOf((maxLatitude - minLatitude) / minLatitudeD));
		fileWriter.write("\nmaxLongitude = \n");
		fileWriter.write(String.valueOf(maxLongitude));
		fileWriter.write("\nminLongitude = \n");
		fileWriter.write(String.valueOf(minLongitude));
		fileWriter.write("\nspanLongitude = \n");
		fileWriter.write(String.valueOf((maxLongitude - minLongitude) / minLongitudeD));
		fileWriter.close();
	}
}
