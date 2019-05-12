function latitude = getLatitude(x, y)
    load('boundAnalyses.mat', 'Bound');
    load('latlngAnalyses.mat', 'LatLng');

    SCALE = 100;
    latitude = y * SCALE * (LatLng.lat.max - LatLng.lat.min) / Bound.y(1) + LatLng.lat.min;
end
