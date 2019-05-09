<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>Insert title here</title>
</head>
<body>
<%! private int numEntries = 10; 
    private int randomInt(int range) {
    return(1 + ((int)(Math.random() * range)));
    } %>
 
<h1>A random list from 1 to 100:</h1>
<ul>
<% for(int i=0; i<numEntries; i++) {
out.println("<li>" + randomInt(100));
} %>
</ul>
</body>
</html>