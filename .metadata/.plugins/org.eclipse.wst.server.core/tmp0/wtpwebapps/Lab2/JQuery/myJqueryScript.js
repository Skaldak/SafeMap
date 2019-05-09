function f1() {
    $(function () {
        $("#myTitle").html("<i>New Title</i>");
    })
}
function f2() {
    $(function () {
        $("#div1").html("<b>New Text</b>");
    })
}
function f3() {
    $(function () {
        $("#div1").after("<b><font color=red>After 42 </font></b>");
    })
}
function f4() {
    $(function () {
        $("title").text("Brand New Title");
    })
}
function f5() {
    $(function () {
        $("#div1").toggle();
    })
}