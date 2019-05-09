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
traffic = ([Station.traffic]-minTraffic) / (maxTraffic - minTraffic);
traffic(isnan(traffic)) = mean(traffic, 'omitnan');
traffic = num2cell(traffic);
[Station.traffic] = deal(traffic{:});

Bound.x = 566;
Bound.y = 395;
range = ceil(Adjacent.max / 100) / (exp(1));
sigma = [range, 0; 0, range];
mask = zeros(Bound.y, Bound.x);
[x, y] = meshgrid(1:Bound.x, 1:Bound.y);

for stationCount = 1:length(Station)
    [stationX, stationY] = getCoordinate(Station(stationCount).latitude, Station(stationCount).longitude);
    stationX = round(stationX);
    stationY = round(stationY);
    mu = [stationY, stationX];
    traffic = mvnpdf([x(:) y(:)], mu, sigma);
    traffic = reshape(traffic, size(x));
    mask = mask + traffic;
end
mask=mask./max(max(mask));
surf(x, y, mask);
