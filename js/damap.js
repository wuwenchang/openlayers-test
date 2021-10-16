var map;
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
    var iconStyle = setMarkStyle(params);
    feature.setStyle(iconStyle);//图层设置 样式
    // vectorLayer == null ? null : map.removeLayer(vectorLayer);
    vectorLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [feature]//图层加进去
        })
    });
    map.addLayer(vectorLayer);//将图层加入map
}
function setMarkStyle(params) {
    var iconStyle = new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.4, 37],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            src: params.src || "../imgs/" + params.stylepng + ".png",
            activeSrc: params.activeSrc || "../imgs/" + params.stylepng + ".png",
        })
    });
    return iconStyle;
}

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
    var overlay = getOverlay();
    overlay.setPosition(data.coordinate);
    map.addOverlay(overlay);
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
    console.log(params);
    var coordinate = e.coordinate;
    let feature = map.forEachFeatureAtPixel(e.pixel, a => a);
    // console.log(feature)
    if (feature) {
        var overlay = getOverlay();
        overlay.setPosition(coordinate);
        map.addOverlay(overlay);
        $('#val1').val(feature.O.params.val1)
        $('#val2').val(feature.O.params.val2)
        $('#val3').val(feature.O.params.val3)
        $('#val4').val(feature.O.params.val4)
        $('#val5').val(feature.O.params.val5)
        $('#sendid').val(feature.O.params.val7)
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
        style: getCustomStyle({ color: lineBg[properties.id] || '#4ddc2c', text: properties.region || properties.name })
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
        style: getCustomStyle({ color: 'pink' })
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
 * @param {type} 
 *  pointIndex：交通事故在线路上的位置
 *  line1Radius：比较拥堵路线半径
 *  line2Radius：非常拥堵路线半径
 *  times：执行次数
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
        if (times) {
            startTraffic(pointsList, {
                pointIndex,
                line1Radius: line1Radius + 2,
                line2Radius: line2Radius + 2,
                times: times--
            })
        }
    }, 1000);
}
// 开始动画
function startAnimation(pointsList, carMarker, carType) {
    let pointIndex = 0;
    const position = new ol.geom.Point(pointsList[0]);
    var allLayers = map.getLayers().getArray()
    // console.log(allLayers)
    let pointLayer;
    for (let i = 0; i < allLayers.length; i++) {
        let item = allLayers[i];
        if (item.O.id === carMarker.id) {
            pointLayer = allLayers[i]
        }
    }
    // 初始化轨迹路线
    var roadLine2 = new ol.geom.LineString([])
    var roadLineSource2 = new ol.source.Vector({
        features: [new ol.Feature(roadLine2)]
    });
    var roadLineLayer2 = new ol.layer.Vector({
        id: 'trackLine',
        source: roadLineSource2,
        style: getCustomStyle({ color: 'gray' })
    });
    map.addLayer(roadLineLayer2);
    roadLine2.appendCoordinate(pointsList[0])
    if (pointLayer) {
        let startMove = setInterval(() => {
            pointIndex++
            position.setCoordinates(pointsList[pointIndex]);
            let rotation = Math.atan2(pointsList[pointIndex][1] - pointsList[pointIndex - 1][1], pointsList[pointIndex][0] - pointsList[pointIndex - 1][0])
            pointLayer.setStyle(getCarType(carType, rotation))
            carMarker.geoMarker.setGeometry(position);
            // 添加轨迹点位
            roadLine2.appendCoordinate(pointsList[pointIndex])
            if (pointIndex >= pointsList.length - 1) {
                clearInterval(startMove)
            }
        }, 500);
    }
    
}

// 汽车图标
function createGeoMarker(pointsList, carType) {
    let id = carType + 'geoMarker' + Math.floor(Math.random() * 10000);
    const geoMarker = new ol.Feature({
        geometry: new ol.geom.Point(pointsList[0])
    });
    const arrowLayer = new ol.layer.Vector({
        id,
        source: new ol.source.Vector({
            features: [geoMarker]
        }),
        style: getCarType(carType)
    });
    map.addLayer(arrowLayer);
    return {
        geoMarker,
        id
    } 
}

function getCarType(carType, rotation) {
    let imgsUrl = '../imgs/carImgs/' + carType + '.png';
    // let carTypes = ['arrow.png', 'b1.png', 'b2.png', 'tl7.png', 'tl2.png', 'tl10.png'];
    return new ol.style.Style({
        image: new ol.style.Icon({
            anchor: [0.75, 0.5],
            src: imgsUrl,
            rotation: rotation || -0.6
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
            placement: 'line',
            fill: new ol.style.Fill({
                color: '#4ddc2c'
            })
        })
    });
}
// 动画
function initAnimation (pointsList, carType, showStartEnd) {
    const carMarker = createGeoMarker(pointsList, carType)
    setTimeout(() => {
        // 开始动画
        startAnimation(pointsList, carMarker, carType)
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

function dealJson(railwayjson) {
    let lines = []
    let textLines = []
    for (let i = 0; i < railwayjson.features.length; i++) {
        let id = railwayjson.features[i].properties.id
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
        drawMainLine(lines, properties)
        if (i == 3) { // 第三条线动画
            initAnimation(lines, 'car')
        } else if (i === 39) {
            initAnimation(lines, 'train')
        } else if (i === 35) {
            initAnimation(lines, 'subway')
        } else if (i === 34) {
            initAnimation(lines, 'tram')  
        } else if (i == 0) { // 第一条线模拟交通事故
            setTimeout(() => {
                startTraffic(lines, {
                    pointIndex: 5,
                    line1Radius: 8,
                    line2Radius: 2,
                    times: 10
                })
            }, 1000);
        }
    }
    createHeatmap(railwayjson)
}

// 热力图
function createHeatmap (heatData) {
    // railwayjson
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