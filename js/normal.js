
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
function getPageName() {
    var a = location.href;
    var b = a.split("/");
    var c = b.slice(b.length - 1, b.length).toString().split(".");
    return c.slice(0, 1);
}
function getRootPath() {
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht = curWwwPath.substring(0, pos);
    //获取带"/"的项目名，如：/uimcardprj
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    projectName = projectName.toLowerCase();
    if (curWwwPath.includes('localhost')) {
        projectName = '/grandmap/BJDA'
    } else {
        projectName = projectName.replace("/web", "");
    }
    return (localhostPaht + projectName);
}
//JS操作cookies方法!

//设置cookie
function setCookie(name, value, day) {
    var date = new Date();
    if (day != "") {
        date.setDate(date.getDate() + day);
        document.cookie = name + '=' + value + ';expires=' + date;
    }
    else {
        document.cookie = name + '=' + value;
    }

};
//获取cookie
function getCookie(name) {
    var reg = RegExp(name + '=([^;]+)');
    var arr = document.cookie.match(reg);
    if (arr) {
        return arr[1];
    } else {
        return '';
    }
};
//删除cookie
function delCookie(name) {
    setCookie(name, null, -1);
};

function trim(str) {
    return str.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '');
}
function removeArray(arr, val) {
    var index = arr.indexOf(val);
    if (index > -1) {
        arr.splice(index, 1);
    }
};
function keepTwoDecimalFull(num) {
    var result = parseFloat(num);
    if (isNaN(result)) {
        return "0.00";
    }
    result = Math.round(num * 100) / 100;
    var s_x = result.toString();
    var pos_decimal = s_x.indexOf('.');
    if (pos_decimal < 0) {
        pos_decimal = s_x.length;
        s_x += '.';
    }
    while (s_x.length <= pos_decimal + 2) {
        s_x += '0';
    }
    return s_x;
}
function checkIshanzi(s) {
    //var patrn = /^[\u2E80-\u9FFF]$/; //Unicode编码中的汉字范围  /[^\x00-\x80]/
    var patrn = /[^\x00-\x80]/;
    return patrn.test(s);
}
function checkIsName(s) {
    //var patrn = /^[\u2E80-\u9FFF]$/; //Unicode编码中的汉字范围  /[^\x00-\x80]/
    var patrn = /^[\u4E00-\u9FA5]+$/;
    return patrn.test(s);
}
function checkIsNumToNum(s) {
    //var patrn = /^[\u2E80-\u9FFF]$/; //Unicode编码中的汉字范围  /[^\x00-\x80]/
    var patrn = /^\d+\-\d+$/;
    return patrn.test(s);
}
//校验登录名：只能输入4-20个以字母开头、可带数字的字串
function checkIsRegisterUserName(s) {
    var patrn = /^[a-zA-Z]{1}([a-zA-Z0-9]|){3,19}$/;
    return patrn.test(s);
}

//校验用户姓名：只能输入4-30个以字母开头的字串
function checkIsTrueName(s) {
    var patrn = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/;
    return patrn.test(s);
}

//校验密码：只能输入6-20个字母、数字、下划线
function checkIsPasswd(s) {
    var patrn = /^[A-Za-z0-9_]{6,20}$/;
    return patrn.test(s);
}

//校验普通电话、传真号码：可以“+”开头，除数字外，可含有“-”
function checkIsNumber(s) {
    var patrn = /^\d+(\.\d+)?$/;
    return patrn.test(s);
}
//只能是数字
function checkIsNum(s) {
    var patrn = /^[0-9\-]{1,20}$/;
    return patrn.test(s);
}
//校验手机号码
function checkIsMobil(s) {
    var patrn = /^(13[0-9]|14[57]|15[012356789]|18[01236789]|14[57])[0-9]{8}$/;
    return patrn.test(s);
}

