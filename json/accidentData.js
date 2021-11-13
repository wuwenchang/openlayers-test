var accidentjson = [
  { 
    name: '车辆追尾', 
    address: '大屯路', 
    type: 1, 
    message: '大屯路车辆追尾', 
    code: '京A86567', 
    xaxis: 116.41715149117482, 
    yaxis: 39.997193676324756, 
    line: [[116.412390048991824, 40.002776056815158], [116.417315678836303, 40.003071594605828], [116.417775404288449, 40.001396880458707], [116.41715149117482, 39.997193676324756], [116.41708581611023, 39.988754430524565], [116.431074604868527, 39.989181318444416]],
    target: 1 
  },
  { 
    name: '机场高速车辆剐蹭', 
    address: '机场线路高速车辆剐蹭', 
    type: 1, 
    message: '机场线路高速车辆剐蹭', 
    code: '京A34563',
    line: [[116.580695043521388, 40.043632328469123], [116.575269234150326, 40.038051495973193], [116.562402314784691, 40.031424257384266], [116.557402819007081, 40.029912781916615], [116.51961593231583, 40.017084618332206], [116.513259984195457, 40.011445652164433], [116.493475157881733, 39.99373426014607]], 
    xaxis: 116.557402819007081, 
    yaxis: 40.029912781916615,
    target: 1 
  },
  { 
    name: '奥运大巴故障', 
    address: '延庆延康路', 
    type: 1, 
    message: '延庆延康路奥运大巴故障', 
    code: '京A12568', 
    line: [[115.936518540426718, 40.412753916708709], [115.948623326816985, 40.421952082658763], [115.953663921757624, 40.426955884935587], [115.954105433723228, 40.42717664091839], [115.95447336036122, 40.428574762142802], 
    [115.954399775033622, 40.430377602669012], [115.956018652240829, 40.432548369833221], [115.966357390768692, 40.434535173678434]],
    xaxis: 115.954399775033622, 
    yaxis: 40.430377602669012,
    target: 4
  },
  { 
    name: '多车追尾', 
    address: '延庆110国道', 
    type: 1, 
    message: '延庆110国道多车追尾', 
    code: '京A54226',
    line: [[115.918301572762729, 40.513827963250804], [115.911973234589098, 40.519273277493227], [115.908735480174684, 40.519273277493227], [115.904320360518668, 40.520597813390033], [115.900346752828256, 40.520892154700434], [115.892399537447417, 40.519861960114028], [115.884305151411382, 40.51794874159642], [115.880773055686561, 40.516918547010015], [115.859138969372069, 40.511178891457192], [115.844716245162402, 40.507941137042778], [115.832501080780744, 40.504409041317963], [115.826467083917507, 40.503084505421157], [115.821904793606294, 40.503231676076354], [115.819255721812681, 40.504114700007563], [115.81160284774225, 40.504409041317963], [115.809395287914242, 40.50573357721477], [115.803508461706215, 40.506910942456372], 
    [115.795414075670166, 40.507793966387574], [115.774074330666082, 40.504850553283561], [115.76627428594044, 40.504409041317963]], 
    xaxis: 115.795414075670166, 
    yaxis: 40.507793966387574, 
    target: 1 
  },
  { 
    name: '电动汽车故障', 
    address: '', 
    type: 1, 
    message: '', 
    code: '京A221133', 
    line: [[115.441146714104235, 40.921840208462733], [115.435774985189411, 40.921766623135134], [115.431874962826598, 40.922134549773133], [115.427386257842969, 40.920515672565926], [115.423118308842149, 40.921472281824734], 
    [115.420542822376134, 40.921251525841932], [115.418703189186132, 40.921766623135134], [115.405163488907675, 40.914849602340702], [115.403544611700468, 40.912862798495496], [115.398099297458032, 40.910728823995086], [115.395670981647228, 40.910728823995086], [115.393904933784825, 40.911170335960684], [115.392433227232814, 40.91705716216871], [115.393684177802015, 40.923827012307946], [115.395450225664419, 40.928315717291568], [115.395229469681624, 40.934570470137594], [115.382719963989572, 40.959147969556106]],
    xaxis: 115.420542822376134, 
    yaxis: 40.921251525841932, 
    target: 3
  },
  { 
    name: '公交车与私家车发生剐蹭', 
    address: '故宫紫禁城两车发生追尾', 
    type: 1, 
    line: [[116.467973853837833, 39.99702850154992], [116.467663807588053, 40.008732747478902], [116.454021772597983, 40.008422701229129]],
    message: '测试交通数据', 
    code: '京A888888', 
    xaxis: 116.467663807588053, 
    yaxis: 40.008732747478902, 
    target: 1 
  },
  { 
    name: '电动汽车起火', 
    address: '故宫紫禁城两车发生追尾', 
    type: 1, 
    message: '测试交通数据', 
    code: '京A888888', 
    xaxis: 116.411, 
    yaxis: 39.96, 
    target: 1 
  },
  { 
    name: '公交车抛锚', 
    address: '故宫紫禁城两车发生追尾', 
    type: 1, 
    message: '测试交通数据', 
    code: '京A888888', 
    xaxis: 116.411, 
    yaxis: 39.96, 
    target: 1 
  },
  { 
    name: '奥运小巴发生故障', 
    address: '故宫紫禁城两车发生追尾', 
    type: 1, 
    message: '测试交通数据', 
    code: '京A888888', 
    xaxis: 116.411, 
    yaxis: 39.96, 
    target: 1 
  },
  { 
    name: '地铁八号线北辰站发生故障', 
    address: '故宫紫禁城两车发生追尾', 
    type: 1, 
    message: '测试交通数据', 
    code: '京A888888', 
    xaxis: 116.411, 
    yaxis: 39.96, 
    target: 1 
  },
  { 
    name: '奥运大巴发生故障', 
    address: '故宫紫禁城两车发生追尾', 
    type: 1, 
    message: '测试交通数据', 
    code: '京A888888', 
    xaxis: 116.411, 
    yaxis: 39.96, 
    target: 1 
  },
  { 
    name: '车辆追尾', 
    address: '故宫紫禁城两车发生追尾', 
    type: 1, 
    message: '测试交通数据', 
    code: '京A888888', 
    xaxis: 116.411, 
    yaxis: 39.96, 
    target: 1 
  },
  { 
    name: '车辆追尾', 
    address: '故宫紫禁城两车发生追尾', 
    type: 1, 
    message: '测试交通数据', 
    code: '京A888888', 
    xaxis: 116.411, 
    yaxis: 39.96, 
    target: 1 
  },
  { 
    name: '车辆追尾', 
    address: '故宫紫禁城两车发生追尾', 
    type: 1, 
    message: '测试交通数据', 
    code: '京A888888', 
    xaxis: 116.411, 
    yaxis: 39.96, 
    target: 1 
  },
  { 
    name: '车辆追尾', 
    address: '故宫紫禁城两车发生追尾', 
    type: 1, 
    message: '测试交通数据', 
    code: '京A888888', 
    xaxis: 116.411, 
    yaxis: 39.96, 
    target: 1 
  },
  { 
    name: '车辆追尾', 
    address: '故宫紫禁城两车发生追尾', 
    type: 1, 
    message: '测试交通数据', 
    code: '京A888888', 
    xaxis: 116.411, 
    yaxis: 39.96, 
    target: 1 
  },
  { 
    name: '车辆追尾', 
    address: '故宫紫禁城两车发生追尾', 
    type: 1, 
    message: '测试交通数据', 
    code: '京A888888', 
    xaxis: 116.411, 
    yaxis: 39.96, 
    target: 1 
  },
  { 
    name: '车辆追尾', 
    address: '故宫紫禁城两车发生追尾', 
    type: 1, 
    message: '测试交通数据', 
    code: '京A888888', 
    xaxis: 116.411, 
    yaxis: 39.96, 
    target: 1 
  },
  { 
    name: '车辆追尾', 
    address: '故宫紫禁城两车发生追尾', 
    type: 1, 
    message: '测试交通数据', 
    code: '京A888888', 
    xaxis: 116.411, 
    yaxis: 39.96, 
    target: 1 
  },
  { 
    name: '车辆追尾', 
    address: '故宫紫禁城两车发生追尾', 
    type: 1, 
    message: '测试交通数据', 
    code: '京A888888', 
    xaxis: 116.411, 
    yaxis: 39.96, 
    target: 1 
  },
  { 
    name: '车辆追尾', 
    address: '故宫紫禁城两车发生追尾', 
    type: 1, 
    message: '测试交通数据', 
    code: '京A888888', 
    xaxis: 116.411, 
    yaxis: 39.96, 
    target: 1 
  },
  { 
    name: '车辆追尾', 
    address: '故宫紫禁城两车发生追尾', 
    type: 1, 
    message: '测试交通数据', 
    code: '京A888888', 
    xaxis: 116.411, 
    yaxis: 39.96, 
    target: 1 
  },
  { 
    name: '车辆追尾', 
    address: '故宫紫禁城两车发生追尾', 
    type: 1, 
    message: '测试交通数据', 
    code: '京A888888', 
    xaxis: 116.411, 
    yaxis: 39.96, 
    target: 1 
  },
  { 
    name: '车辆追尾', 
    address: '故宫紫禁城两车发生追尾', 
    type: 1, 
    message: '测试交通数据', 
    code: '京A888888', 
    xaxis: 116.411, 
    yaxis: 39.96, 
    target: 1 
  },
  { 
    name: '车辆追尾', 
    address: '故宫紫禁城两车发生追尾', 
    type: 1, 
    message: '测试交通数据', 
    code: '京A888888', 
    xaxis: 116.411, 
    yaxis: 39.96, 
    target: 1 
  },
  { 
    name: '车辆追尾', 
    address: '故宫紫禁城两车发生追尾', 
    type: 1, 
    message: '测试交通数据', 
    code: '京A888888', 
    xaxis: 116.411, 
    yaxis: 39.96, 
    target: 1 
  },
  { 
    name: '车辆追尾', 
    address: '故宫紫禁城两车发生追尾', 
    type: 1, 
    message: '测试交通数据', 
    code: '京A888888', 
    xaxis: 116.411, 
    yaxis: 39.96, 
    target: 1 
  },
]
