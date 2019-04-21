package map;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonProcessingException;

public class Main {
	public static void main(String[] args) throws JsonProcessingException, IOException {
		Metro metro = new Metro();
		for (Station station : metro.stationSet) {
			System.out.println(station.Name);
			System.out.print(station.Latitude);
			System.out.print(" ");
			System.out.println(station.Longitude);
		}
	}
}
