function earthDistance = getDistance(lat1, lng1, lat2, lng2)
    earthDistance = distance(lat1, lng1, lat2, lng2) / 180 * pi * 6371004;
end
