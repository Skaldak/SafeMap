function x = getX(latitude, longitude)
    load('latlngAnalyses.mat', 'LatLng');
    x = round(getDistance(latitude, longitude, latitude, LatLng.lng.min) / 100) + 1;
end
