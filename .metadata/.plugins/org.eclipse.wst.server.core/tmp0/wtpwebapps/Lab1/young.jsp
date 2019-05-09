<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>Young</title>
</head>
<body>
<h1>Young</h1>
<jsp:useBean id="person" type="mvc.model.Person" scope="request"/>
<p> First Name = <jsp:getProperty name="person" property="firstName"/></p>
<p> Last Name = <jsp:getProperty name="person" property="lastName"/></p>
<p> Birth Date = <jsp:getProperty name="person" property="birthDay"/></p>
<p> Sex = <jsp:getProperty name="person" property="sex"/></p>
</body>
</html>