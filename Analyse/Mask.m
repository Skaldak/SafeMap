close all;
clear;
clc;

load('station.mat');
load('adjacentAnalyses.mat');
load('boundAnalyses.mat');
load('latlngAnalyses.mat');

%Normalize
maxTraffic = max([Station.traffic]);
minTraffic = min([Station.traffic]);
traffic = num2cell(([Station.traffic]-minTraffic) / (maxTraffic - minTraffic));
[Station.traffic] = deal(traffic{:});

Bound.x = 566;
Bound.y = 395;
range = ceil(Adjacent.max / 100);
mask = zeros(Bound.y, Bound.x);

for stationCount = 1:length(Station)
    [stationX, stationY] = getCoordinate(Station(stationCount).latitude, Station(stationCount).longitude);
    stationX = round(stationX);
    stationY = round(stationY);
    boundX = [stationX - range, stationX + range];
    boundY = [stationY - range, stationY + range];

    if boundX(1) < 1
        boundX(1) = 1;
    end

    if boundX(2) > Bound.x
        boundX(2) = Bound.x;
    end

    if boundY(1) < 1
        boundY(1) = 1;
    end

    if boundY(2) > Bound.y
        boundY(2) = Bound.y;
    end

    mask(boundY(1):boundY(2), boundX(1):boundX(2)) = mask(boundY(1):boundY(2), boundX(1):boundX(2)) + Station(stationCount).traffic;
end

[x, y] = meshgrid(1:Bound.x, 1:Bound.y);
surf(x, y, mask);
