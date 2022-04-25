// 花园路
const line1 = [
  [116.36351058469734, 39.98175969365036],
  [116.36565082865525, 39.98180588049178],
  [116.3656817519265, 39.981570681836814],
  [116.36575771850165, 39.97633079539992],
  [116.3655740086263, 39.96771835660297],
  [116.38065862494115, 39.967892293560425],
  [116.38052006762598, 39.96787526208985],
  [116.39459219740125, 39.968453580710246],
  [116.4019505847356, 39.96846195660376],
  [116.40217444077406, 39.96324268257271],
  [116.40255681956813, 39.963142917967275],
  [116.40244106589556, 39.96470972071441],
  [116.40235080900398, 39.96562746201184]
]
// 和平北街
const line2 = [
  [116.41657287095131, 39.95921675299837],
  [116.41425577395577, 39.95915940748574],
  [116.41408593871066, 39.96195027031422],
  [116.40781222838355, 39.96198080429926],
  [116.40464944832783, 39.96209279629147],
  [116.40258083866658, 39.96319610283402],
  [116.40244106589556, 39.96470972071441],
  [116.40235080900398, 39.96562746201184]
]
// 来广营西路-北苑东路
const line3 = [
  [116.46242717968914, 40.02084848366508],
  [116.46228716066223, 40.02047472430627],
  [116.45734214676443, 40.02061991761272],
  [116.45161537572936, 40.02090018968718],
  [116.44171604927836, 40.02151603915868],
  [116.44164665933151, 40.024701597286196],
  [116.4416157419778, 40.02775443200386],
  [116.4417248393544, 40.028523533333896]
]
// 北苑路北-北苑东路
const line4 = [
  [116.41700552834541, 40.03038401056048],
  [116.41808381189021, 40.03038782967633],
  [116.41821420925089, 40.02846874361339],
  [116.42346932090926, 40.028397147066556],
  [116.42751296118446, 40.02839529923111],
  [116.42874384903696, 40.02773755432031],
  [116.42913709469994, 40.027630307495116],
  [116.42920029019744, 40.02641911269964],
  [116.43283419853262, 40.02636865138879],
  [116.43702842332333, 40.02623894970961],
  [116.441503560575, 40.02619162562408],
  [116.4417248393544, 40.028523533333896]
]
var newPoint = []

let random = Math.random()

function rescueFun(index) {
  var accidentMessage = $('#accidentMessage')
  var data = JSON.parse(accidentMessage.attr('data'));
  data.showType = 'hide'
  var line = []
  if (data.error) {
    line = data.jyLines[index].line.map(item => ol.proj.transform(item, 'EPSG:4326', 'EPSG:3857'))
    // console.log(random + 'line' + index, 'sss');
    drawTrackLine(line, 'gray', data.id + 'grayline');
    // if (index) {
    //   removeLayer('marker0')
    // } else {
    //   removeLayer('marker1')
    // }
    initAnimation({
      pointsList: line,
      properties: data,
      isDrawHistory: true,
      carType: 'jy'
    })
  } else {
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
      data.rescuePoint = data.rescuePoint || newPoint
      line = [data.rescuePoint, data.coordinate].map(item => {
        return ol.proj.transform(item, 'EPSG:4326', 'EPSG:3857')
      })
    }
    initAnimation({
      pointsList: line,
      properties: data,
      isDrawHistory: true,
      carType: 'jy'
    })
    drawTrackLine(line, 'gray', data.id + 'trackLine')
  }
  closeyuan()
  map && map.getView().setCenter(line[0])
  map && map.getView().setZoom(13)
}
let id2 = 'bus' + Math.random()

