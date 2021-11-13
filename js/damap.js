var map;
var isShowPopup = false
var allCarMarker = []; // 所有交通方式数组，geoMarker, id, refreshTime
var markerStyles = {} // 图标类型库

function createMarkersStyles() {
    // 车图标
    var list = ['jy', 'subway', 'bus', 'car', 'train', 'tram']
    for (let i = 0; i < list.length; i++) {
        markerStyles[list[i]] = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 1],
                // anchor: [0.75, 0.5],
                scale: 0.5,
                src: '../imgs/carImgs/' + list[i] + '.png',
            }),
        }) 
    }
    // 其他图标
    var list2 = ['accident', 'tl1', 'tl2', 'tl3', 'tl4','tl5', 'tl6', 'tl7', 'tl8','tl9', 'tl10','tl11', 'tl12', 'tl13', 'tl14']
    for (let i = 0; i < list2.length; i++) {
        markerStyles[list2[i]] = new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 1],
                // anchor: [0.75, 0.5],
                scale: 0.5,
                src: '../imgs/' + list2[i] + '.png',
            }),
        }) 
    }
}

function addacpoint(id) {
    $.ajax({
        type: "POST",  //访问WebService使用post方式请求
        cache: false,
        async: false,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        url: getRootPath() + "/Service/GetTable.ashx", //调用WebService的地址和方法名称组合
        data: { tableName: "traffic_accident A,traffic_accident_type B", whereSql: "A.type=B.id and A.id=" + id },
        success: function (myjson) {
            var jsondatas = eval("(" + myjson + ")");
            console.log(jsondatas, 'damap')
            if (jsondatas.CODE > 0) {
                var mktable = jsondatas.Table;
                var maker = mktable[0];
                console.log(maker);
                locationbyMark(maker, true);
            }
            else {
                layer.msg(jsondatas.MSG, { icon: 2 });
            }
        },
        error: function () {
            layer.msg("系统错误", { icon: 2 })
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
            val1: maker.name,
            val2: maker.address,
            val3: maker.code,
            val4: maker.message,
            val5: timeFormat(maker.addtime),
            val6: maker.name1,
            val7: maker.id
        },
        stylepng: stylepng,
        activeSrc: activeSrc
    }
    if (isHistory) {
        var mydata = {
            data: obj
        }
        showAccidentPopup(mydata, locationMap);
        $(".footer").hide();
    }
    else {
        parent.postMessage(obj, '*');
    }
}

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
            map.addLayer(dalayer);//将图层加入map
        }
    }
    locationMap = map;
    if (getUrlParam("acid")) {
        addacpoint(getUrlParam("acid"));
    }
    return map;
}

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
var vectorLayer = null;
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
    feature.setStyle(markerStyles[params.stylepng])
    // vectorLayer == null ? null : map.removeLayer(vectorLayer);
    vectorLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [feature]//图层加进去
        })
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

