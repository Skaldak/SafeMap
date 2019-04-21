package map;

import java.util.ArrayList;
import java.util.List;

public class Line {
    public String Name;
    public String Number;
    public String Color;
    public String Type;
    public List<List<String>> Arret;
    public List<List<Double>> Label;
    public boolean Show;

    public Line() {
        Arret = new ArrayList<>();
        Label = new ArrayList<>();
    }
}
