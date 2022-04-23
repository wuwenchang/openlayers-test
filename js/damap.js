var map;
var isShowPopup = false
var allCarMarker = []; // 所有交通方式数组，geoMarker, id, refreshTime
var markerStyles = {} // 图标类型库
var hadMNRoadsIds = [];
var roadLayers = []
// var timer // 黄色变红定时器
var fristLoadRoadLayer = true
// 动态车辆
var activeCar = []

// 高德地图
var gdRoadState = true;
var gdLayer;

var roadGridStatus = false

// 生成图标
function createMarkersStyles() {
    // 车图标
    var list = ['jy', 'subway', 'bus', 'car', 'train', 'tram', 'point', 'redCar', 'yellowCar']
    for (let i = 0; i < list.length; i++) {
        markerStyles[list[i]] = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 1],
                // anchor: [0.75, 0.5],
                scale: 2 / 3,
                src: '../imgs/carImgs/' + list[i] + '.png',
            }),
        })
    }
    // 其他图标
    var list2 = ['accident', 'tl1', 'tl2', 'tl3', 'tl4', 'tl5', 'tl6', 'tl7', 'tl8', 'tl9', 'tl10', 'tl11', 'tl12', 'tl13', 'tl14', 'l5', 'start', 'l7']
    for (let i = 0; i < list2.length; i++) {
        markerStyles[list2[i]] = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 1],
                // anchor: [0.75, 0.5],
                // scale: 0.5,
                src: '../imgs/' + list2[i] + '.png',
            }),
        })
    }
    // 其他图标
    // var list2 = [ 'start']
    // for (let i = 0; i < list2.length; i++) {
    //     markerStyles[list2[i]] = new ol.style.Style({
    //         image: new ol.style.Icon({
    //             anchor: [0.5, 1],
    //             // anchor: [0.75, 0.5],
    //             // scale: 0.5,
    //             src: '../imgs/' + list2[i] + '.jpg',
    //         }),
    //     }) 
    // }

}

function addacpoint(id) {
    if (location.href.includes('page9') || location.href.includes('page10')) {
        let data = JSON.parse(window.parent.localStorage.getItem('trafficEvent'))
        let params = {
            data: {
                val1: data.name,
                val2: data.address,
                val3: timeFormat(data.startdate || data.starttime),
                val4: data.remark,
                sendIdVal: data.id,
                coordinate: [data.xaxis, data.yaxis],
                showType: 'accident'
            },
            coordinate: [data.xaxis, data.yaxis],
            zIndex: 1,
            stylepng: 'tl5'
        }
        if (location.href.includes('page10')) {
            params = {
                data: {
                    val1: data.name,
                    val2: data.address,
                    val3: data.remark1,
                    val4: data.remark,
                    val5: timeFormat(data.starttime),
                    sendIdVal: data.id,
                    coordinate: [data.xaxis, data.yaxis],
                    showType: 'accident'
                },
                coordinate: [data.xaxis, data.yaxis],
                zIndex: 1,
                stylepng: 'l5'
            }
        }
        Object.assign(data, params);
        showAccidentPopup({ data }, map);
        var accidentMessage = $('#accidentMessage')
        accidentMessage.attr('data', JSON.stringify(params.data))
        accidentMessage.show();
        $('#driverMessage').hide()
        $('#rescueMessage').hide()
        return
    }
    $.ajax({
        type: "POST",  //访问WebService使用post方式请求
        cache: false,
        async: false,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        url: getRootPath() + "/Service/GetTable.ashx", //调用WebService的地址和方法名称组合
        data: { tableName: "traffic_accident A,traffic_accident_type B", whereSql: "A.type=B.id and A.id=" + id },
        success: function (myjson) {
            var jsondatas = eval("(" + myjson + ")");
            // console.log(jsondatas, 'damap')
            if (jsondatas.CODE > 0) {
                var mktable = jsondatas.Table;
                var maker = mktable[0];
                console.log(maker);
                locationbyMark(maker, true);
            }
            else {
                console.log(jsondatas.MSG, { icon: 2 });
            }
        },
        error: function () {
            console.log("系统错误", { icon: 2 })
        },
        complete: function () {
        }
    });
}
var locationMap;
var hadMarkerIds = []; // 已添加的图标id
function locationbyMark(maker, isHistory) {
    var src;
    var stylepng;
    var activeSrc;
    //判断类型，更改显示图标
    if (maker.type == 1) {
        if (maker.target == 1) {
            src = stylepng = activeSrc = '../imgs/tl8.png';
        }
        else if (maker.target == 2 || maker.target == 4) {
            src = stylepng = activeSrc = '../imgs/tl9.png';

        }
        else if (maker.target == 3) {
            src = stylepng = activeSrc = '../imgs/tl10.png';
        }
        else if (maker.target == 5) {
            src = stylepng = activeSrc = '../imgs/tl7.png';
        }
        else if (maker.target == 6) {
            src = stylepng = activeSrc = '../imgs/tl2.png';
        }
    }
    else
        src = stylepng = activeSrc = '../imgs/' + maker.img + '.png';
    var obj = {
        isActive: true,
        coordinate: [maker.xaxis, maker.yaxis],
        isHistory: isHistory,
        src: src,
        data: {
            coordinate: [maker.xaxis, maker.yaxis],
            showType: 'accident',
            val1: maker.name,
            val2: maker.address,
            val3: maker.code,
            val4: maker.message,
            val5: timeFormat(maker.addtime),
            val6: maker.name1,
            sendIdVal: maker.id
        },
        zIndex: 1,
        stylepng: stylepng,
        activeSrc: activeSrc
    }
    if (isHistory) {
        var mydata = {
            data: obj
        }
        showAccidentPopup(mydata, locationMap, true);
        $(".footer").hide();
    }
    else {
        parent.postMessage(obj, '*');
    }
}

