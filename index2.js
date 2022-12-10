var width = 975, height = 610, active = d3.select(null), centered;
const projection = d3.geoAlbersUsa().scale(1300).translate([width/2, height/2]);
const geo_path = d3.geoPath();

function pathContains(feature, point) {
  const coordinates = feature.geometry.coordinates;
  const n = coordinates.length;
  if (!!point) {
    for (let i = 0; i < n; i++) {
      if (d3.polygonContains(coordinates[i][0], point)) return true;
    }
  }
  return false;
}
var svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr('id', 'map');
var points = [];
function readData() {
  d3.csv('MassShootingsDatabase.csv', function(csv) {
    points.push(projection([csv.Longitude, csv.Latitude]));
  });
}
readData();

console.log(points)
d3.json("https://cdn.jsdelivr.net/npm/us-atlas@3/counties-albers-10m.json")
  .then(json => {
    const geo_shapes = topojson.feature(json, json.objects.states);
    d3.select("#map")
      .selectAll("path")
      .data(geo_shapes.features, d => d.id)
      .join("path")
        .attr("d", geo_path)
        .attr("class", "map-feature")
        .attr("fill","white")
        .attr("stroke", "gray");

    console.log(points);
    d3.csv('MassShootingsDatabase.csv', function(csv) {
      d3.select('#map')
        .append('circle')
        .attr("cx",  projection([csv.Longitude, csv.Latitude])[0])
        .attr("cy", projection([csv.Longitude, csv.Latitude])[1])
        .attr("r", 3)
        .attr('opacity', 0.5);
    });
    // for (var i = 0; i < points.length; i++ ) {
    //   console.log(i);
    //   d3.select('#map')
    //     .append('circle')
    //     .attr("cx",  points[i][0])
    //     .attr("cy", points[i][1])
    //     .attr("r", 3)
    //     .attr('opacity', 0.5);
    // }
    // d3.select('#map')
    //   .append('circle')
    //   .attr("cx",  projection(s)[0])
    //   .attr("cy", projection(s)[1])
    //   .attr("r", 3);
    // d3.csv('MassShootingsDatabase.csv', function(csv) {
    //   // console.log(projection([csv.Longitude, csv.Latitude]));
    //   d3.select('#map')
    //     .enter()
    //     .append('circle')
    //     .attr("cx",  projection([csv.Longitude, csv.Latitude])[0])
    //     .attr("cy", projection([csv.Longitude, csv.Latitude])[1])
    //     .attr("r", 3);
    // });
  });