function showAccidentPopup(res, map) {
    var data = res.data;
    // var overlay = getOverlay();
    // overlay.setPosition(data.coordinate);
    // map.addOverlay(overlay);
    if (map.getOverlays().C.length) {
        map.getOverlays().C[0].setPosition(data.coordinate)
    } else {
        var overlay = getOverlay();
        overlay.setPosition(data.coordinate);
        map.addOverlay(overlay);
    }
    $('#val1').val(data.data.val1)
    $('#val2').val(data.data.val2)
    $('#val3').val(data.data.val3)
    $('#val4').val(data.data.val4)
    $('#val5').val(data.data.val5)
    addMarker(data, map)
    map.getView().setCenter(ol.proj.transform(data.coordinate, 'EPSG:4326', 'EPSG:3857'))
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


function popupShow(e, map, params) {
    // console.log(params);
    var coordinate = e.coordinate;
    let feature = map.forEachFeatureAtPixel(e.pixel, a => a);
    // console.log(feature)
    if (feature) {
        if (feature.O.params.hideMessage) return
        if (map.getOverlays().C.length) {
            map.getOverlays().C[0].setPosition(coordinate)
        } else {
            var overlay = getOverlay();
            overlay.setPosition(coordinate);
            map.addOverlay(overlay);
        }
        var showType = feature.O.params.showType;
        var driverMessage = $('#driverMessage')
        var accidentMessage = $('#accidentMessage')
        var rescueMessage = $('#rescueMessage');
        isShowPopup = feature.O.params.id
        if (showType === 'accident' || !showType) {
            $('#val1').val(feature.O.params.val1)
            $('#val2').val(feature.O.params.val2)
            $('#val3').val(feature.O.params.val3)
            $('#val4').val(feature.O.params.val4)
            $('#val5').val(feature.O.params.val5)
            $('#sendid').val(feature.O.params.val7)
            if (driverMessage) driverMessage.hide()
            if (accidentMessage) {
                accidentMessage.show()
                accidentMessage.attr('data', JSON.stringify(feature.O.params))
            }
            if (rescueMessage) rescueMessage.hide()
        } else if (showType === 'rescue') {
            $('#val21').val(feature.O.params.val)
            if (driverMessage) driverMessage.hide()
            if (accidentMessage) accidentMessage.hide()
            if (rescueMessage) rescueMessage.show()
        } else if (showType === 'car') {
            // $('#val11').val(feature.O.params.val1)
            // $('#val12').val(feature.O.params.val2)
            // $('#val13').val(feature.O.params.val3)
            // $('#val14').val(feature.O.params.val4)
            // $('#val15').val(feature.O.params.val5)
            if (driverMessage) driverMessage.show()
            if (accidentMessage) accidentMessage.hide()
            if (rescueMessage) rescueMessage.hide()
        }
        document.getElementById("popup").style.display = "block";
        
    }
}
//生成动态模拟运动轨迹
// 绘制主路
function drawMainLine(pointsList, properties) {
    var lineBg = ['#4ddc2c', '#5298fe', '#fe2d07', '#bef', '#aff', '#e3a']
    var roadLine = new ol.geom.LineString(pointsList);
    var roadLineSource = new ol.source.Vector({
        features: [new ol.Feature(roadLine)]
    });
    var id = 'mainLine' + properties.text;
    var roadLineLayer = new ol.layer.Vector({
        id,
        properties,
        source: roadLineSource,
        style: getCustomStyle({ color: lineBg[0] || '#4ddc2c', text: properties.region || properties.name || properties.XLMC })
    });
    hadMarkerIds.push(id)
    map.addLayer(roadLineLayer);
}
// 绘制轨迹路线
function drawTrackLine(pointsList, i) {
    var roadLine2 = new ol.geom.LineString([])
    var roadLineSource2 = new ol.source.Vector({
        features: [new ol.Feature(roadLine2)]
    });
    var id = 'trackLine';
    var roadLineLayer2 = new ol.layer.Vector({
        id,
        source: roadLineSource2,
        style: getCustomStyle({ color: 'gray' })
    });
    hadMarkerIds.push(id)
    map.addLayer(roadLineLayer2);
}
// 添加起点、终点事件
function addSEMarker(params) {
    // let coordinate = ol.proj.transform(params.coordinate, 'EPSG:4326', 'EPSG:3857')
    var feature = new ol.Feature({
        type: params.isStart ? 'startImg' : 'endImg',
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
function trafficLines(params, pointsList) {
    removeLayer('trafficLine1')
    removeLayer('trafficLine2')
    // 较堵塞
    var trafficLine1 = new ol.geom.LineString(pointsList.slice(params.start1, params.end1));
    var trafficLineSource2 = new ol.source.Vector({
        features: [new ol.Feature(trafficLine1)]
    });
    var trafficLayer1 = new ol.layer.Vector({
        id: 'trafficLine1',
        source: trafficLineSource2,
        style: getCustomStyle({ color: '#ff0' })
    });
    hadMarkerIds.push('trafficLine1')
    map.addLayer(trafficLayer1);
    // 非常堵塞
    var trafficLine2 = new ol.geom.LineString(pointsList.slice(params.start2, params.end2));
    var trafficLineSource2 = new ol.source.Vector({
        features: [new ol.Feature(trafficLine2)]
    });
    var trafficLayer2 = new ol.layer.Vector({
        id: 'trafficLine2',
        source: trafficLineSource2,
        style: getCustomStyle({ color: 'red' })
    });
    hadMarkerIds.push('trafficLine2')
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
 * @param {number} times：执行次数
 * */
function startTraffic(pointsList, params) {
    let { pointIndex, line1Radius, line2Radius, times } = params
    trafficLines({
        start1: pointIndex - line1Radius > 0 ? pointIndex - line1Radius : 0,
        end1: pointIndex + line1Radius >= pointsList.length - 1 ? pointsList.length - 1 : pointIndex + line1Radius,
        start2: pointIndex - line2Radius > 0 ? pointIndex - line2Radius : 0,
        end2: pointIndex + line2Radius >= pointsList.length - 1 ? pointsList.length - 1 : pointIndex + line2Radius,
    }, pointsList)
    setTimeout(() => {
        if (times > 0) {
            startTraffic(pointsList, {
                pointIndex,
                line1Radius: line1Radius * 2,
                line2Radius: line2Radius * 2,
                times: times - 1
            })
        }
    }, 1000);
}
// 开始动画
function startAnimation(params) {
    let {pointsList, carMarker, carType, properties, isDrawHistory, endIndex} = params
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
            let rotation = Math.atan2(allPoint[pointIndex][1] - allPoint[pointIndex - 1][1], allPoint[pointIndex][0] - allPoint[pointIndex - 1][0])
            // pointLayer.setStyle(getCarType(carType, rotation))
            pointLayer.setStyle(markerStyles[carType])
            carMarker.geoMarker.setGeometry(position);
            if (isDrawHistory) {
                // 添加轨迹点位
                roadLine2.appendCoordinate(allPoint[pointIndex])
            }
            if (isShowPopup === properties.id && !properties.hideMessage && map.getOverlays().C.length) {
                map.getOverlays().C[0].setPosition(allPoint[pointIndex])
            }
            if (pointIndex >= allPoint.length - 1) {
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
            newList[i] =[cur[0] - (cur[0] - next[0]) * i / lineLength, cur[1] - (cur[1] - next[1]) * i / lineLength]
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
function initAnimation (params) {
    const {pointsList, properties, carType, showStartEnd} = params
    const carMarker = createGeoMarker(pointsList, properties, carType)
    allCarMarker.push(carMarker)
    setTimeout(() => {
        // 开始动画
        startAnimation({...params, carMarker})
        if (showStartEnd) {
            // 起始点
            addSEMarker({
                coordinate: pointsList[0],
                isStart: true,
                id: 'startImg'
            })
            // 终点
            addSEMarker({
                coordinate: pointsList[pointsList.length - 1],
                isStart: false,
                id: 'endImg'
            })
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
            if (data.trafficIndex === i) allPoint.push(line[line.length - 1])
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
    initAnimation({
        pointsList: line, // 线路点
        properties: data, // 参数
        carType: data.carType,  // 车辆类型
        isDrawHistory: true, // 是否绘制轨迹
        endIndex: allPoint.length - 1 - trafficObj.line1Radius * Math.pow(2, trafficObj.times) // 停止点
    })
    // 交通事故
    startTraffic(extensionPoint, {
        pointIndex: allPoint.length - 1,
        line1Radius: trafficObj.line1Radius,
        line2Radius: trafficObj.line2Radius,
        times: trafficObj.times
    })
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
// 初始化的函数
function init() {
    var railwayJsonData = dealJson(roadjson)
    for (let i = 0; i < railwayJsonData.length; i++) {
        let properties = railwayJsonData[i][0].properties
        let lines = railwayJsonData[i].map(item => {
            return ol.proj.transform(item.geometry.coordinates, 'EPSG:4326', 'EPSG:3857')
        });
        // 绘制线条
        // drawMainLine(lines, properties)
        if (properties.name === '机场高速') {
            // initAnimation({
            //     isDrawHistory: true, 
            //     pointsList: lines, 
            //     properties, 
            //     carType: 'bus'
            // })
            // let newLine = JSON.parse(JSON.stringify(lines)).reverse()
            // initAnimation({
            //     isDrawHistory: true,
            //     pointsList: newLine, 
            //     properties, 
            //     carType: 'bus'
            // })
        } else if (properties.name === '四环路') {
            initAnimation({
                isDrawHistory: true, 
                pointsList: lines, 
                properties, 
                carType: 'bus'
            })
            let newLine = JSON.parse(JSON.stringify(lines)).reverse()
            initAnimation({
                isDrawHistory: true,
                pointsList: newLine, 
                properties, 
                carType: 'bus'
            })
        } else if (properties.name === '学院路') {
            initAnimation({
                isDrawHistory: true, 
                pointsList: lines, 
                properties, 
                carType: 'bus'
            })
            let newLine = JSON.parse(JSON.stringify(lines)).reverse()
            initAnimation({
                isDrawHistory: true,
                pointsList: newLine, 
                properties, 
                carType: 'bus'
            })
        }
    }
    // createHeatmap(railwayjson)
}

function beginToSimulate(data, map) {
    // 救援点
    addMarker({
        data: {
            val: data.data.rescueName,
            showType: 'rescue'
        },
        coordinate: data.line[0],
        stylepng: 'redCross'
    }, map)
    //事故点
    addMarker({
        data: {
            val1: data.maker.name,
            val2: data.maker.address,
            val3: data.maker.code,
            val4: data.maker.message,
            val5: timeFormat(data.maker.addtime),
            val6: data.maker.name1,
            target_type: data.maker.target_type,
            index: data.trafficData.index,
            id: data.data.id,
            showType: 'accident'
        },
        coordinate: data.line[data.data.trafficIndex],
        stylepng: 'accident'
    }, map)
    map.getView().setCenter(ol.proj.transform(data.line[data.data.trafficIndex], 'EPSG:4326', 'EPSG:3857'))
    map.getView().setZoom(13)
    trafficRoute(data.data, data.line, data.trafficData)
}

// 热力图
function createHeatmap (heatData) {
    var vectorSource = new ol.source.Vector({ 
        features: (new ol.format.GeoJSON()).readFeatures(heatData,{
            dataProjection : 'EPSG:4326',
            featureProjection : 'EPSG:3857'
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

function updateAccident(params) {
    $.ajax({
        cache: false,
        async: false,
        contentType: "application/x-www-form-urlencoded; charset=utf-8",
        url: getRootPath() + "/Service/AddAccident.ashx", //调用WebService的地址和方法名称组合
        data: params,
        dataType: "json",
        success: function (result) { 
            // console.log(result)
            var jsondatas = eval("(" + result + ")");
            console.log(jsondatas)
        }
    })
}

function createAccident(rescuejson, accidentCarData) {
    var data = rescuejson.features;
    var i = 0;
    var accidentCarType  = {
        1: '社会车辆',
        2: '公交车',
        3: '电动汽车',
        4: '奥运小巴',
        5: '地铁路线',
        6: '高铁车组'
    }
    // 车类型对应的故障类型
    var CarErrorType = {
        1: ['直行事故', '追尾事故', '左转弯事故', '超车事故', '窄道事故', '弯道事故', '坡道事故', '占用车道事故'],
        2: ['公交车侧翻', '直行事故', '追尾事故', '左转弯事故','超车事故', '窄道事故', '弯道事故', '坡道事故', '占用车道事故'],
        3: ['通信故障', '通信信号设备故障', '线路设备故障'],
        4: ['直行事故', '追尾事故', '左转弯事故', '超车事故', '窄道事故', '弯道事故', '坡道事故', '占用车道事故'],
        5: ['信号故障', '路线故障', '电力故障', '地面轨道故障'],
        6: ['电力故障', '地面轨道故障', '占用车道事故']
    }
    var accidentType = [
        '', '公交车侧翻', '直行事故', '追尾事故', '左转弯事故', 
        '超车事故', '窄道事故', '弯道事故', '坡道事故', '占用车道事故', '信号故障', '路线故障', '电力故障', '地面轨道故障'
    ]
    var time = setInterval(function() {
        i++
        var target = Math.floor(1 + Math.random() * 6)
        var name = CarErrorType[target][Math.floor(Math.random() * CarErrorType[target].length)]
        var accidentPoint = data[i].geometry.coordinates[Math.floor(data[i].geometry.coordinates.length / 2)]
        var obj = { 
            name: name, // 事故名称
            address: data[i].properties.XLMC.slice(0, -3), // 事故地址
            type: accidentCarData.type, // 事故类型
            message: data[i].properties.XLMC.slice(0, -3) + name,  // 描述
            code: accidentCarData.code,
            // code: '京A' + (10000 + Math.floor(Math.random() * 90000)), 
            xaxis: accidentPoint[0][0],
            yaxis: accidentPoint[0][1],
            // line: data[i].geometry.coordinates,
            target_type: data[i].properties.Id, // 救援路线
            target: accidentCarData.type // 事故对象
        }
        // console.log(obj)
        updateAccident(obj)
        if (i === data.length - 1) {
            clearInterval(time)
        }
    }, accidentCarData.time || 10000)
}

// 获取事故路线
function getAccidentLine(lines, type) {
    for (let i = 0; i < lines.length; i++) {
        if (type == lines[i].properties.Id) {
            return lines[i]
        }
    }
}