// 加载地图瓦片
function loadmap(center1, resolutionpara, inilayers) {
    var source = new ol.source.Vector({ wrapX: false });
    var vector = new ol.layer.Vector({
        source: source
    });
    // 地图坐标
    var projection = ol.proj.get('EPSG:3857');
    // 基础地图服务切片地址
    var tileUrl = "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}";
    // 坐标原点
    var origin = [-2.0037508342787E7, 2.0037508342787E7];
    // 分辨率
    var resolutions = [156543.03392800014, 78271.51696399994, 39135.75848200009, 19567.87924099992, 9783.93962049996, 4891.96981024998, 2445.98490512499
        , 1222.992452562495, 611.4962262813797, 305.74811314055756, 152.87405657041106, 76.43702828507324, 38.21851414253662, 19.10925707126831, 9.554628535634155,
        4.77731426794937, 2.388657133974685, 1.1943285668550503, 0.5971642835598172, 0.29858214164761665];
    //地图范围
    var fullExtent = [-2.0037507067161843E7, -1.819812769412998E7, 2.0037507067161843E7, 2.8686510967305996E7];
    var tileGrid = new ol.tilegrid.TileGrid({
        tileSize: 256,
        origin: origin,
        extent: fullExtent,
        resolutions: resolutions
    });
    // 瓦片数据源
    var tileArcGISXYZ = new ol.source.XYZ({
        tileGrid: tileGrid,
        projection: projection,
        url: tileUrl,
    });
    center1 = ol.proj.transform(center1, 'EPSG:4326', 'EPSG:3857');
    map = new ol.Map({
        controls: ol.control.defaults({ attribution: false, zoom: false, rotate: false }).extend([
        ]),
        target: 'map',
        layers: [
            // 瓦片图层
            new ol.layer.Tile({
                source: tileArcGISXYZ
            }),
            vector
        ],
        view: new ol.View({
            //初始化中心点坐标
            center: center1,
            resolutions: resolutions,
            // 注意：此处指定缩放级别不能通过zoom来指定，指定了也无效，必须通过resolution来指定
            resolution: resolutionpara,
            // zoom: 10,
            projection: projection,
            extent: fullExtent
        })
    });
    if (inilayers) {
        for (var i = 0; i < inilayers.length; i++) {
            var dalayer = loadTileWMS(inilayers[i]);
            roadLayers.push(dalayer)
        }
    }
    locationMap = map;
    if (getUrlParam("acid")) {
        addacpoint(getUrlParam("acid"));
    }
    // map.on('click', function (e) {
    //     // console.log(e.coordinate)
    //     console.log(ol.proj.transform(e.coordinate, 'EPSG:3857', 'EPSG:4326'))
    // })

    // 地图初始化，放大缩小图标
    createMarkersStyles()
    map.getView().on('change:resolution', function () {
        // 重新设置图标的缩放率，基于层级20来做缩放
        let zoom = this.getZoom()
        let scale = 0.001;
        for (let key in markerStyles) {
            if (zoom < 10) {
                scale = 0.001
            } else {
                scale = zoom / 15 > 1 ? 1 : Math.pow(zoom / 15, 1)
            }
            markerStyles[key].getImage().setScale(scale)
        }
    })
    if (location.href.includes('page5.html') || location.href.includes('page11.html')) {
        gdLayer = trafficGD()
        map.addLayer(gdLayer)
    }
    return map;
}

/**
* 加载高德道路车况
*/
function trafficGD() {
    //获取当前时间
    var nowDate = new Date('2022/2/16 10:00:00');
    var year = nowDate.getFullYear();
    var month = nowDate.getMonth() + 1;
    var today = nowDate.getDate();
    var hours = nowDate.getHours();
    var minutes = nowDate.getMinutes();
    var seconds = nowDate.getSeconds();

    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (today >= 1 && today <= 9) {
        today = "0" + today;
    }
    var currentdate = year + "-" + month + "-" + today + " " + hours + ":" + minutes + ":" + seconds;
    var longTime = new Date(currentdate.replace(new RegExp("-", "gm"), "/")).getTime();
    var projection = ol.proj.get("EPSG:4326");
    function getNavmapLayer() {
        return new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'http://webrd01.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8'//7,8
            }),
            projection: projection
        });
    }
    function getNavmapTraficLayer(longTime) {
        return new ol.layer.Tile({
            source: new ol.source.XYZ({
                url: 'http://tm.amap.com/trafficengine/mapabc/traffictile?v=1.0&;t=1&x={x}&y={y}&z={z}&&t=longTime'//7,8
            }),
            projection: projection
        });
    }
    var nana = getNavmapTraficLayer(longTime);
    //var navlayer = getNavmapLayer();
    return nana;
};

// 显示隐藏图层
$('#roadGrid').on('click', function () {
    if (fristLoadRoadLayer) {
        fristLoadRoadLayer = false
        for (let i = 0; i < roadLayers.length; i++) {
            map.addLayer(roadLayers[i]);//将图层加入map
        }
        return
    }
    if (roadGridStatus) {
        for (let i = 0; i < roadLayers.length; i++) {
            roadLayers[i].setVisible(true)
        }
    } else {
        for (let i = 0; i < roadLayers.length; i++) {
            roadLayers[i].setVisible(false)
        }
    }
    roadGridStatus = !roadGridStatus
})
// 显示隐藏图层
$('#gdRoad').on('click', function () {
    if (gdRoadState) {
        gdLayer.setVisible(false)
    } else {
        gdLayer.setVisible(true)
    }
    gdRoadState = !gdRoadState
})

