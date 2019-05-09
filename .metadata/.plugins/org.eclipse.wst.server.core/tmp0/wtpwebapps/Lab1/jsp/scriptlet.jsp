<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>TimeIP</title>
</head>
<body>
<h1>
Current Time = 
<%
java.util.Date date=new java.util.Date();
out.println(date);
%>
</h1>
<h1>
IP Address = 
<%
out.println(request.getRemoteHost());
%>
</h1>
</body>
</html>