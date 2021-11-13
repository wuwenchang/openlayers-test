var RowsNumber = 20;//表格每页行数;
var PageNumber = 1;//当前第几页;

function GetTable(tblname, wstr) {
   // console.log(tblname + "<br/>" + wstr);
    var iiload = layer.load(1, false);
    $.ajax({
        type: "POST",  //访问WebService使用post方式请求
        cache: false,
        async: false, 
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        url: getRootPath() + "/Service/GetTable.ashx", //调用WebService的地址和方法名称组合
        data: { tableName: tblname, whereSql: wstr, pageNum: ((PageNumber - 1) * RowsNumber), rowsNum:RowsNumber },
        success: function (myjson) {
            var jsondatas = eval("(" + myjson + ")");
            if (jsondatas.CODE > 0) {
                addList(jsondatas.Table);
            }
            else {
                $("#listtable tr:not(:first)").remove();
                $("#listtag").html(jsondatas.MSG);
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
function AddTableFoot(tblcnt) {
    var foot = $("#listtag");
    var allpagenum = Math.ceil(tblcnt / RowsNumber);
    var lbmenu = "";
    foot.empty();
    foot.append("<div class=\"txt\">共<span>" + tblcnt + "</span>条记录，每页<span>" + RowsNumber + "</span>条，共<span>" + allpagenum + "</span>页,当前第<span>" + PageNumber + "</span>页</div>");
    if (allpagenum <= 5) {
        for (var pm = 1; pm <= allpagenum; pm++) {
            if (pm == PageNumber) {
                lbmenu += "<label class=\"active\" onclick=\"pageChange(" + pm + ")\">" + pm + "</label>";
            }
            else {
                lbmenu += "<label  onclick=\"pageChange(" + pm + ")\">" + pm + "</label>";
            }
        }
        foot.append(" <div class=\"nums\">" + lbmenu + "</div>");
    }
    else {
        var firstnum = 1;
        if (PageNumber > 5) {
            firstnum = (allpagenum - PageNumber) > 4 ? PageNumber : (allpagenum - 4)
        }
        lbmenu += "<label  class=\"sw\" onclick=\"pageChange(1)\">首页</label>";
        lbmenu += "<label class=\"sw\" onclick=\"pageChange(" + (PageNumber > 1 ? (PageNumber - 1) : 1) + ")\">◀</label>";
        if (PageNumber > 5)
            lbmenu += "<label onclick=\"pageChange(" + (PageNumber - 5) + ")\">…</label>";
        for (var pm = firstnum; pm < (firstnum + 5); pm++) {
            if (pm == PageNumber) {
                lbmenu += "<label class=\"active\" onclick=\"pageChange(" + pm + ")\">" + pm + "</label>";
            }
            else {
                lbmenu += "<label  onclick=\"pageChange(" + pm + ")\">" + pm + "</label>";
            }
        }
        if ((allpagenum - PageNumber > 5) || (allpagenum - firstnum > 5))
            lbmenu += "<label onclick=\"pageChange(" + (firstnum + 5) + ")\">…</label>";
        lbmenu += "<label class=\"sw\" onclick=\"pageChange(" + ((PageNumber + 1) < allpagenum ? (PageNumber + 1) : allpagenum) + ")\">▶</label>";
        lbmenu += "<label class=\"sw\" onclick=\"pageChange(" + allpagenum + ")\">末页</label>";
        foot.append(" <div class=\"nums\">" + lbmenu + "</div>");
    }
}


function EditTable(tblname, id) {
    var iiload = layer.load(1, false);
    $.ajax({
        type: "POST",  //访问WebService使用post方式请求
        cache: false,
        async: false,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        url: getRootPath() + "/Service/GetTable.ashx", //调用WebService的地址和方法名称组合
        data: { tableName: tblname, whereSql: "id="+id },
        success: function (myjson) {
            var jsondatas = eval("(" + myjson + ")");
            if (jsondatas.CODE > 0) {
                addData(jsondatas.Table);
                if (tblname == "traffic_jam" || tblname == "traffic_delay") {
                    $("#type").change();
                    $("#type_id").val(jsondatas.Table[0]["type_id"]);
                }
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
function SetValue(tblname, valueSql, whereSql) {
    var iiload = layer.load(1, false);
    $.ajax({
        type: "POST",  //访问WebService使用post方式请求
        contentType: "application/json; charset=utf-8",
        url: getRootPath() + "/Service/MyWebService.asmx/EditTable", //调用WebService的地址和方法名称组合
        data: "{tableName:'" + tblname + "',valueSql:'" + valueSql + "',whereSql:'" + whereSql + "'}",
        dataType: "json",
        success: function (result) {
            var myjson = result.d;
            console.log(myjson);
            var jsondatas = eval("(" + myjson + ")");
            if (jsondatas.CODE > 0) {
                layer.msg(jsondatas.MSG, { icon: 1 });
               
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
function FindStr() {
    var findstr = "";
    $("#findlist label").each(function (i, n) {
        if ($(this).find("div").hasClass("cbox")) {
            findstr += $(this).find("div").attr("id") + "=" + $(this).find("input").is(":checked").val() + ",";
        }
        else if ($(this).find("input").length > 0 && $(this).find("input").val() != "") {
            if ($(this).find("input").attr("type") == "date") {
                findstr += $(this).find("input").attr("id") + ">=|" + $(this).find("input").val().replace("T", " ") + " 00:00:00| and ";
                findstr += $(this).find("input").attr("id") + "<|" + $(this).find("input").val().replace("T", " ") + " 23:59:59| and ";
            }
            else {
                findstr += $(this).find("input").attr("id") + " like |%" + $(this).find("input").val() + "%| and ";
            }
        }
        if ($(this).find("select").length > 0 && $(this).find("select").val() != "all") {
            findstr += $(this).find("select").attr("id") + "=" + $(this).find("select").val() + " and ";
        }
    });
    return findstr;
}
function SetTable(tblname, whereSql) {
    var valuestr = "";
    var isnull = false;
    $("#edittbl tr").each(function (i, n) {
        if ($(this).find("div").hasClass("cbox")) {
            var cstr = "";
            $(this).find("input").each(function () {
                if ($(this).is(":checked"))
                    cstr += $(this).val() + "^";
            });
            if (cstr != "") {
                cstr = cstr.substring(0, cstr.length - 1);
                valuestr += $(this).find("div").attr("id") + ",|" + cstr+"|,";
            }
            else {
                valuestr += $(this).find("div").attr("id") + ",||,";
            }
        }
        else if ($(this).find("input").length > 0) {

            if ($(this).find("input").val() == "" && $(this).find("input").attr("empty") != "1") {
                layer.msg($(this).find("td").eq(0).text() + "不能为空", { icon: 2 });
                isnull = true;
                return false;
            }
            else {
                if ($(this).find("input").val() == "" || $(this).find("input").val() == null)
                    valuestr += $(this).find("input").attr("id") + ",null,";
                else {
                    if ($(this).find("input").attr("type") == "datetime-local") {
                        valuestr += $(this).find("input").attr("id") + ",|" + $(this).find("input").val().replace("T", " ") + "|,";
                    }
                    else {
                        valuestr += $(this).find("input").attr("id") + ",|" + $(this).find("input").val() + "|,";
                    }
                }
            }
        }
        if ($(this).find("select").length > 0) {
            if ($(this).find("select").val() == "") {
                layer.msg($(this).find("td").eq(0).text() + "不能为空", { icon: 2 });
                isnull = true;
                return false;
            }
            valuestr += $(this).find("select").attr("id") + "," + $(this).find("select").val() + ",";
        }
    });
    if (isnull) return;
    if (valuestr != "") {
        valuestr = valuestr.substring(0, valuestr.length - 1);
    }
    if (tblname == "sys_users") {
        valuestr += ",addtime,now()";
    }
    console.log(valuestr);
    var iiload = layer.load(1, false);
    $.ajax({
        type: "POST",  //访问WebService使用post方式请求
        contentType: "application/json; charset=utf-8",
        url: getRootPath() + "/Service/MyWebService.asmx/EditTable", //调用WebService的地址和方法名称组合
        data: "{tableName:'" + tblname + "',valueSql:'" + valuestr + "',whereSql:'" + whereSql + "'}",
        dataType: "json",
        success: function (result) {
            var myjson = result.d;
            var jsondatas = eval("(" + myjson + ")");
            if (jsondatas.CODE > 0) {
                layer.msg(jsondatas.MSG, { icon: 1 });
                setTimeout(function () { window.history.go(-1) }, 1000);
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
function addData(nowTable) {
    $("#edittbl tr").each(function (i, n) {
        if ($(this).find("div").hasClass("cbox")) {
            var cstr = nowTable[0][$(this).find("div").attr("id")];
            if (cstr != "" && cstr != null) {
                cstr = cstr.split("^");
                for (var i = 0; i < cstr.length; i++) {
                    $(this).find("input[value=" + cstr[i] + "]").prop("checked", true);
                }
            }
        }
        else {
            if ($(this).find("input").length > 0) {
                if ($(this).find("input").attr("type") == "time") {
                    if (nowTable[0][$(this).find("input").attr("id") + "str"].length == 4)
                        $("#" + $(this).find("input").attr("id")).val("0" + nowTable[0][$(this).find("input").attr("id") + "str"]);
                    else
                        $("#" + $(this).find("input").attr("id")).val(nowTable[0][$(this).find("input").attr("id") + "str"]);
                }
                else if ($(this).find("input").attr("type") == "date")
                {
                    $("#" + $(this).find("input").attr("id")).val(timeFormatSmall(nowTable[0][$(this).find("input").attr("id")]));
                }
                else if ($(this).find("input").attr("type") == "datetime-local") {
                    $("#" + $(this).find("input").attr("id")).val(timeFormat(nowTable[0][$(this).find("input").attr("id")]).replace(" ","T"));
                }
                else {
                    $("#" + $(this).find("input").attr("id")).val(nowTable[0][$(this).find("input").attr("id")]);
                }
            }
            if ($(this).find("select").length > 0) {
                $("#" + $(this).find("select").attr("id")).val(nowTable[0][$(this).find("select").attr("id")]);
            }
        }
    });
}
function DelTable(tblname, id) {
    var cfm = layer.confirm('请确定是否删除？删除后不可恢复！', { icon: 2, title: '请求确认', skin: 'layui-layer-lan' }, function (index) {
        var iiload = layer.load(1, false);
        $.ajax({
            type: "POST",  //访问WebService使用post方式请求
            contentType: "application/json; charset=utf-8",
            url: getRootPath() + "/Service/MyWebService.asmx/DelTable", //调用WebService的地址和方法名称组合
            data: "{tableName:'" + tblname + "',whereSql:'id=" + id + "'}",
            dataType: "json",
            success: function (result) {
                var myjson = result.d;
                var jsondatas = eval("(" + myjson + ")");
                if (jsondatas.CODE > 0) {
                    layer.msg(jsondatas.MSG, { icon: 1 });
                    setTimeout(function () { window.location.reload(); }, 1000);
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
        layer.close(cfm);
    });
}
var accidenttaget = {
    "1": "社会车辆",
    "2": "公交车",
    "3": "电动汽车",
    "4": "奥运小巴",
    "5": "地铁线路",
    "6": "高铁车组"
};
var transporttype = {
    "1": "公交车",
    "2": "地铁",
    "3": "高铁",
    "4": "大巴",
    "5": "私家车"
}
var carstype = {
    "1": "T1", "2":"T2", "3":"T3", "4":"分配车", "5":"TC", "6":"TG", "7":"DDS"
}
var userpower = {
    "1": "资源管理",
    "2": "动态监测",
    "3": "事故管理",
    "4": "系统管理"
};
function mapback(iid) {
    $("#allpage", parent.document).removeClass("allpage").addClass("mappage");
    $("#ifr" + iid, parent.document).removeClass("mapedit");
    window.history.go(-1);
}
function InitExcel() {
    layer.open({
        type: 1,
        title: "导入文件",
        skin: 'layui-layer-lan', //加上边框
        content: '<div style=\" padding:30px 30px;\"><input style=\"width:250px; height=30px;\" id="file_excel" type="file"><a  style=\" padding:5px 10px; background-color: #2b8dd0;  color:#fff;\" onclick=\"upExcel();\">上传</a></div>'
    });
}
function addAccident() {
    var iiload = layer.load(1, false);
    $.ajax({
        type: "POST",  //访问WebService使用post方式请求
        cache: false,
        async: false,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        url: getRootPath() + "/Service/AddAccident.ashx", //调用WebService的地址和方法名称组合
        data: { name: '', address: '', type: 1, message: '', code: '', xaxis: 1, yaxis: 1, target:1},
        success: function (myjson) {
            var jsondatas = eval("(" + myjson + ")");
            if (jsondatas.CODE > 0) {
                console.log(jsondatas.MSG);
            }
            else {
                console.log(jsondatas.MSG);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //通常情况下textStatus和errorThrown只有其中一个包含信息
            alert(XMLHttpRequest.status + "," + XMLHttpRequest.readyState + textStatus);
        },
        complete: function () {
            layer.close(iiload);
        }
    });
}