function loadTileWMS(layer) {
    var daurl = 'http://114.215.130.203:8080/geoserver/bjda/wms';
    var dalayer = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: daurl,
            params: { 'LAYERS': 'bjda:' + layer, 'singleTile': true }

        })
    })
    return dalayer;
}

/***** start *******/
// var vectorLayer = null;
// 添加图标事件
function addMarker(params, map) {
    let coordinate = ol.proj.transform(params.coordinate, 'EPSG:4326', 'EPSG:3857')
    var feature = new ol.Feature({
        geometry: new ol.geom.Point(coordinate),
        name: 'locate',
        population: 4000,
        rainfall: 500,
        params: params.data
    });
    // var iconStyle = setMarkStyle(params);
    // feature.setStyle(iconStyle);//图层设置 样式
    feature.setStyle(params.style || markerStyles[params.stylepng])
    // vectorLayer == null ? null : map.removeLayer(vectorLayer);
    var vectorLayer = new ol.layer.Vector({
        id: params.data.id || ('marker' + new Date().getTime() + Math.round(Math.random() * 100000)),
        source: new ol.source.Vector({
            features: [feature]//图层加进去
        }),
        zIndex: params.zIndex || 10
    });
    map.addLayer(vectorLayer);//将图层加入map
}
// function setMarkStyle(params) {
//     var iconStyle = new ol.style.Style({
//         image: new ol.style.Icon({
//             anchor: [0.4, 37],
//             anchorXUnits: 'fraction',
//             anchorYUnits: 'pixels',
//             src: params.src || "../imgs/" + params.stylepng + ".png",
//             activeSrc: params.activeSrc || "../imgs/" + params.stylepng + ".png",
//         })
//     });
//     return iconStyle;
// }

//随机抽取数据库的数据车辆信息或者随机生成社会车辆信息
//抽取道路 / 高铁线路 / 地铁线路 / 体育场馆 / 交通枢纽等点信息
//随机生成常用事故信息类型
//记录生成事故的时间
//setRandomAccident()
//{
//    //随机时间生成上述信息
//}

var container = document.getElementById('popup');
var content = document.getElementById('latlon');
var closer = document.getElementById('popup-closer');

function showAccidentPopup(res, map, otherPage) {
    var data = res.data;
    // var overlay = getOverlay();
    // overlay.setPosition(data.coordinate);
    // map.addOverlay(overlay);
    let coordinate = ol.proj.transform(data.coordinate, 'EPSG:4326', 'EPSG:3857')
    if (map.getOverlays().C.length) {
        map.getOverlays().C[0].setPosition(coordinate)
    } else {
        var overlay = getOverlay();
        overlay.setPosition(coordinate);
        map.addOverlay(overlay);
    }
    $('#val1').val(data.data.val1)
    $('#val2').val(data.data.val2)
    $('#val3').val(data.data.val3)
    $('#val4').val(data.data.val4)
    $('#val5').val(data.data.val5)
    $('#val6').val(data.data.val6)
    $('#val7').val(data.data.val7)
    $('#val8').val(data.data.val8)
    $('#val9').val(data.data.val9)
    $('#val10').val(data.data.val10)
    document.getElementById("popup").style.display = "block";
    if (otherPage) {
        $('#driverMessage').hide()
        $('#accidentMessage').show()
    } else {
        $('#driverMessage').show()
        $('#accidentMessage').hide()
    }
    $('#rescueMessage').hide()
    addMarker(data, map)
    map.getView().setCenter(coordinate)
    // 两种方法都可以
    //map.getView().setRsolution('50')
    map.getView().setZoom(15)
}
function getOverlay() {
    // 气泡层
    var overlay = new ol.Overlay(({
        element: document.getElementById('popup'),
        autoPan: true,
        autoPanAnimation: {
            duration: 250   //当Popup超出地图边界时，为了Popup全部可见，地图移动的速度. 单位为毫秒（ms）
        }
    }))
    return overlay;
}

// 黄色标签时，弹框人工操作
function artificialWarning(data) {
    var childData = activeCar[0]
    if (data.id !== childData.properties.id) {
        childData = activeCar[1]
    }
    clearTimeout(childData.timer)
    layer.open({
        type: 1,
        title: '异常确认',
        icon:0,
        skin: 'isChangeCartips', //样式类名
        // id: '',
        // area: ['200px', '300px'], //宽高
        anim: 2,
        closeBtn: 0, // 不显示
        btn: ['是', '否'],
        yes: function () {
            // console.log('确定')
            layer.closeAll();
            childData.properties.showType = 'redCar'
            childData.pointLayer.setStyle(markerStyles['redCar'])
        },
        btn2: function () {
            childData.properties.showType = 'car'
            childData.pointLayer.setStyle(markerStyles['car'])
            // console.log('取消')
        },
        content: '车辆停止超过5分钟，确认是否发生事故？'
    });
}

