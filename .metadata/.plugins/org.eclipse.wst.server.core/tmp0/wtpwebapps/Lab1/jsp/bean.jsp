<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="ISO-8859-1">
<title>FormBean</title>
</head>
<body>
<jsp:useBean id="person" scope="application" class="bean.Person"/>
<jsp:setProperty name="person" property="firstName" value="<%=request.getParameter(\"FirstName\") %>"/>
<jsp:setProperty name="person" property="lastName" value="<%=request.getParameter(\"LastName\") %>"/>
<jsp:setProperty name="person" property="birthDay" value="<%=request.getParameter(\"BirthDate\") %>"/>
<jsp:setProperty name="person" property="sex" value="<%=request.getParameter(\"Sex\") %>"/>
<p>First Name = <jsp:getProperty property="firstName" name="person"/></p>
<p>Last Name = <jsp:getProperty property="lastName" name="person"/></p>
<p>Birth Date = <jsp:getProperty property="birthDay" name="person"/></p>
<p>Sex = <jsp:getProperty property="sex" name="person"/></p>
</body>
</html>