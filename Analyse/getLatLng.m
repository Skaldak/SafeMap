function [latitude, longitude] = getLatLng(x, y)
    load('boundAnalyses.mat', 'Bound');
    load('latlngAnalyses.mat', 'LatLng');

    SCALE = 100;
    latitude = y * SCALE * (LatLng.lat.max - LatLng.lat.min) / Bound.y(1) + LatLng.lat.min;
    bound = getDistance(latitude, LatLng.lng.min, latitude, LatLng.lng.max);
    longitude = x * SCALE * (LatLng.lng.max - LatLng.lng.min) / bound + LatLng.lng.min;
end