// 地图点位交互
function popupShow(e, map) {
    var coordinate = e.coordinate;
    let feature = map.forEachFeatureAtPixel(e.pixel, a => a);
    if (feature) {
        if ((feature.O.params && feature.O.params.hideMessage) || !feature.O.params) return
        var showType = feature.O.params.showType;
        var driverMessage = $('#driverMessage')
        var accidentMessage = $('#accidentMessage')
        var rescueMessage = $('#rescueMessage');
        var processDetail = $('#processDetail')
        if (processDetail && processDetail.length) processDetail.addClass('hide')
        isShowPopup = feature.O.params.id
        if (feature.O.params.error) {
            if (showType === 'yellowCar') {
                artificialWarning(feature.O.params)
                return
            } else if (showType === 'redCar') {
                console.log(feature.O.params)
                $('#val1').val(feature.O.params.val1)
                $('#val2').val(feature.O.params.val2)
                $('#val3').val(feature.O.params.val3)
                $('#val4').val(feature.O.params.val4)
                $('#val5').val(feature.O.params.val5)
                if (driverMessage) driverMessage.hide()
                if (accidentMessage) {
                    accidentMessage.show()
                    accidentMessage.attr('data', JSON.stringify(feature.O.params))
                }
                if (rescueMessage) rescueMessage.hide()
            } else {
                return
            }
        } else if (showType === 'accident') {
            $('#val1').val(feature.O.params.val1)
            $('#val2').val(feature.O.params.val2)
            $('#val3').val(feature.O.params.val3)
            $('#val4').val(feature.O.params.val4)
            $('#val5').val(feature.O.params.val5)
            let val6 = $('#val6')
            if (val6) val6.val(feature.O.params.val6)
            let val7 = $('#val7')
            if (val7) val7.val(feature.O.params.val7)
            let val8 = $('#val8')
            if (val8) val8.val(feature.O.params.val8)
            let val9 = $('#val9')
            if (val9) val9.val(feature.O.params.val9)

            $('#sendid').val(feature.O.params.sendIdVal)
            if (driverMessage) driverMessage.hide()
            if (accidentMessage) {
                accidentMessage.show()
                accidentMessage.attr('data', JSON.stringify(feature.O.params))
            }
            if (rescueMessage) rescueMessage.hide()
        } else if (showType === 'rescue') {
            $('#val21').val(feature.O.params.val)
            if ($('#val22')) {
                $('#val22').val(feature.O.params.val2)
                $('#val23').val(feature.O.params.val3)
                $('#val24').val(feature.O.params.val4)
                $('#val25').val(feature.O.params.val5)
                $('#val26').val(feature.O.params.val6)
            }
            if (driverMessage) driverMessage.hide()
            if (accidentMessage) accidentMessage.hide()
            if (rescueMessage) rescueMessage.show()
            rescueMessage.attr('data', JSON.stringify(feature.O.params))
        } else if (showType === 'car') {
            $('#val11').val(feature.O.params.val11)
            $('#val12').val(feature.O.params.val12)
            $('#val13').val(feature.O.params.val13)
            $('#val14').val(feature.O.params.val14)
            $('#val15').val(feature.O.params.val15)
            $('#val16').val(feature.O.params.val16)
            $('#val17').val(feature.O.params.val17)
            $('#val18').val(feature.O.params.val18)
            $('#val19').val(feature.O.params.val19)
            if (driverMessage) {
                driverMessage.show()
                driverMessage.attr('data', JSON.stringify(feature.O.params))
            }
            if (accidentMessage) accidentMessage.hide()
            if (rescueMessage) rescueMessage.hide()
        } else if (showType && showType !== 'hide') {
            if (driverMessage) driverMessage.hide()
            if (accidentMessage) accidentMessage.show()
            if (rescueMessage) rescueMessage.hide()
            // document.getElementById("popup").style.display = "none";
            // 
        } else {
            return
        }
        if (map.getOverlays().C.length) {
            map.getOverlays().C[0].setPosition(coordinate)
        } else {
            var overlay = getOverlay();
            overlay.setPosition(coordinate);
            map.addOverlay(overlay);
        }
        document.getElementById("popup").style.display = "block";

    }
}
//生成动态模拟运动轨迹
// 绘制主路
function drawMainLine(pointsList, properties) {
    var roadLine = new ol.geom.LineString(pointsList);
    var roadLineSource = new ol.source.Vector({
        features: [new ol.Feature(roadLine)]
    });
    var id = 'mainLine' + properties.id;
    var roadLineLayer = new ol.layer.Vector({
        id,
        properties,
        source: roadLineSource,
        style: getCustomStyle({ color: properties.color || '#4ddc2c', text: properties.region || properties.name || properties.XLMC || properties.text })
    });
    hadMNRoadsIds.push(id)
    hadMarkerIds.push(id)
    map.addLayer(roadLineLayer);
}
// 绘制轨迹路线
function drawTrackLine(pointsList = [], color) {
    var roadLine2 = new ol.geom.LineString(pointsList)
    var roadLineSource2 = new ol.source.Vector({
        features: [new ol.Feature(roadLine2)]
    });
    var id = 'trackLine';
    var roadLineLayer2 = new ol.layer.Vector({
        id,
        source: roadLineSource2,
        style: getCustomStyle({ color: color || '#f00' })
    });
    hadMarkerIds.push(id)
    map.addLayer(roadLineLayer2);
}
// 添加起点、终点事件
function addSEMarker(params) {
    // let coordinate = ol.proj.transform(params.coordinate, 'EPSG:4326', 'EPSG:3857')
    var feature = new ol.Feature({
        type: params.isStart ? 'startImg' : 'endImg',
        params: params.data,
        geometry: new ol.geom.Point(params.coordinate)
    });
    var iconStyle = new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.6, 0.9],
            src: params.isStart ? '../imgs/start.png' : '../imgs/end.png'
        })
    });
    feature.setStyle(iconStyle);//图层设置 样式
    var vectorLayer = new ol.layer.Vector({
        id: params.id,
        source: new ol.source.Vector({
            features: [feature]//图层加进去
        })
    });
    hadMarkerIds.push(params.id)
    map.addLayer(vectorLayer);//将图层加入map
}
// 模拟交通事故
function trafficLines(params, pointsList, lineNum) {
    removeLayer('trafficLine1' + lineNum)
    removeLayer('trafficLine2' + lineNum)
    // 较堵塞
    var trafficLine1 = new ol.geom.LineString(pointsList.slice(params.start1, params.end1));
    var trafficLineSource2 = new ol.source.Vector({
        features: [new ol.Feature(trafficLine1)]
    });
    var trafficLayer1 = new ol.layer.Vector({
        id: 'trafficLine1' + lineNum,
        source: trafficLineSource2,
        style: getCustomStyle({ color: '#ff0' })
    });
    hadMarkerIds.push('trafficLine1' + lineNum)
    map.addLayer(trafficLayer1);
    // 非常堵塞
    var trafficLine2 = new ol.geom.LineString(pointsList.slice(params.start2, params.end2));
    var trafficLineSource2 = new ol.source.Vector({
        features: [new ol.Feature(trafficLine2)]
    });
    var trafficLayer2 = new ol.layer.Vector({
        id: 'trafficLine2' + lineNum,
        source: trafficLineSource2,
        style: getCustomStyle({ color: 'red' })
    });
    hadMarkerIds.push('trafficLine2' + lineNum)
    map.addLayer(trafficLayer2);
}
// 移除layer, 根据id或者features的type
function removeLayer(type) {
    var allLayers = map.getLayers().getArray()
    let pointLayer;
    for (let i = 0; i < allLayers.length; i++) {
        let item = allLayers[i];
        if (item.O.id === type) {
            pointLayer = allLayers[i]
        } else if (item.O.source.getFeatures) {
            if (item.O.source.getFeatures().length && type === item.O.source.getFeatures()[0].O.type) {
                pointLayer = allLayers[i]
            }
        }
    }
    if (pointLayer) {
        if (hadMarkerIds.indexOf(type) !== -1) {
            hadMarkerIds.splice(hadMarkerIds.indexOf(type), 1)
        }
        map.removeLayer(pointLayer)
    }
}
/**
 * @description: 模拟交通事故
 * @param {number} pointIndex：交通事故在线路上的位置
 * @param {number} pointIndex：交通事故在线路上的位置
 * @param {number} line1Radius：比较拥堵路线半径
 * @param {number} line2Radius：非常拥堵路线半径
 * @param {number} time：刷新时间
 * @param {number} times：执行次数
 * */
