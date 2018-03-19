$(window).bind('resize', widthChange);
function widthChange() {
    var w = $(window).innerWidth();
    if (w < 600) {
        $(".icon").show();
        if (!($("#myNavbar").hasClass("responsive"))) {
            $("a.big-only").hide();
        }
    } else {
        if ($("#myNavbar").hasClass("responsive")) {
            $("#myNavbar").removeClass("responsive");
        }
        $("a.big-only").show();
        $(".icon").hide();
    }
}

function clicked() {
    if ($("#myNavbar").hasClass("responsive")) {
        $("#myNavbar").removeClass("responsive");
        $("a.big-only").hide();
    } else {
        $("#myNavbar").addClass("responsive");
        $("a.big-only").show();
    }
}
