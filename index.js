var width = 975*1.1, height = 610*1.1, active = d3.select(null), centered;

const projection = d3.geoAlbersUsa().scale(1300).translate([width/2.0, height/2.0]);
const geo_path = d3.geoPath();

var path = d3.geoPath() // updated for d3 v4
    .projection(projection);

var svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr('id', 'map');
  
var g = svg.append('g');

var div = d3.select('body')
  .append()

d3.json("./component/us-states.json")
  .then(json => {

    g.append('g')
      .selectAll("path")
      .data(json.features)
      .enter()
      .append('path')
      .attr("d", path)
      .attr('fill', 'lightgray')
      .attr("class", "map-feature")
      .attr("stroke", "gray");
  

    d3.csv('MassShootingsDatabase.csv', function(csv) {
      // const geo_shapes = topojson.feature(json, json.objects.states);
      var point = projection([csv.Longitude, csv.Latitude]);
      var total_vic = Number(csv.TotalVictims);
      
      g.append('circle')
        .attr('cx', point[0])
        .attr('cy', point[1])
        .attr('r', !total_vic ? 0 : 0.2 * total_vic < 3 ? 3 : 0.2 * total_vic)
        .style("fill", "red")
        .attr('opacity', 0.5);
      function clickCircle() {
        
      }
    });

});

// function reset() {
//     active.classed("active", false);
//     active = d3.select(null);
  
//     svg.transition()
//         .duration(750)
//         // .call( zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1) ); // not in d3 v4
//         .call( zoom.transform, d3.zoomIdentity ); // updated for d3 v4
// }

  
// // If the drag behavior prevents the default click,
// // also stop propagation so we don’t click-to-zoom.
// function stopped(event) {
//     if (event.defaultPrevented) event.stopPropagation();
// }