function startTraffic(pointsList, params, lineNum, time) {
    let { pointIndex, line1Radius, line2Radius, times } = params
    trafficLines({
        start1: pointIndex - line1Radius > 0 ? pointIndex - line1Radius : 0,
        end1: pointIndex + line1Radius >= pointsList.length - 1 ? pointsList.length - 1 : pointIndex + line1Radius,
        start2: pointIndex - line2Radius > 0 ? pointIndex - line2Radius : 0,
        end2: pointIndex + line2Radius >= pointsList.length - 1 ? pointsList.length - 1 : pointIndex + line2Radius,
    }, pointsList, lineNum)
    setTimeout(() => {
        if (times > 0) {
            startTraffic(pointsList, {
                pointIndex,
                line1Radius: line1Radius * 2,
                line2Radius: line2Radius * 2,
                times: times - 1
            }, lineNum)
        }
    }, time || 10000);
}
// 开始动画
function startAnimation(params) {
    let { pointsList, carMarker, carType, properties, isDrawHistory, endIndex } = params
    let pointIndex = 0, roadLine2;
    var allLayers = map.getLayers().getArray()
    let pointLayer;
    for (let i = 0; i < allLayers.length; i++) {
        let item = allLayers[i];
        if (item.O.id === carMarker.id) {
            pointLayer = allLayers[i]
        }
    }
    if (isDrawHistory) {
        // 初始化轨迹路线
        roadLine2 = new ol.geom.LineString([pointsList[0]])
        var roadLineSource2 = new ol.source.Vector({
            features: [new ol.Feature(roadLine2)]
        });
        var roadLineLayer2 = new ol.layer.Vector({
            id: 'trackLine',
            source: roadLineSource2,
            style: getCustomStyle({ color: params.historyColor || '#4ddc2c' })
        });
        map.addLayer(roadLineLayer2);
    }

    if (pointLayer) {
        const position = new ol.geom.Point(pointsList[0]);
        let allPoint = []
        // if (carType === 'subway') {
        for (let i = 0; i < pointsList.length; i++) {
            let list = createMinLine(pointsList[i], pointsList[i + 1], 10)
            allPoint = allPoint.concat(list)
        }
        allPoint.push(pointsList[pointsList.length - 1])
        // }
        if (allPoint.length < 2) return
        let startMove = setInterval(() => {
            if (endIndex && endIndex <= pointIndex) return
            pointIndex++
            position.setCoordinates(allPoint[pointIndex]);
            // let rotation = Math.atan2(allPoint[pointIndex][1] - allPoint[pointIndex - 1][1], allPoint[pointIndex][0] - allPoint[pointIndex - 1][0])
            // pointLayer.setStyle(getCarType(carType, rotation))
            pointLayer.setStyle(markerStyles[carType])
            carMarker.geoMarker.setGeometry(position);
            if (isDrawHistory) {
                // 添加轨迹点位
                roadLine2.appendCoordinate(allPoint[pointIndex])
            }
            // if (isShowPopup === properties.id && !properties.hideMessage && map.getOverlays().C.length) {
            //     map.getOverlays().C[0].setPosition(allPoint[pointIndex])
            // }
            if (pointIndex >= allPoint.length - 1) {
                if (params.error) {
                    properties.showType = 'yellowCar'
                    pointLayer.setStyle(markerStyles['yellowCar'])
                    var obj = {
                        pointLayer,
                        properties
                    }
                    obj.timer = setTimeout(() => {
                        properties.showType = 'redCar'
                        pointLayer.setStyle(markerStyles['redCar'])
                    }, 2000)
                    activeCar.push(obj)
                }
                clearInterval(startMove)
            }
        }, (properties.refreshTime || 0.5) * 1000);
    }
}
// 根据速度生成更小的线路
function createMinLine(cur, next, v) {
    if (!next) return []
    var curPoint = ol.proj.transform(cur, 'EPSG:3857', 'EPSG:4326')
    var nextPoint = ol.proj.transform(next, 'EPSG:3857', 'EPSG:4326')
    // 获取两个经纬度之间的距离
    var distance = ol.sphere.getDistance(curPoint, nextPoint)
    var lineLength = Math.ceil(distance / v);
    var newList = new Array(lineLength)
    for (let i = 0; i < newList.length; i++) {
        if (i !== newList - 1) {
            newList[i] = [cur[0] - (cur[0] - next[0]) * i / lineLength, cur[1] - (cur[1] - next[1]) * i / lineLength]
        } else {
            newList[i] = next
        }
    }
    return newList;
}
// 汽车图标
function createGeoMarker(pointsList, properties, carType) {
    let id = carType + 'geoMarker' + Math.floor(Math.random() * 10000);
    const geoMarker = new ol.Feature({
        params: properties,
        geometry: new ol.geom.Point(pointsList[0])
    });
    const arrowLayer = new ol.layer.Vector({
        id,
        source: new ol.source.Vector({
            features: [geoMarker]
        }),
        // style: getCarType(carType),
        style: markerStyles[carType],
        zIndex: 9999
    });
    map.addLayer(arrowLayer);
    return {
        geoMarker,
        id,
        refreshTime: 0.5
    }
}
function getCarType(carType, rotation) {
    let imgsUrl = '../imgs/carImgs/' + carType + '.png';
    // let carTypes = ['arrow.png', 'b1.png', 'b2.png', 'tl7.png', 'tl2.png', 'tl10.png'];
    return new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.5, 1],
            // anchor: [0.75, 0.5],
            src: imgsUrl,
            // rotation: rotation || -0.6
        }),
    })
}
// 实线样式
function getCustomStyle(params) {
    return new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: params.color || '#4ddc2c',
            width: params.width || '3'
        }),
        text: new ol.style.Text({
            font: '15px Microsoft yaHei',
            text: params.text,
            // offsetX: 100,
            offsetY: 15,
            placement: 'line',
            fill: new ol.style.Fill({
                // color: '#4ddc2c'
                color: '#fff'
            })
        })
    });
}
// 动画
function initAnimation(params) {
    const { pointsList, properties, carType, showStartEnd } = params
    const carMarker = createGeoMarker(pointsList, properties, carType)
    allCarMarker.push(carMarker)
    setTimeout(() => {
        // 开始动画
        startAnimation({ ...params, carMarker })
        if (showStartEnd) {
            // 起始点
            // addSEMarker({
            //     coordinate: pointsList[0],
            //     data: params.properties,
            //     isStart: true,
            //     id: 'startImg'
            // })
            // 终点
            //     addSEMarker({
            //         coordinate: pointsList[pointsList.length - 1],
            //         isStart: false,
            //         id: 'endImg'
            //     })
        }
    }, 1000);
}
// 模拟交通事故，拥堵路线，车辆停止
function trafficRoute(data, mainline, trafficObj) {
    // 救援路线
    var line = mainline.map(item => {
        return ol.proj.transform(item, 'EPSG:4326', 'EPSG:3857')
    })
    // 根据数据拐点，生成每一步点位
    let allPoint = []
    let extensionPoint = []
    for (let i = 0; i < line.length; i++) {
        let list = createMinLine(line[i], line[i + 1], 10)
        if (data.trafficIndex > i) {
            allPoint = allPoint.concat(list)
        } else {
            extensionPoint = extensionPoint.concat(list)
            if (i === line.length - 1) {
                extensionPoint.push(line[line.length - 1])
                extensionPoint.shift()
                extensionPoint = allPoint.concat(extensionPoint)
            }
        }
    }
    allPoint.push(line[line.length - 1])
    // // 延长线
    // var line2 = JSON.parse(JSON.stringify(extensionLine))
    // line2 = line2.map(item => {
    //     return ol.proj.transform(item, 'EPSG:4326', 'EPSG:3857')
    // })
    // let extensionPoint = []
    // for (let i = 0; i < line2.length; i++) {
    //     let list = createMinLine(line2[i], line2[i + 1], 10)
    //     extensionPoint = extensionPoint.concat(list)
    // }
    // extensionPoint.push(line[line.length - 1])
    // extensionPoint.shift()
    // extensionPoint = allPoint.concat(extensionPoint)
    if (data.carType) {
        initAnimation({
            pointsList: line, // 线路点
            properties: data, // 参数
            carType: data.carType,  // 车辆类型
            isDrawHistory: true, // 是否绘制轨迹
            endIndex: allPoint.length - 1 - trafficObj.line1Radius * Math.pow(2, trafficObj.times) // 停止点
        })
    }
    // 交通事故
    startTraffic(extensionPoint, {
        pointIndex: allPoint.length - 1,
        line1Radius: trafficObj.line1Radius,
        line2Radius: trafficObj.line2Radius,
        times: trafficObj.times
    }, Math.random(), data.time)
}
function dealJson(railwayjson) {
    let lines = []
    let textLines = []
    for (let i = 0; i < railwayjson.features.length; i++) {
        let id = railwayjson.features[i].properties.id || railwayjson.features[i].properties.name
        // let text = railwayjson.features[i].properties.region || railwayjson.features[i].properties.name;
        if (textLines.indexOf(id) == -1) {
            textLines.push(id)
            lines.push([railwayjson.features[i]])
        } else {
            lines[lines.length - 1].push(railwayjson.features[i])
        }
    }
    return lines
}