//校验邮政编码
function checkIsPostalCode(s) {
    var patrn = /^[a-zA-Z0-9 ]{3,12}$/;
    return patrn.test(s);
}
//只能是CODE
function checkIsCode(s) {
    var patrn = /^[a-zA-Z0-9]*$/;
    return patrn.test(s);
}
//校验是否IP地址
function checkIsIP(s) {
    var patrn = /^([1-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){2}([1-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/;
    return patrn.test(s);
}

//校验EMail
function checkIsEMail(s) {
    //var regex = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
    //var reg =   /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
    var patrn = /^([0-9A-Za-z\-_\.]+)@([0-9A-Za-z]+\.[A-Za-z]{2,3}(\.[A-Za-z]{2})?)$/g;
    return patrn.test(s);
}
//校验是否身份证号
function checkIsCardID(s) {
    var patrn = /^\d{17}[\dX]{1}$/;
    return patrn.test(s);
}
//校验只能为3位数字
function checkIs3Num(s) {
    var patrn = /^\d{3}$/;
    return patrn.test(s);
}
//校验只能为4位数字
function checkIs4Num(s) {
    var patrn = /^\d{4}$/;
    return patrn.test(s);
}
//校验只能为6位数字
function checkIs6Num(s) {
    var patrn = /^\d{6}$/;
    return patrn.test(s);
}
//校验只能为3位以下数字
function checkIsAge(s) {
    var patrn = /^\d{1,3}$/;
    return patrn.test(s);
}
//校验夜场时间
function checkIsYechang(s) {
    var patrn = /^(([0-1][0-9])|(2[0-3]))[0-5][0-9]$/;
    return patrn.test(s);
}
//校验时间范围
function checkIsHoliday(s) {
    var patrn = /^([0-6]*(,[0-6])*[,]*)*((\d{4}\-(1[0-2]|0[1-9])\-[0-3][0-9])\^(\d{4}\-(1[0-2]|0[1-9])\-[0-3][0-9]))*$/;
    if (patrn.test(s))
        return patrn.test(s);
}
function isRegisterUserName(s) {
    var patrn = /^[a-zA-Z]{1}[a-zA-Z0-9._]*$/;
    return patrn.exec(s);
}
function GetChild(tname, tstr, sname, type, isfind) {
    // console.log(tstr);
    var sstr = tstr.split("|");
    var wstr = "";
    if (sstr.length > 2) {
        if (sstr.length == 3) {
            wstr = sstr[2].replace(/~/g, "|");
        }
        if (sstr.length == 4) {
            wstr = sstr[2].replace(/~/g, "|") + " and " + sstr[3].replace(/~/g, "|");
        }
    }
    if (wstr == "") wstr = "1=1 order by id";
    else wstr += " order by id";
    var idstr = sstr[0];
    var namestr = sstr[1];
    $.ajax({
        type: "POST",  //访问WebService使用post方式请求
        contentType: "application/json; charset=utf-8",
        url: getRootPath() + "/Service/MyWebService.asmx/GetTable", //调用WebService的地址和方法名称组合
        data: "{tableName:'" + tname + "',whereSql:'" + wstr + "'}",
        dataType: "json",
        async: false,
        success: function (result) {
            var myjson = result.d;
            // console.log(myjson);
            var jsondatas = eval("(" + myjson + ")");
            if (jsondatas.CODE > 0) {
                var mytbl = jsondatas.Table;
                if (type == "select") {
                    if (isfind == true) {
                        $("#" + sname).empty();
                        $("#" + sname).append("<option value=\"all\">全部</option>");
                    }
                    else {
                        $("#" + sname).empty();
                    }
                    $.each(mytbl, function (i, n) {
                        $("#" + sname).append("<option value=\"" + n[idstr] + "\">" + n[namestr] + "</option>");
                    });
                }
                else if (type == "checkbox" || type == "button") {
                    $("#" + sname).empty();
                    $.each(mytbl, function (i, n) {
                        $("#" + sname).append("<span><input type=\"checkbox\" value=\"" + n[idstr] + "\" />" + n[namestr] + "</span>");
                    });
                }
                else if (type == "radio") {
                    $("#" + sname).empty();
                    $.each(mytbl, function (i, n) {
                        $("#" + sname).append("<span><input value=\"" + n[idstr] + "\" name=" + tname + " type=\"radio\" />" + n[namestr] + "</span>");
                    });
                }
            }
            else {
                if (isfind == true) {
                    $("#" + sname).empty();
                    $("#" + sname).append("<option value=\"all\">全部</option>");
                }
                else {
                    $("#" + sname).empty();
                }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            //通常情况下textStatus和errorThrown只有其中一个包含信息
            alert(XMLHttpRequest.status + "," + XMLHttpRequest.readyState + textStatus);
        }
    });
}
function formatZero(num, len) {
    if (String(num).length > len) return num;
    return (Array(len).join(0) + num).slice(-len);
}
function getFormat(nTime) {
    format = "";
    format += nTime.getFullYear() + "-";

    format += (nTime.getMonth() + 1) < 10 ? ("0" + (nTime.getMonth() + 1)) : (nTime.getMonth() + 1);
    format += "-";
    format += nTime.getDate() < 10 ? ("0" + (nTime.getDate())) : (nTime.getDate());
    return format;
}
function timeFormat(date) {
    var dateTmp = eval('new ' + date.substr(1, date.length - 2)).toJSON(); //new Date()
    //var dateTmp = new Date(date).toJSON();
    return new Date(+new Date(dateTmp) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
}
function timeFormatSmall(date) {
    var dateTmp = eval('new ' + date.substr(1, date.length - 2)).toJSON(); //new Date()
    //var dateTmp = new Date(date).toJSON();
    var str = new Date(+new Date(dateTmp) + 8 * 3600 * 1000).toISOString();
    return str.substring(0, str.indexOf("T"));
}
/**
 * @param base64Codes
 *            图片的base64编码
 */
function sumitImageFile(base64Codes) {
    var form = document.forms[0];

    var formData = new FormData(form);   //这里连带form里的其他参数也一起提交了,如果不需要提交其他参数可以直接FormData无参数的构造函数

    //convertBase64UrlToBlob函数是将base64编码转换为Blob
    formData.append("imageName", convertBase64UrlToBlob(base64Codes));  //append函数的第一个参数是后台获取数据的参数名,和html标签的input的name属性功能相同

    //ajax 提交form
    $.ajax({
        url: form.action,
        type: "POST",
        data: formData,
        dataType: "text",
        processData: false,         // 告诉jQuery不要去处理发送的数据
        contentType: false,        // 告诉jQuery不要去设置Content-Type请求头

        success: function (data) {
            window.location.href = "${ctx}" + data;
        },
        xhr: function () {            //在jquery函数中直接使用ajax的XMLHttpRequest对象
            var xhr = new XMLHttpRequest();

            xhr.upload.addEventListener("progress", function (evt) {
                if (evt.lengthComputable) {
                    var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                    console.log("正在提交." + percentComplete.toString() + '%');        //在控制台打印上传进度
                }
            }, false);

            return xhr;
        }

    });
}
function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);

    }
    return window.btoa(binary);
    return binary;

}
function buf2hex(buffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}
function isImg(str) {
    if (str.search("[.]+(jpg|jpeg|swf|gif|png|JPG|JPEG|SWF|GIF|PNG)$")) {
        return false;
    }
    return true;
}

// 截取url后面的文件类型
function getUploadUrlSuffix(urlStr) {
    var url = urlStr.substring(urlStr.lastIndexOf("\."), urlStr.length);
    return url;
}

function nowtime() {//将当前时间转换成yyyymmdd格式
    var mydate = new Date();
    var str = "" + mydate.getFullYear();
    var mm = mydate.getMonth() + 1
    if (mydate.getMonth() > 9) {
        str += mm;
    }
    else {
        str += "0" + mm;
    }
    if (mydate.getDate() > 9) {
        str += mydate.getDate();
    }
    else {
        str += "0" + mydate.getDate();
    }
    return str;
}
function nowdate() {//将当前时间转换成yyyymmdd格式
    var mydate = new Date();
    var str = "" + mydate.getFullYear();
    var mm = mydate.getMonth() + 1
    if (mydate.getMonth() > 9) {
        str += "-" + mm;
    }
    else {
        str += "-0" + mm;
    }
    if (mydate.getDate() > 9) {
        str += "-" + mydate.getDate();
    }
    else {
        str += "-0" + mydate.getDate();
    }
    return str;
}
function nowdatestr() {//将当前时间转换成yyyymmdd格式
    var mydate = new Date();
    var str = "" + mydate.getFullYear();
    var mm = mydate.getMonth() + 1
    if (mydate.getMonth() > 9) {
        str += "" + mm;
    }
    else {
        str += "0" + mm;
    }
    if (mydate.getDate() > 9) {
        str += "" + mydate.getDate();
    }
    else {
        str += "0" + mydate.getDate();
    }
    return str;
}
// 导出
function exportEvent(dom, name, img) {
    if (img !== '') {
        html2canvas($(img)[0]).then(function (canvas) {
            canvas.toBlob(function (_blob) {
                saveAs(_blob, name + ".png");
            });
        });
    }

    var table = $(dom).prop("outerHTML");
    // console.log($(dom).prop("outerHTML"));
    var html = "<html><head><meta charset='utf-8' /><style>th,td {border: 0.5px solid ; text-align:center;}</style></head><body>" + table + "</body></html>";

    // 实例化一个Blob对象，其构造函数的第一个参数是包含文件内容的数组，第二个参数是包含文件类型属性的对象
    var blob = new Blob([html], { type: "application/vnd.ms-excel" });
    saveAs(blob, name + ".xls");
}

