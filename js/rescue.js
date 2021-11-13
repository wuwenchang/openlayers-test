// function dealRescueJson(data) {
//   let lines = []
//   let textLines = []
//   for (let i = 0; i < data.features.length; i++) {
//       let id = data.features[i].properties.id
//       // let text = data.features[i].properties.region || data.features[i].properties.name;
//       if (textLines.indexOf(id) == -1) {
//           textLines.push(id)
//           lines.push([data.features[i]])
//       } else {
//           lines[lines.length - 1].push(data.features[i])
//       }
//   }
//   return lines
// }

function rescueInit() {
    // var rescuejson = dealJson(rescuejson)
    var vectorSource = new ol.source.Vector({ 
        features: (new ol.format.GeoJSON()).readFeatures(rescuejson, {
            dataProjection : 'EPSG:4326',
            featureProjection : 'EPSG:3857'
        })
    });
    var roadLineLayer = new ol.layer.Vector({
        // id: 'trackLine',
        source: vectorSource,
        style: getCustomStyle({ color: '#5298fe' })
    });
    map.addLayer(roadLineLayer)
}