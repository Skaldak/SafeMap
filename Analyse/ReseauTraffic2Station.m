close all;
clear;
clc;

addpath('jsonlab-1.5');

Reseau = loadjson('../Data/reseau.json');
Traffic = loadjson('../Data/traffic.json');

ReseauStation = struct2cell(Reseau.stations);
StationStruct = struct('name', [], 'latitude', 0, 'longitude', 0, 'traffic', nan);
Station = repmat(StationStruct, [length(ReseauStation) 1]);

for stationCount = 1:length(ReseauStation)
    station = cell2mat(ReseauStation(stationCount));
    Station(stationCount).name = station.nom;
    Station(stationCount).latitude = str2double(station.lat);
    Station(stationCount).longitude = str2double(station.lng);
end

TrafficStation = (Traffic.traffic)';

for stationCount = 1:length(TrafficStation)
    station = cell2mat(TrafficStation(stationCount));
    station = station.fields;

    for searchCount = 1:length(Station)

        if strcmpi(station.station, Station(searchCount).name) == 1
            Station(searchCount).traffic = station.trafic;
        end

    end

end

save('station.mat', 'Station');