function getRescueFeatures(railwayjson, type) {
    // 1: 公交车，2、地铁，3、高铁，4、大巴、5、私家车，6、赛事推迟，7、赛事限流，8、人群拥堵、9人群滞留
    let carTypes = ['', 'bus', 'subway', 'train', 'bus', 'car']
    let lines = []
    // let textLines = []
    for (let i = 0; i < railwayjson.features.length; i++) {
        let item = railwayjson.features[i]
        let arr = []
        if (item.properties.type) {
            arr = item.properties.type.split('|')
        } else {
            arr = ['bus', 'car']
        }
        if (arr.includes(carTypes[type])) {
            lines.push(railwayjson.features[i])
        }
    }
    return lines
}

function beginToSimulate(data, map) {
    let propsData = {
        val1: data.maker.name,
        val2: data.maker.address,
        val3: data.maker.code,
        val4: data.maker.message,
        val5: timeFormat(data.maker.addtime),
        val6: data.maker.name1,
        sendIdVal: data.maker.id,
        target_type: data.maker.target_type,
        index: data.trafficData.index,
        id: data.data.id,
        rescueName: data.data.rescueName,
        rescuePoint: data.line[0],
        showType: 'accident'
    }

    //事故点
    addMarker({
        data: propsData,
        coordinate: data.line[data.data.trafficIndex],
        stylepng: 'accident'
    }, map)
    map.getView().setCenter(ol.proj.transform(data.line[data.data.trafficIndex], 'EPSG:4326', 'EPSG:3857'))
    map.getView().setZoom(13)
    trafficRoute(data.data, data.line, data.trafficData)
}

