function login_p() {
    var username = $("#username").val();
    
    var userpwd = $("#userpassword").val();
    
    if (username == "") {
        layer.msg("用户名不能为空！", {icon:0});
        $("#username").focus();
        return;
    }
    if (!isRegisterUserName(username)) {

        layer.msg("用户名输入格式错误！", { icon: 0 });
        $("#username").focus();
        return
    }
    if (userpwd == "") {
        layer.msg("密码不能为空！", { icon: 0 });
        $("#userpassword").focus();
        return;
    }
    //alert(getRootPath() + "/Service/MyWebService.asmx/UserLogin");
    var iiload = layer.load(1, false);
    $.ajax({
        type: "POST",  //访问WebService使用post方式请求
        contentType: "application/json; charset=utf-8",
        url: getRootPath() + "/Service/MyWebService.asmx/UserLogin", //调用WebService的地址和方法名称组合
        data: "{userName:'" + username + "',userPwd:'" + userpwd + "'}",
        dataType: "json",
        success: function (result) {
            var myjson = result.d;
            var jsondatas = eval("(" + myjson + ")");
            if (jsondatas.CODE > 0) {
                var msg = jsondatas.MSG;
                if (msg != "" && msg != null) {
                    layer.msg(msg, { icon: 2 });
                    return;
                }
                var mytbl = jsondatas.Table;
                setCookie("BJDA_userID", mytbl[0].id);
                setCookie("BJDA_userName", mytbl[0].username);
                window.location.href = "index.html";
            }
            else {
                console.log(jsondatas.MSG, { icon: 2 });
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert(XMLHttpRequest.status + "," + XMLHttpRequest.readyState + textStatus);
        },
        complete: function () {
            layer.close(iiload);
        }
    });
}