function createNewRescued() {
  const changeCar1 = line1.slice(line1.length - 2).map(item => {
    return ol.proj.transform(item, 'EPSG:4326', 'EPSG:3857')
  })
  const changeCar2 = line3.slice(line3.length - 2).map(item => {
    return ol.proj.transform(item, 'EPSG:4326', 'EPSG:3857')
  })
  initAnimation({
    pointsList: changeCar2,
    error: true,
    properties: {
      id: random + 'line1',
      error: true,
      jyLines: [{
        line: line4,
        addr: '北苑路北'
      }, {
        line: line3,
        addr: '来广营西路'
      }],
      val1: '车辆剐蹭',
      val2: '北苑东路',
      val3: '小轿车',
      val4: '北苑东路公交站',
      val5: 30 + Math.ceil(Math.random() * 25) + '分钟',
      val6: 40 + Math.ceil(Math.random() * 50) + '分钟',
      addr: '北苑东路',
      showType: 'car'
    },
    isDrawHistory: true,
    carType: 'car'
  })

  initAnimation({
    pointsList: changeCar1,
    error: true,
    properties: {
      id: random + 'line2',
      error: true,
      jyLines: [{
        line: line2,
        addr: '和平里北街'
      }, {
        line: line1,
        addr: '花园北路'
      }],
      val1: '车辆追尾',
      val2: '安华路',
      val3: '小轿车',
      val4: '安华路公交站',
      val5: 15 + Math.ceil(Math.random() * 25) + '分钟',
      val6: 20 + Math.ceil(Math.random() * 50) + '分钟',
      addr: '安华路',
      showType: 'car'
    },
    isDrawHistory: true,
    carType: 'car'
  })
}

function showyuan() {
  $("#loading").show();
  $('#popup').hide()
  var accidentMessage = $('#accidentMessage')
  var data = JSON.parse(accidentMessage.attr('data'));
  let line1 = data.jyLines && data.jyLines[0].line.map(item => ol.proj.transform(item, 'EPSG:4326', 'EPSG:3857'))
  // let line2 = data.jyLines && data.jyLines[1].line.map(item => ol.proj.transform(item, 'EPSG:4326', 'EPSG:3857'))

  if (data.error) {
    removeLayer('marker0')
    removeLayer('marker1')
  }
  setTimeout(function () {
    $("#yuan").show();
    $("#loading").hide();
    $("#yuan p").eq(0).text($("#popup input").eq(1).val() + "救援方案");
    if (data.error) {
      $("#idea2").show()
      $("#idea1 span").eq(0).text(data.jyLines[0].addr)
      $("#idea2 span").eq(0).text(data.jyLines[1].addr)
      addMarker({
        coordinate: data.jyLines[0].line[0],
        data: {
          id: random + (data.addr === '安华路' ? 'line2marker0': 'line1marker0'),
          data: data,
          error: true,
          addr: data.jyLines[0].addr,
          line: data.jyLines[0].line
        },
        style: textImageStyle(data.jyLines[0].addr)
      }, map)
      addMarker({
        coordinate: data.jyLines[1].line[0],
        data: {
          id: random + (data.addr === '安华路' ? 'line2marker0': 'line1marker0'),
          data: data,
          error: true,
          addr: data.jyLines[1].addr,
          line: data.jyLines[1].line
        },
        style: textImageStyle(data.jyLines[1].addr)
      }, map)
      map && map.getView().setCenter(line1[line1.length - 1])
    } else {
      $("#idea1 span").eq(0).text(data.rescueName || data.val1)
      $("#idea2").hide()
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
        newPoint = [data.coordinate[0] - 0.006 + 0.004 * Math.random(), data.coordinate[1] - 0.006 + 0.004 * Math.random()]
        data.rescuePoint = data.rescuePoint || newPoint
        line = [data.rescuePoint, data.coordinate].map(item => {
          return ol.proj.transform(item, 'EPSG:4326', 'EPSG:3857')
        })
      }
      addMarker({
        coordinate: data.rescuePoint,
        data: {
          id: data.id + 'marker',
          data: data,
          addr: data.rescueName || data.val1,
          error: true,
          line
        },
        style: textImageStyle(data.rescueName || data.val1)
      }, map)
      map && map.getView().setCenter(line[line.length - 1])
    }
    map && map.getView().setZoom(13)
  }, 3000);

}
function closeyuan() {
  $("#yuan").hide()
}
function closediv(e) {
    $(e).parent().hide();
}
