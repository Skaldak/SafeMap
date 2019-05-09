// onClick() Version
// function Validate() {
//     var Login = $("#Login").val();
//     var Password = $("#Password").val();

//     $.post("../LoginCheck", { Login: Login, Password: Password }, function (response, status) {
//         if (response == 1)
//             alert("LOGIN SUCCEEDED");
//         else
//             alert("LOGIN FAILED");
//     })
// }

// click() Version
$(document).ready(function () {
    $("#LoginButton").click(function (e) {
        e.preventDefault();

        var Login = $("#Login").val();
        var Password = $("#Password").val();

        $.post("../LoginCheck", { Login: Login, Password: Password }, function (response) {
            if (response == 1)
                alert("LOGIN SUCCEEDED");
            else if (response == -1)
                $("#Password").val("PASSWORD ERROR!");
            else
                $("#Login").val("ID ERROR!");
        })
    })
})