<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"
	import="cookie.Manage, java.util.Set, java.util.HashSet, java.io.PrintWriter"%>
<!DOCTYPE html>
<html>

<head>
<meta charset="ISO-8859-1">
<link rel="stylesheet" type="text/css" href="style.css">
<script type="text/javascript" src="jquery-3.3.1.js"></script>
<title>Books</title>
</head>

<body>
	<%
		int SearchLength = 0;
		boolean Authentic = false;
		Set<String> SearchResult = null;
		Cookie cAuthentic = Manage.getCookie(request, "Authentic");

		if (request.getAttribute("SearchResult") != null)
			SearchResult = (HashSet<String>) request.getAttribute("SearchResult");
		if (null == cAuthentic)
			Authentic = false;
		else {
			Authentic = cAuthentic.getValue().equals("true");
		}
	%>

	<h1 id="ResultHead">
		<%
			if (SearchResult != null) {
				SearchLength=SearchResult.size();
				out.print(SearchLength);
				if (SearchLength > 1)
					out.print(" books found!");
				else
					out.print(" book found!");
			}
		%>
	</h1>

	<form id="LogOut" name="LogOut" method="GET" action="AuthServlet">
		<fieldset>
			<legend>Log Out</legend>
			<p>
				<input type="submit" id="LogoutButton" value="Logout" />
			</p>
		</fieldset>
	</form>

	<form id="BookReserve" name="BookReserve" method="POST"
		action="ResServlet">
		<%
			if (SearchResult != null) {
				for (String book : SearchResult) {
					out.println(
							"<p><label><input id=\"ReserveBookname\" name=\"ReserveBookname\" type=\"checkbox\" style=\"width:20px;\" value=\""
									+ book + "\" />" + book + "</label></p>");
				}
			}
		%>
		<p>
			<input type="submit" id="ReserveButton" value="Reserve"
				style="width: 400px;" />
		</p>
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

<script type="text/javascript">
	$(document).ready(function() {
		var SearchResult = "<%=SearchResult%>";
		var SearchLength = "<%=SearchLength%>";
		var Authentic = "<%=Authentic%>";

		if (SearchResult == "null") {
				$("#ResultHead").hide();
				$("#LogOut").hide();
				$("#BookReserve").hide();
			} else if (SearchLength == 0) {
				$("#BookReserve").hide();
			} else if (Authentic == "false") {
				$("#LogOut").hide();
			}
	})
</script>

</html>