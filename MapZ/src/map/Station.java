package map;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class Station {
    public boolean Hub;
    public String Commune;
    public String Name;
    public String Type;
    public String Number;
    public int PostCode;
    public double Latitude;
    public double Longitude;
    public Set<String> Line;
    public List<List<Integer>> Route;

    public Station() {
        Line = new HashSet<>();
        Route = new ArrayList<>();
    }
}
