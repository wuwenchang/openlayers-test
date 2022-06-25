var typeid = 1;
var thtr = "";
var actable;
$(document).ready(function () {
    GetChild("traffic_accident_target", "id|name|id<6", "target", "select", true);
    switch (getUrlParam("type")) {
        case "11": {
            typeid = 1;
            $("#thtr th").eq(3).html("事故对象");
            $("#thtr th").eq(4).html("事故名称");
            $("#thtr th").eq(5).html("事故车辆");
            $("#thtr th").eq(6).html("事故地点");
            $("#thtr th").eq(7).html("事故描述");
            $("#thtr th").eq(8).html("事故时间");
        }; break;
        case "12": {
            typeid = 2;
            $("#thtr th").eq(3).html("故障对象");
            $("#thtr th").eq(4).html("故障名称");
            $("#thtr th").eq(5).html("故障线路");
            $("#thtr th").eq(6).html("故障地点");
            $("#thtr th").eq(7).html("故障描述");
            $("#thtr th").eq(8).html("故障时间");
        }; break;
        case "13": {
            typeid = 3;
            $("#thtr th").eq(3).html("故障对象");
            $("#thtr th").eq(4).html("故障名称");
            $("#thtr th").eq(5).html("故障车次");
            $("#thtr th").eq(6).html("故障地点");
            $("#thtr th").eq(7).html("故障描述");
            $("#thtr th").eq(8).html("故障时间");
        }; break;
        case "14": {
            typeid = 4;
            $("#thtr th").eq(3).html("违法对象");
            $("#thtr th").eq(4).html("违法名称");
            $("#thtr th").eq(5).html("违法车辆");
            $("#thtr th").eq(6).html("违法地点");
            $("#thtr th").eq(7).html("违法描述");
            $("#thtr th").eq(8).html("违法时间");
        }; break;
        case "15": {
            typeid = 5;
            $("#thtr th").eq(3).html("事故对象");
            $("#thtr th").eq(4).html("事故名称");
            $("#thtr th").eq(5).html("事故车牌号");
            $("#thtr th").eq(6).html("事故地点");
            $("#thtr th").eq(7).html("事故描述");
            $("#thtr th").eq(8).html("事故时间");
        }; break;
        case "16": {
            typeid = 6;
            $("#thtr th").eq(3).html("事故对象");
            $("#thtr th").eq(4).html("事故名称");
            $("#thtr th").eq(5).html("起火车牌号");
            $("#thtr th").eq(6).html("起火地点");
            $("#thtr th").eq(7).html("起火描述");
            $("#thtr th").eq(8).html("起火时间");
        }; break;
        case "17": {
            typeid = 7;
            $("#thtr th").eq(3).html("比赛区域");
            $("#thtr th").eq(4).html("比赛项目");
            $("#thtr th").eq(5).html("比赛场地");
            $("#thtr th").eq(6).html("计划开始时间");
            $("#thtr th").eq(7).html("推迟时间");
            $("#thtr th").eq(8).html("发布时间");
        }; break;
        case "18": {
            typeid = 8;
            $("#thtr th").eq(3).html("比赛区域");
            $("#thtr th").eq(4).html("比赛项目");
            $("#thtr th").eq(5).html("比赛场地");
            $("#thtr th").eq(6).html("场地座位");
            $("#thtr th").eq(7).html("限流人数");
            $("#thtr th").eq(8).html("限流时间");
        }; break;
        case "19": {
            typeid = 9;
            $("#thtr th").eq(3).html("比赛区域");
            $("#thtr th").eq(4).html("比赛项目");
            $("#thtr th").eq(5).html("比赛场地");
            $("#thtr th").eq(6).html("场地座位");
            $("#thtr th").eq(7).html("拥堵人数");
            $("#thtr th").eq(8).html("拥堵时间");
        }; break;
        case "20": {
            typeid = 10;
            $("#thtr th").eq(3).html("比赛区域");
            $("#thtr th").eq(4).html("比赛项目");
            $("#thtr th").eq(5).html("比赛场地");
            $("#thtr th").eq(6).html("场地座位");
            $("#thtr th").eq(7).html("滞留人数");
            $("#thtr th").eq(8).html("滞留时间");
        }; break;
    }
    FindTable();
    $("#addbtn").click(function () {
        window.location.href = "editpage11.html?type=" + typeid;
    });
    $("#findbtn").click(FindTable);
    $("#target").change(FindTable);
});
function addList(nowTable) {
    var tblcnt = nowTable[0].cnt;
    $("#listtable tr:not(:first)").remove();
    if (nowTable != null) {
        actable = nowTable;
        $(nowTable).each(function (i, n) {
            var tr = $("<tr></tr>")
            $("#listtable").append(tr);
            tr.append("<td>" + n.id + "</td>");
            tr.append("<td>【" + n.xaxis + "," + n.yaxis + "】<img onclick=\"pointMap(" + n.type + "," + n.id + ")\"  src=\"../imgs/pt.png\" /></td>");
            tr.append("<td>" + n.name1 + "</td>");
            tr.append("<td>" + n.name2 + "</td>");
            tr.append("<td>" + n.name + "</td>");
            tr.append("<td>" + n.code + "</td>");
            tr.append("<td>" + n.address + "</td>");
            tr.append("<td>" + n.message + "</td>");
            tr.append("<td>" + timeFormat(n.addtime) + "</td>");
            tr.append("<td><a href=\"editpage11.html?type=" + n.type + "&eid=" + n.id + "\" class=\"btn2\">编辑</a><a  onclick=\"DelTable('traffic_accident'," + n.id + ")\" class=\"btn4\">删除</a></td>");
        });
    }
    AddTableFoot(tblcnt);
}
function pageChange(jpn) {
    if (PageNumber == jpn)
        return;
    PageNumber = jpn;
    FindTable();
}
function FindTable() {
    var wherestr = FindStr();
    GetTable("traffic_accident A,traffic_accident_type B,traffic_accident_target C", wherestr + " A.type=B.id and A.target=C.id and A.type=" + typeid + " order by addtime desc");
}
function pointMap(type, id) {
    window.parent.accidentPointMap(type, id);
}