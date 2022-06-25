$(document).ready(function () {
    $("#allpage").css("height", $(window).height() + "px");
    $(".left p").click(function () {
        $(this).next().slideToggle();
        if ($(this).hasClass("open"))
            $(this).removeClass("open");
        else
            $(this).addClass("open");
    });
    $(".left a").click(function () {
        var indexa = $(this).index(".left a");
        menuclick(indexa);
    });
    $(".left a").eq(0).click();
});
function editpw() {
    var uid = getCookie("BJDA_userID");
    layer.open({
        type: 2,
        title: '修改密码',
        skin: 'editpw', //样式类名
        area: ['400px', '310px'], //宽高
        anim: 2,
        content: "zygl/editpage21_1.html?eid=" + uid
    });
}
function changePw() {
    layer.msg("密码修改成功!", { icon: 2 });
    closePw();
}
function closePw() {
    layer.close($(".editpw").attr("times"));
}
function accidentPointMap(type, id) {
    console.log(type + "," + id);
    if (type == 2 || type == 6) { //2：交通违法 6：电动车辆起火
        $("#a_5").click();
        $("#ifr2").attr("src", "dtjc/page5.html?acid=" + id);
    }
    else if (type == 4) { //城轨故障
        $("#a_7").click();
        $("#ifr4").attr("src", "dtjc/page7.html?acid=" + id);
    }
    else if (type ==5) { //公交车事故
        $("#a_6").click();
        $("#ifr3").attr("src", "dtjc/page6.html?acid=" + id);
    }
    else if (type == 3) { //铁路故障
        $("#a_8").click();
        $("#ifr5").attr("src", "dtjc/page8.html?acid=" + id);
    }
    else if (type == 7 || type == 8 || type == 9 || type == 10) {
        $("#a_9").click();
        $("#ifr6").attr("src", "dtjc/page9.html?acid=" + id);
    }
    else if (type == 1) {
        $("#a_4").click();
        $("#ifr0").attr("src", "dtjc/page4.html?acid=" + id);
    } else if (type == 11) {
        $("#a_10").click();
        $("#ifr6").attr("src", "dtjc/page10.html?acid=" + id);
    }
}
function menuclick(index) {
        if (index > 9) {
            $("#allpage").removeClass("mappage").addClass("allpage");
        } else {
            $("#allpage").removeClass("allpage").addClass("mappage");
        }
    $(".left a").removeClass("active");
    $(".left a").eq(index).addClass("active");
    $(".left p").removeClass("active");
    $(".left a").eq(index).parent().prev().addClass("active");
    if ($("#tree_" + index).length > 0) {
        $(".tree a").removeClass("active");
        $("#tree_" + index).addClass("active");
        $("#tree_" + index).click();
        $("#ifrbox iframe").hide();
        $("#ifr" + index).show();
        if ($("#ifr" + index).hasClass("mapedit")) {
            $("#allpage").removeClass("mappage").addClass("allpage");
        }
    }
    else {
        $("#ifrbox iframe").hide();
        if (index > 10 && index < 17) {
            if ($(".left a").eq(index).attr("id"))
            {
                var idex = $(".left a").eq(index).attr("id").substring(2);
                $("#ifrbox").append("<iframe src=\"sggl/page" + idex+".html\" id=\"ifr" + index + "\" frameborder=\"0\"></iframe>");
            }
            else {
                $("#ifrbox").append("<iframe src=\"sggl/page11.html?type=" + index + "\" id=\"ifr" + index + "\" frameborder=\"0\"></iframe>");
            }
        }
        else if (index < 8 ){
            var idex = $(".left a").eq(index).attr("id").substring(2);
            $("#ifrbox").append("<iframe src=\"dtjc/page" + idex + ".html\" id=\"ifr" + index + "\" frameborder=\"0\"></iframe>");
        }
        else if (index > 7 && index < 11) {
            var idex = $(".left a").eq(index).attr("id").substring(2);
            $("#ifrbox").append("<iframe src=\"zygl/page" + idex + ".html\" id=\"ifr" + index + "\" frameborder=\"0\"></iframe>");
        }
        else if (index > 16 ) {
            var idex = $(".left a").eq(index).attr("id").substring(2);
            $("#ifrbox").append("<iframe src=\"xtgl/page" + idex + ".html\" id=\"ifr" + index + "\" frameborder=\"0\"></iframe>");
        }
        $(".tree a").removeClass("active");
        var a = $("<a class=\"active\" id=\"tree_" + index + "\">" + $(".left a").eq(index).text() + "</a>");
        $(".tree").append(a);
        a.append("<span>×</span>");
        a.find("span").click(function () {
            var indexa = $(this).parent().attr("id").substring(5);
            $("#ifr" + indexa).remove();
            $(this).parent().remove();
            if ($(".tree a").eq(0).length > 0) {
                $(".tree a").eq(0).click();
            }
        });
        a.click(function () {
            var indexa = this.id.substring(5);
            if (indexa > 8) {
                $("#allpage").removeClass("mappage").addClass("allpage");
            } else {
                $("#allpage").removeClass("allpage").addClass("mappage");
            }
            $(".tree a").removeClass("active");
            $("#tree_" + indexa).addClass("active");
            $(".left a").removeClass("active");
            $(".left a").eq(indexa).addClass("active");
            $(".left p").removeClass("active");
            $(this).parent().prev().addClass("active");
            $("#ifrbox iframe").hide();
            $("#ifr" + indexa).show();
            if ($("#ifr" + index).hasClass("mapedit")) {
                $("#allpage").removeClass("mappage").addClass("allpage");
            }
        });
    }
}