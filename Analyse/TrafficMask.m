close all;
clear;
clc;

addpath('jsonlab-1.5');
load('station.mat');
load('adjacentAnalyses.mat');
load('boundAnalyses.mat');
load('latlngAnalyses.mat');

%Normalize
maxTraffic = max([Station.traffic]);
minTraffic = min([Station.traffic]);
traffic = ([Station.traffic]-minTraffic) / (maxTraffic - minTraffic);
traffic(isnan(traffic)) = mean(traffic, 'omitnan');
traffic = num2cell(traffic);
[Station.traffic] = deal(traffic{:});

Bound.x = 566;
Bound.y = 395;
range = ceil(Adjacent.max / 100) / (exp(1));
sigma = [range, 0; 0, range];
Mask = zeros(Bound.y, Bound.x);
[x, y] = meshgrid(1:Bound.x, 1:Bound.y);

for stationCount = 1:length(Station)
    [stationX, stationY] = getCoordinate(Station(stationCount).latitude, Station(stationCount).longitude);
    mu = [stationY, stationX];
    traffic = Station(stationCount).traffic * mvnpdf([y(:) x(:)], mu, sigma);
    traffic = reshape(traffic, size(x));
    Mask = Mask + traffic;
end

Mask = Mask ./ max(max(Mask));
savejson('mask', Mask, 'Mask.json');
save('mask.mat', 'Mask');
surf(x, y, Mask);
