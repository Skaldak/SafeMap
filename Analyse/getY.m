function y = getY(latitude, longitude)
    load('latlngAnalyses.mat', 'LatLng');
    y = round(getDistance(latitude, longitude, LatLng.lat.min, longitude) / 100) + 1;
end
