package map;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Route {
    public String Direction;
    public String Type;
    public String Line;
    public List<String> Arret;
    public Map<String, List<String>> Intersection;

    public Route() {
        Arret = new ArrayList<>();
        Intersection = new HashMap<>();
    }
}