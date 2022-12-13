var width = 975*1.05, height = 610*1.05, active = d3.select(null), centered;
var svg = d3.select("#map-section")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr('id', 'map');

const projection = d3.geoAlbersUsa().scale(1200).translate([width/2.0, height/2.0]);
const geo_path = d3.geoPath();

var path = d3.geoPath() // updated for d3 v4
    .projection(projection);

var data_panel = d3.select('#data-panel')
  .attr('x', width)
  .attr('y', 0)
  .style('width', width/3.6 + 'px')
  .style('height', height + 'px');

var description = d3.select('#data-description')
  .attr('background', 'lightgray');

var slider_year = d3.select('#slider-year')
  .append('svg')
  .attr('width', width/3.56 + 'px')
  .attr('height', 80)
  .append('g');

var year_set = 2010;

d3.json("./component/us-states.json")
  .then(json => {

  svg.append('g')
    .attr('id', 'states')
    .selectAll("path")
    .data(json.features)
    .enter()
    .append('path')
    .attr("d", path)
    .attr("stroke", "gray")
    .on('click', states_clicked);

    d3.csv('MassShootingsDatabase.csv').then(function (csv) {
      var circle_g = svg.append('g').selectAll('circle')
        .data(csv)
        .enter();

      circle_g.append('circle')
        .attr('cx', function(d) {
          console.log(d.TotalVictims);
          return projection([d.Longitude, d.Latitude])[0];
        })
        .attr('cy', function(d) {
          return projection([d.Longitude, d.Latitude])[1];
        })
        .attr('r', d => isNaN(d.TotalVictims) ? 0 
          : 0.3 * d.TotalVictims < 4 ? 4 
          : 0.3 * d.TotalVictims > 20 ? 20
          : 0.3 * d.TotalVictims)
        .attr('class', 'deselected')
        .style('fill', 'red')
        .style('stroke', 'white')
        .on('click', function(d) {
          displayDetails(d);
          // Change only visible circles
          d3.selectAll('.vis').attr('class', 'vis deselected');
          d3.select(this).attr('class', 'vis selected');
        });
    });
});

function states_clicked(d) {
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }
  var states = d3.select('#states')
  states.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  states.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
  d3.selectAll('.vis')
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")");
}

function displayDetails(d) {
  d3.select('#case-title').text(d.Case).append('br');
  d3.select('#case-loc').text(d.Location).append('br');
  d3.select('#case-date').text(d.Date).append('br');
  d3.select('#case-victims').text( function() {
      return 'Fatalites: ' + d.Fatalities + ', Injuries: ' + d.Injuries + ', Total Victims: ' + d.TotalVictims; 
    })
    .append('br');
  d3.select('#case-summary').text(d.summary);
}

function updateMapYear(year) {
  var circles = d3.selectAll('circle');
  circles.filter(d => Number(d.Year) > year)
    .attr('class', 'invis')
  circles.filter(d => Number(d.Year) <= year)
    .attr('class', 'vis deselected');
}
// .menu {
//   visibility:hidden;
//   opacity:0;
//   transition:visibility 0.3s linear,opacity 0.3s linear;
  
//   background:#eee;
//   width:100px;
//   margin:0;
//   padding:5px;
//   list-style:none;
// }
// div:hover > .menu {
//   visibility:visible;
//   opacity:1;

function sliderSetUp() {
  var slider_w = width/3.9;
  var slider_x = (width/3.6 - slider_w)/2.0;
  var slider = d3
    .sliderBottom()
    .min(1980)
    .max(2022)
    .step(1)
    .width(slider_w)
    .ticks(4)
    .default(2022)
    .displayValue(true)
    .fill('lightgray')
    .handle(
      d3.symbol().type(d3.symbolCircle)
      .size(200)()
    ).on('onchange', function(num) {
      updateMapYear(num);
    })
    .tickFormat(d3.format('d'))
    .displayFormat(d3.format('d'));
  slider_year.append('g')
    .attr('transform', `translate(${slider_x}, 20)`)
    .call(slider);
}
sliderSetUp();
