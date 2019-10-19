# Safe Map

## Abstract

### Analysis & Mask Generation

MATLAB code analyzing the dataset and generating the mask.

### Navigation

Metro.js is for adding waypoints and calling Google Maps API to provide new route.

THRESHOLD and WAYMAX are set as global variables, with browsers' integrated debugging tools these values can be changed.

map.jsp is for interactions, specifically for setting start and end and showing the result of navigation.

## Guide

### Analysis & Mask Generation

1. Run ReseauTraffic2Station.m to convert original JSON to mat
2. Run Analyse.m to analyse the original data
3. Run TrafficMask.m to generate the mask

### Navigation (For Windows)

1. Install JDK 13 - https://www.oracle.com/technetwork/java/javase/downloads/jdk13-downloads-5672538.html

2. Install Eclipse - https://www.eclipse.org/downloads/download.php?file=/oomph/epp/2019-09/R/eclipse-inst-win64.exe

3. Install Tomcat 9 - https://www-eu.apache.org/dist/tomcat/tomcat-9/v9.0.27/bin/apache-tomcat-9.0.27-windows-x64.zip

4. Eclipse - Create a Dynamic Web Project with Apache Tomcat v9.0 as Target Runtime

5. Copy /src and /WebContent to the project folder

6. Eclipse - Refresh the Project

7. Eclipse - Create a new server - Tomcat v9.0 Server - Next - Configure the project on the server - Finish

8. Eclipse - Servers - Modify the server ports if necessary

9. Eclipse - Run [ProjectName]/WebContent/map.jsp using the Tomcat v9.0 Server at localhost

10. Chrome (or another browser) - http://localhost:[PortNumber]/[ProjectName]/map.jsp (e.g. http://localhost:8086/Navigation/map.jsp)

11. Chrome (or another browser) - F12 to use developer tools - Console

    Input THRESHOLD = [0-1] (e.g. THRESHOLD = 0.618) to specify the threshold used.

    Input WAYMAX = [1-INF] (e.g. WAYMAX = 10) to specify the maximum number of waypoints.

12. Chrome (or another browser) - Upper Right

    Source - Input where to start with auto complete (e.g. Notre-Dame-de-Lorette) 

    Destination - Input where to end with auto complete (e.g. Cité de la musique)

    The ideal route will be produced.