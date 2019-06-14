function longitude = getLongitude(x, y)
    load('latlngAnalyses.mat', 'LatLng');

    SCALE = 100;
    latitude = getLatitude(x, y);
    bound = getDistance(latitude, LatLng.lng.min, latitude, LatLng.lng.max);
    longitude = (x - 1) * SCALE * (LatLng.lng.max - LatLng.lng.min) / bound + LatLng.lng.min;
end
