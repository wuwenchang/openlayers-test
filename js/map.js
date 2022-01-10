$(document).ready(function () {
    $("#bemax").click(function () {
        if ($("#bemax").hasClass("max")) {
            $("#bemax").find("img").attr("src", "../imgs/bmix.png");
            $("#bemax").removeClass("max").addClass("mix");
            $(".tree", parent.document).hide();
            $(".left", parent.document).hide();
            $("#legend").css("left", "10px");
            $("#bemax").css("top", "60px");
            $("#showct").css("top", "60px");
        }
        else {
            $("#bemax").find("img").attr("src", "../imgs/bmax.png");
            $("#bemax").removeClass("mix").addClass("max");
            $(".tree", parent.document).show();
            $(".left", parent.document).show();
            $("#legend").css("left", "210px");
            $("#bemax").css("top", "100px");
            $("#showct").css("top", "100px");
        }
    });
    $("#sendmessage").click(function () {
        var dv = $("<div></div>");
        dv.append("<label>发布方式</label><div id=\"sendmod\"></div><label><input id=\"vmsall\" type=\"checkbox\" value=\"all\" />交通诱导屏(VMS)</label><div id=\"vmslist\"></div>");
        dv.append("<div class=\"btns\"><a  onclick=\"sendmessage();\"><img src=\"../imgs/l8.png\">确认</a><a onclick=\"closesend();\"><img src=\"../imgs/l9.png\">取消</a></div>");
        layer.open({
            type: 1,
            title: '<img src="../imgs/s3.png">发布消息',
            skin: 'sendbox', //样式类名
            area: ['400px', '300px'], //宽高
            anim: 2,
            content: "<div class=\"boxbody\">" + dv.html() + "</div>"
        });
        $("#sendmod").append("<span><input type=\"checkbox\" value=\"1\" />Web网站</span>");
        $("#sendmod").append("<span><input type=\"checkbox\" value=\"2\" />手机App</span>");
        $("#sendmod").append("<span><input type=\"checkbox\" value=\"3\" />交通诱导屏(VMS)</span>");
        $("#sendmod").append("<span><input type=\"checkbox\" value=\"4\" />交通广播</span>");
        GetChild("sendmessage_vms", "id|name", "vmslist", "checkbox");
        $("#vmsall").click(function () {
            if ($(this).prop("checked")) {
                $("#vmslist").find("input").prop("checked", true);
            }
            else {
                $("#vmslist").find("input").prop("checked", false);
            }
        });
    });
    $("#pointcenter", parent.document).change(function () {
        pointCenter($(this).val());
    });
     //关闭浮动窗口
    $("#popup-closer").click(function () {
        $("#popup-closer").blur();
        var processDetail = $('#processDetail')
        if (processDetail && processDetail.length && !processDetail[0].className.includes('hide')) {
            processDetail.addClass('hide')
            $('#driverMessage').show()
            $('#accidentMessage').hide()
            return
        }
        window.isShowPopup = ''
        document.getElementById("popup").style.display = "none";
    });
});
function showChart(type) {
    if ($("#showct").hasClass("show")) {
        $("#showct").find("img").attr("src", "../imgs/close.png");
        $("#showct").css("background-color", "rgba(19,35,66,0.8)");
        $("#showct").removeClass("show");
        $("#showct").after("<div id=\"chartdiv\" class=\"chartdiv\"></div>");
        if ($("#showct").css("top") == "60px")
            $("#chartdiv").removeClass("chartdiv").addClass("chartdiv1");
        $("#chartdiv").append("<iframe src=\"charts" + type + ".html\" scrolling=\"no\" frameborder=\"0\"></iframe>");
        if (type == 2 || type == 9)
            $("#chartdiv").css("width", "60%");
        $("#showct").css("right", $("#chartdiv").css("width"));
    }
    else {
        $("#showct").find("img").attr("src", "../imgs/chart.png");
        $("#showct").css("background-color", "#162d5a");
        $("#showct").addClass("show");
        $("#chartdiv").remove();
        $("#showct").css("right", "50px");
    }
}
function closesend() {
    layer.close($(".sendbox").attr("times"));
}
function sendmessage() {
    var valuestr = "accident_id,"+$("#sendid").val()+",";
    var sendstr = "";
    $("#sendmod input").each(function () {
        if ($(this).prop("checked"))
            sendstr += $(this).val() + "^";
    });
    var vmsstr = "";
    if ($("#sendmod input[value=3]").prop("checked")) {
        $("#vmslist input").each(function () {
            if ($(this).prop("checked"))
                vmsstr += $(this).val() + "^";
        });
        
    }
    if (sendstr != "") sendstr = sendstr.substring(0, sendstr.length - 1);
    if (vmsstr != "") vmsstr = vmsstr.substring(0, vmsstr.length - 1);
    valuestr += "noticeid,|" + sendstr + "|,";
    valuestr += "vmsid,|" + vmsstr + "|,addtime,now()";
    var iiload = layer.load(1, false);
    $.ajax({
        type: "POST",  //访问WebService使用post方式请求
        contentType: "application/json; charset=utf-8",
        url: getRootPath() + "/Service/MyWebService.asmx/EditTable", //调用WebService的地址和方法名称组合
        data: "{tableName:'sendmessage',valueSql:'" + valuestr+"',whereSql:''}",
        dataType: "json",
        success: function (result) {
            var myjson = result.d;
            var jsondatas = eval("(" + myjson + ")");
            if (jsondatas.CODE > 0) {
                layer.msg(jsondatas.MSG, { icon: 1 });
                setTimeout(function () { closesend(); }, 1000);
            }
            else {
                console.log(jsondatas.MSG, { icon: 2 });
            }
        },
        error: function () {
            console.log("系统错误", { icon: 2 })
        },
        complete: function () {
            layer.close(iiload);
        }
    });
}
var activemap;
function pointCenter(type) {
    var center1;
    var zoomratio;
    if (type == 1) {
        center1 = [116.3979623665342, 39.90821160713588];
        zoomratio = 11;
    }
    else if (type == 2) {
        center1 = [115.97833906354555, 40.45846368960119];
        zoomratio = 12;
    }
    else if (type == 3) {
        center1 = [115.36735926739061, 40.940091602115416];
        zoomratio = 12;
    }
    activemap.getView().setCenter(ol.proj.transform(center1, 'EPSG:4326', 'EPSG:3857'));
    activemap.getView().setZoom(zoomratio);
}

