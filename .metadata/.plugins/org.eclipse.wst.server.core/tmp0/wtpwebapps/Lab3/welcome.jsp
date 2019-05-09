<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1" import="cookie.Manage, java.net.*"%>
<!DOCTYPE html>
<html>

<head>
<meta charset="ISO-8859-1">
<link rel="stylesheet" type="text/css" href="style.css">
<title>Welcome</title>
</head>

<body>
	<%
		boolean Authentic = false;
		Cookie cAuthentic = Manage.getCookie(request, "Authentic");
		if (null == cAuthentic)
			response.sendRedirect("index.jsp");
		else {
			Authentic = cAuthentic.getValue().equals("true");
			if (!Authentic)
				response.sendRedirect("index.jsp");
		}
	%>

	<h1>Welcome!</h1>
	
	<form id="LogOut" name="LogOut" method="GET" action="AuthServlet">
		<fieldset>
			<legend>Log Out</legend>
			<p>
				<input type="submit" id="LogoutButton" value="Logout" />
			</p>
		</fieldset>
	</form>
	
	<form id="BookSearch" name="BookSearch" method="POST"
		action="ResServlet">
		<fieldset>
			<legend>Book Search</legend>
			<p>
				<label for="SearchBookname">Book Name </label><input type="text"
					name="SearchBookname" id="SearchBookname" />
			</p>
			<p>
				<input type="submit" id="SearchButton" value="Search" />
			</p>
		</fieldset>
	</form>
</body>

</html>