// 热力图
function createHeatmap(heatData) {
    var vectorSource = new ol.source.Vector({
        features: (new ol.format.GeoJSON()).readFeatures(heatData, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        })
    });
    // Heatmap热力图             
    var vector = new ol.layer.Heatmap({
        source: vectorSource,
        blur: parseInt(10, 10),
        radius: parseInt(5, 10),
    });
    map.addLayer(vector)
}

function updateData(tabIndex, params) {
    // 1 其他事故 .2赛事推迟3赛事限流4人群拥堵5人群滞留
    var tableNames = ['traffic_accident', 'event_delay', 'event_limit', 'traffic_jam', 'traffic_delay'];
    let message = ''
    for (let key in params) {
        message += ((message ? ',' : '') + key + ',|' + params[key] + '|')
    }
    $.ajax({
        cache: false,
        async: false,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        url: getRootPath() + "/Service/AddAccident.ashx", //调用WebService的地址和方法名称组合
        data: { tableName: tableNames[tabIndex], message },
        dataType: "json",
        success: function (result) {
            var jsondatas = eval("(" + result + ")");
            console.log(jsondatas)
        }
    })
}

function createAccident(rescuejson, accidentCarData) {
    var i = 0;
    // 车类型对应的故障类型
    // 1、交通事故，2、交通违法，3、铁路故障，4、城轨故障，5、公交车事故，6、电动车辆起火 7、赛事推迟，8、赛事限流，9、人群拥堵，10、人群滞留
    var CarErrorType = {
        1: ['车辆侧翻', '追尾事故', '车辆剐蹭'],
        2: ['左转弯事故', '超车事故', '直行事故', '占用车道事故'],
        3: ['信号故障', '路线故障', '地面轨道故障'],
        4: ['电力故障', '信号故障', '信号灯故障'],
        5: ['公交车侧翻', '追尾事故', '车辆剐蹭', '路线故障'],
        6: ['车辆侧翻', '电力故障', '追尾事故', '车辆剐蹭', '电动车侧翻']
    }
    // 1: 公交车，2、地铁，3、高铁，4、大巴、5、私家车，6、赛事推迟，7、赛事限流，8、人群拥堵、9人群滞留
    var time = setInterval(function () {
        i++
        var targetList = accidentCarData.targetList
        var target = targetList[Math.floor(Math.random() * targetList.length)];
        var data = getRescueFeatures(rescuejson, target);
        var type = getType(target)
        var code = setCode(target)
        var name = CarErrorType[type][Math.floor(Math.random() * CarErrorType[type].length)]
        var accidentPoint = data[i].geometry.coordinates[0][Math.floor(data[i].geometry.coordinates[0].length / 2)]

        var obj = {
            name: name, // 事故名称
            address: data[i].properties.XLMC.slice(0, -3), // 事故地址
            // 1、交通事故，2、交通违法，3、铁路故障，4、城轨故障，5、公交车事故，6、电动车辆起火
            type: type, // 事故类型
            message: data[i].properties.XLMC.slice(0, -3) + name,  // 描述
            code: code,
            addtime: rTime(new Date('2022/02/16 8:00:00').getTime() + Math.ceil(Math.random() * 90000)),
            // code: '京A' + (10000 + Math.floor(Math.random() * 90000)), 
            xaxis: accidentPoint[0],
            yaxis: accidentPoint[1],
            // line: data[i].geometry.coordinates,
            target_type: data[i].properties.Id, // 救援路线
            // 1: '社会车辆', 2: '公交车', 3: '电动汽车', 4: '奥运小巴', 5: '地铁路线', 6: '高铁车组'
            target: target // 事故对象
        }
        // console.log(accidentPoint)
        updateData(0, obj)
        if (i === data.length - 1) {
            clearInterval(time)
        }
    }, accidentCarData.time || 10000)
}

