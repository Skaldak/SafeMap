<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<!DOCTYPE html>
<html>

<head>
    <meta charset="ISO-8859-1">
    <link rel="stylesheet" type="text/css" href="style.css">
    <title>Index</title>
</head>

<body>
    <form id="IndexForm" name="IndexForm" method="POST" action="AuthServlet">
        <fieldset>
            <legend>Log In</legend>
            <p>
                <label for="Username">Username </label><input type="text" name="Username" id="Username" />
            </p>
            <p>
                <label for="Password">Password </label><input type="password" name="Password" id="Password" />
            </p>
            <p>
                <input type="submit" id="LoginButton" value="Login" />
            </p>
        </fieldset>
    </form>
</body>

</html>