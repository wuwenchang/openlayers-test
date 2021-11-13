function getLineData(index) {
  switch (index) {
    case 0:
      var obj = {
        line: [
          [116.580695043521388, 40.043632328469123], 
          [116.575269234150326, 40.038051495973193], 
          [116.562402314784691, 40.031424257384266], 
          [116.557402819007081, 40.029912781916615], 
          [116.51961593231583, 40.017084618332206], 
          [116.513259984195457, 40.011445652164433], 
          [116.493475157881733, 39.99373426014607],
          [116.445796534696001, 39.951052392758065]
        ],
        data: {
          rescueName: '机场救援点',
          id: 'bus0',
          carType: 'car',
          hideMessage: true, // 隐藏货车信息
          refreshTime: 0.5,
          trafficIndex: 6,
          showType: 'car'
        },
        trafficData: {
          index,
          line1Radius: 5,
          line2Radius: 2,
          times: 5
        }
      }
      return obj
    case 1:
      var obj = {
        line: [
          [116.310257114166632, 39.942420672454197], 
          [116.30244178148007, 39.9451790251671], 
          [116.295480224633209, 39.947543327492447], 
          [116.292984572178682, 39.947740352686232], 
          [116.292393496597342, 39.947740352686232], 
          [116.290751619982515, 39.947740352686232], 
          [116.288452992721759, 39.947083602040301], 
          [116.277813632257704, 39.947083602040301], 
          [116.274923929415607, 39.946886576846516], 
          [116.274661229157246, 39.939530969612107], 
          [116.274989604480197, 39.929679709923157]
        ],
        data: {
          rescueName: '紫竹院救援点',
          id: 'bus1',
          carType: 'bus',
          hideMessage: true, // 隐藏货车信息
          refreshTime: 0.5,
          trafficIndex: 6,
          showType: 'car'
        },
        trafficData: {
          index,
          line1Radius: 5,
          line2Radius: 2,
          times: 4
        }
      }
      return obj
    case 2:
      var obj = {
        line: [
          [116.405412073378798, 39.998728830959607], 
          [116.403113446118041, 39.998269105507454], 
          [116.400749143792694, 39.998236267975159], 
          [116.39070085890998, 39.997907892652194], 
          [116.387121567889665, 39.997907892652194], 
          [116.386793192566685, 40.002242446915325], 
          [116.380127173510502, 40.001782721463186], 
          [116.376038900739559, 40.001815558995489], 
          [116.375119449835253, 40.012044450305815]
        ],
        data: {
          rescueName: '大屯路救援点',
          id: 'bus2',
          carType: 'car',
          hideMessage: true, // 隐藏货车信息
          refreshTime: 0.1,
          trafficIndex: 7,
          showType: 'car'
        },
        trafficData: {
          index,
          line1Radius: 5,
          line2Radius: 2,
          times: 4
        }
      }
      return obj
    case 3:
      var obj = {
        line: [
          [116.317690537396658, 40.029797475544207], 
          [116.315666940887652, 40.035794679743638], 
          [116.314857502284042, 40.037303178959448], 
          [116.316513172155055, 40.037707898261253], 
          [116.314195234335642, 40.039915458089254], 
          [116.313017869094026, 40.042159810581069], 
          [116.309964077998615, 40.046501344909494], 
          [116.296240414401197, 40.068797699172407], 
          [116.288955466968744, 40.079541157002062], 
          [116.253487339065387, 40.1045601683862]
        ],
        data: {
          rescueName: '上地救援点',
          id: 'bus3',
          carType: 'car',
          hideMessage: true, // 隐藏货车信息
          refreshTime: 0.1,
          trafficIndex: 8,
          showType: 'car'
        },
        trafficData: {
          index,
          line1Radius: 5,
          line2Radius: 2,
          times: 4
        }
      }
      return obj
    case 4:
      var obj = {
        line: [
          [116.38023389549052, 39.982186924065253], 
          [116.379051744327853, 39.985536352359496], 
          [116.379445794715409, 39.987243904038912], 
          [116.38135037158861, 39.987769304555655], 
          [116.383320623526387, 39.987834979620246], 
          [116.399082639028705, 39.988426055201586], 
          [116.411101175849225, 39.988623080395364]
        ],
        data: {
          rescueName: '健德门救援点',
          id: 'bus4',
          carType: 'car',
          hideMessage: true, // 隐藏货车信息
          refreshTime: 0.1,
          trafficIndex: 5,
          showType: 'car'
        },
        trafficData: {
          index,
          line1Radius: 5,
          line2Radius: 2,
          times: 4
        }
      }
      return obj
  }
}