// type:  1、交通事故，2、交通违法，3、铁路故障，4、城轨故障，5、公交车事故，6、电动车辆起火 7、赛事推迟，8、赛事限流，9、人群拥堵，10、人群滞留
// target: 1: 公交车，2、地铁，3、高铁，4、大巴、5、私家车，6、赛事推迟，7、赛事限流，8、人群拥堵、9人群滞留
function getType(v) {
    if (v == 1) { // 公交车
        // 1、交通事故，2、交通违法，5、公交车事故
        var list = [1, 5]
        return list[Math.floor(Math.random() * list.length)]
    } else if (v == 2) { // 地铁
        // 4、城轨故障
        return 4
    } else if (v == 3) { // 高铁
        // 3、铁路故障
        return 3
    } else if (v == 4) { // 大巴
        // 1、交通事故，2、交通违法
        var list = [1, 2]
        return list[Math.floor(Math.random() * list.length)]
    } else if (v == 5) {
        // 1、交通事故，2、交通违法，5、电动车辆起火
        var list = [2, 6]
        return list[Math.floor(Math.random() * list.length)]
    } else {
        return 3
    }
}
function setCode(v) {
    if (v == 1 || v == 4 || v == 5) {
        return '京A' + (10000 + Math.floor(Math.random() * 90000))
    } else if (v == 2) {
        return Math.ceil(Math.random() * 15) + '号线'
    } else {
        return 'G' + (1000 + Math.floor(Math.random() * 9000))
    }
}

function rTime(date) {//中国标准时间 格式转换成 2020-06-27 14:20:27
    let dictTime = new Date(date);
    var Y = dictTime.getFullYear();
    var M = dictTime.getMonth() + 1;
    M = M < 10 ? '0' + M : M;// 不够两位补充0
    var D = dictTime.getDate();
    D = D < 10 ? '0' + D : D;
    var H = dictTime.getHours();
    H = H < 10 ? '0' + H : H;
    var Mi = dictTime.getMinutes();
    Mi = Mi < 10 ? '0' + Mi : Mi;
    var S = dictTime.getSeconds();
    S = S < 10 ? '0' + S : S;
    return Y + '-' + M + '-' + D + ' ' + H + ':' + Mi + ':' + S;
}

// 获取事故路线
function getAccidentLine(lines, type) {
    for (let i = 0; i < lines.length; i++) {
        if (type == lines[i].properties.Id) {
            return lines[i]
        }
    }
}

// $('#submit').click(function () {
//     if (window.location.href.includes('/page6')) return
//     var accidentMessage = $('#accidentMessage')
//     var data = JSON.parse(accidentMessage.attr('data'));
//     if (window.location.href.includes('page9') || window.location.href.includes('page10')) {
//         Object.assign(data, {
//             rescueName: data.val1 + '救援点',
//             id: data.sendIdVal + 'rescue',
//             rescuePoint: [data.coordinate[0] - 0.006 + 0.004 * Math.random(), data.coordinate[1] - 0.006 + 0.004 * Math.random()]
//         })
//     }
//     if (data.error) {
//         let line = data.jyLines[0].line.map(item => ol.proj.transform(item, 'EPSG:4326', 'EPSG:3857'))
//         initAnimation({
//             pointsList: line,
//             properties: data,
//             isDrawHistory: true,
//             carType: 'jy'
//         })
//     } else {
//         // 救援点
//         addMarker({
//             data: {
//                 val: data.rescueName,
//                 val2: 1 + Math.floor(Math.random() * 19) + '辆',
//                 val3: '公共汽车',
//                 val4: data.rescueName.slice(0, -3) + '公交站',
//                 val5: 15 + Math.ceil(Math.random() * 25) + '分钟',
//                 val6: 20 + Math.ceil(Math.random() * 50) + '分钟',
//                 propsData: data,
//                 showType: 'rescue',
//             },
//             coordinate: data.rescuePoint,
//             stylepng: 'start'
//         }, map)
//     }
//     $('#popup').hide()
//     map.getView().setCenter(ol.proj.transform(data.rescuePoint, 'EPSG:4326', 'EPSG:3857'))
// })

// 模拟呼叫救援
var hadRescue = []
$('#startRescue').on('click', function () {
    var rescueMessage = $('#rescueMessage')
    var data = JSON.parse(rescueMessage.attr('data')).propsData;
    if (hadRescue.includes(data.id)) {
        return
    }
    hadRescue.push(data.id)
    data.id += 'rescue'
    isShowPopup = false;
    // rescueMessage.attr('data', JSON.stringify(data))
    $('#popup').hide()
    var line = []
    if (data.target_type) {
        line = getAccidentLine(rescuejson.features, data.target_type).geometry.coordinates[0].map(item => {
            return ol.proj.transform(item, 'EPSG:4326', 'EPSG:3857')
        })
        line = line.slice(0, Math.floor(line.length / 2) + 1)
    } else if (data.index) {
        line = getLineData(data.index).line.map(item => {
            return ol.proj.transform(item, 'EPSG:4326', 'EPSG:3857')
        })
    } else {
        line = [data.rescuePoint, data.coordinate].map(item => {
            return ol.proj.transform(item, 'EPSG:4326', 'EPSG:3857')
        })
    }
    initAnimation({
        pointsList: line,
        // properties: data,
        isDrawHistory: true,
        carType: 'jy'
    })
})


// 带文字图片的样式
function textImageStyle(text) {
    var style = new ol.style.Style({
        text: new ol.style.Text({
            font: 'normal 12px 黑体',
            // 对其方式
            textAlign: 'center',
            // 基准线
            textBaseline: 'middle',
            offsetY: -35,
            offsetX: 0,
            backgroundFill: new ol.style.Stroke({
                color: 'rgba(0,0,255,0.7)',
            }),
            // 文本填充样式
            fill: new ol.style.Fill({
                color: 'rgba(236,218,20,1)'
            }),
            padding: [5, 5, 5, 5],
            text
        }),
        image: new ol.style.Icon({
            anchor: [0.5, 1],
            // scale: 2 / 3,
            src: '../imgs/carImgs/point.png',
        }),
    })
    return style
}
