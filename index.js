var width = 975*1.05, height = 610*1.05, active = d3.select(null), centered;

const projection = d3.geoAlbersUsa().scale(1200).translate([width/2.0, height/2.0]);
const geo_path = d3.geoPath();

var path = d3.geoPath() // updated for d3 v4
    .projection(projection);

// Set up for Description Panel
var svg = d3.select("#map-section")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr('id', 'map');

var g = svg.append('g');

var data_panel = d3.select('#data-panel')
  .attr('x', width)
  .attr('y', 0)
  .style('width', width/3.6 + 'px')
  .style('height', height + 'px');

var description = d3.select('#data-description')
  .attr('background', 'lightgray');

var slider_year = d3.select('#slider-year')
  .append('svg')
  .attr('width', width/3.6 + 'px')
  .attr('height', 80)
  .append('g');

var year_set = 2010;

function sliderSetUp() {
  var slider_w = width/3.9;
  var slider_x = (width/3.6 - slider_w)/2.0;
  var slider = d3
    .sliderBottom()
    .min(1980)
    .max(2023)
    .step(1)
    .width(slider_w)
    .ticks(4)
    .default(year_set)
    .displayValue(true)
    .fill('lightgray')
    .handle(
      d3.symbol().type(d3.symbolCircle)
      .size(200)()
    ).on('onchange', function(num) {
      
    });
  slider_year.append('g')
    .attr('transform', `translate(${slider_x}, 20)`)
    .call(slider);
}

sliderSetUp();

function clicked(d) {
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
});
// Load the Mass shooting database
d3.csv('MassShootingsDatabase.csv').then(function(data) {
  // const geo_shapes = topojson.feature(json, json.objects.states);
  var csv = data;

  var point = projection([csv.Longitude, csv.Latitude]);
  console.log(point);
  var total_vic = Number(csv.TotalVictims);
  
  var circle_g = g.selectAll('circle').data(csv).enter();

  circle_g.append('circle')
    .data(csv)
    .attr('class', 'not-filtered')
    .attr('cx', function(d) {
      console.log(d.Longitude);
      return projection([Number(d.Longitude), Number(d.Latitude)])[0];
    })
    .attr('cy', function (d) {
      return projection([Number(d.Latitude), Number(d.Longitude)])[1];
    })
    .attr('r', !total_vic ? 0 : 0.2 * total_vic < 3 ? 3 : 0.2 * total_vic)
    .style("fill", "red")
    .style('opacity', 0.2)
    .on('click', clickCircle);
  
  function clickCircle() {
    d3.select('#case-title').text(csv.Case).append('br');
    d3.select('#case-loc').text(csv.Location).append('br');
    d3.select('#case-date').text(csv.Date).append('br');
    d3.select('#case-victims').text( function() {
        return 'Fatalites: ' + csv.Fatalities + ', Injuries: ' + csv.Injuries + ', Total Victims: ' + csv.TotalVictims; 
      })
      .append('br');
    d3.select('#case-summary').text(csv.summary);
    d3.select('this').style('opacity', 1);
  }
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