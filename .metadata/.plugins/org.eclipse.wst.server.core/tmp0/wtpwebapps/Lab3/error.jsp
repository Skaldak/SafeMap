<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1" import="cookie.Manage" import="java.net.*"%>
<!DOCTYPE html>
<html>

<head>
<meta charset="ISO-8859-1">
<link rel="stylesheet" type="text/css" href="style.css">
<title>Error</title>
</head>

<body>
	<%!boolean Authentic = false;%>
	<%
		Cookie cAuthentic = Manage.getCookie(request, "Authentic");
		if (null == cAuthentic)
			response.sendRedirect("index.jsp");
		else {
			Authentic = cAuthentic.getValue().equals("true");
			if (!Authentic)
				response.sendRedirect("index.jsp");
		}
	%>
	<h1>Error!</h1>
	
	<form id="IndexForm" name="IndexForm" method="POST"
		action="AuthServlet">
		<fieldset>
			<legend>Log In</legend>
			<p>
				<label for="Username">Username </label><input type="text"
					name="Username" id="Username" />
			</p>
			<p>
				<label for="Password">Password </label><input type="password"
					name="Password" id="Password" />
			</p>
			<p>
				<input type="submit" id="LoginButton" value="Login" />
			</p>
		</fieldset>
	</form>
</body>

</html>