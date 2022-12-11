var width = 975*1.1, height = 610*1.1, active = d3.select(null), centered;

const projection = d3.geoAlbersUsa().scale(1200).translate([width/2.0, height/2.0]);
const geo_path = d3.geoPath();

var path = d3.geoPath() // updated for d3 v4
    .projection(projection);

var svg = d3.select("#map-section")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr('id', 'map');

var g = svg.append('g');
var description = d3.select('#data-description')
  .attr('x', width)
  .attr('y', 0)
  .style('width', width/4 + 'px')
  .style('heigth', height/3 + 'px')
  .attr('background', 'lightgray');

var appendBar = false;

description.append('span').attr('id', 'case-title').text("Click to 'Circle' to see the details");
description.append('span').attr('id', 'case-summary');

function clicked(d) {
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    console.log(centroid);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
  } else {
    console.log('non');
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }
  console.log(x);
  var check = centered && d === centered;
  // g.selectAll("path")
  //     .classed("active", check);

  // g.transition()
  //     .duration(750)
  //     .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
  //     .style("stroke-width", 1.5 / k + "px");

}
d3.json("./component/us-states.json")
  .then(json => {

    g.append('g')
      .attr('id', 'states')
      .selectAll("path")
      .data(json.features)
      .enter()
      .append('path')
      .attr("d", path)
      .attr("stroke", "gray")
      .on('click', clicked);
  

    d3.csv('MassShootingsDatabase.csv', function(csv) {
      // const geo_shapes = topojson.feature(json, json.objects.states);
      var point = projection([csv.Longitude, csv.Latitude]);
      var total_vic = Number(csv.TotalVictims);
      
      g.append('circle')
        .attr('cx', point[0])
        .attr('cy', point[1])
        .attr('r', !total_vic ? 0 : 0.2 * total_vic < 3 ? 3 : 0.2 * total_vic)
        .style("fill", "red")
        .attr('opacity', 0.5)
        .on('click', clickCircle);

      function clickCircle() {
        d3.select('#case-title').text(csv.Case).append('br');
        d3.select('#case-summary').text(csv.summary);
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