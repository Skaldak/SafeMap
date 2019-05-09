close all;
clear;
clc;

load('station.mat');

minAdjacent = nan(length(Station), 1);

for stationCount = 1:length(Station)
    adjacent = nan(length(Station), 1);

    for distanceCount = 1:length(Station)

        if (Station(stationCount).latitude ~= Station(distanceCount).latitude || ...
                Station(stationCount).longitude ~= Station(distanceCount).longitude)
            adjacent(distanceCount) = distance([Station(stationCount).latitude, Station(stationCount).longitude], ...
                [Station(distanceCount).latitude, Station(distanceCount).longitude]);
        end

    end

    minAdjacent(stationCount) = min(adjacent) / 180 * pi * 6371004;
end

maxAdjacent = max(minAdjacent);
minAdjacent = min(minAdjacent);
minLatitude = min([Station.latitude]);
maxLatitude = max([Station.latitude]);
minLongitude = min([Station.longitude]);
maxLongitude = max([Station.longitude]);
xUpperBound = getDistance(maxLatitude, minLongitude, maxLatitude, maxLongitude);
xLowerBound = getDistance(minLatitude, minLongitude, minLatitude, maxLongitude);
yLeftBound = getDistance(minLatitude, minLongitude, maxLatitude, minLongitude);
yRightBound = getDistance(minLatitude, maxLongitude, maxLatitude, maxLongitude);

Adjacent = struct('min', minAdjacent, 'max', maxAdjacent);
LatLng = struct('lat', {struct('min', minLatitude, 'max', maxLatitude)}, 'lng', {struct('min', minLongitude, 'max', maxLongitude)});
Bound = struct('x', [xUpperBound xLowerBound], 'y', [yLeftBound yRightBound]);

save('adjacentAnalyses.mat', 'Adjacent');
save('latlngAnalyses.mat', 'LatLng');
save('boundAnalyses.mat', 'Bound');
