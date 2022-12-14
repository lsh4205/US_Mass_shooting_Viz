var width = 975*1.05, height = 610*1.05, active = d3.select(null), centered;
const projection = d3.geoAlbersUsa().scale(1200).translate([width/2.0, height/2.0]);
const path = d3.geoPath().projection(projection);
const data_panel_w = width / 3.0;
const slider_c = width / 3.0;
const slider_w = width / 3.4;

var svg = d3.select("#map-section")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr('id', 'map');

var data_panel = d3.select('#data-panel')
  .attr('x', 0)
  .attr('y', 0)
  .style('width', data_panel_w + 'px')
  .style('height', height + 'px');

var description = d3.select('#data-description')
  .attr('background', 'lightgray');

// Set-up Slider width and height
var slider_year = d3.select('#slider-year')
  .append('svg')
  .attr('width', slider_c + 'px')
  .attr('height', 60)
  .append('g');

// Set-up slider icon and text
d3.select('#slider-text').append('text')
  .attr('class', 'fa')
  .attr('font-weight', '12')
  .text('\uf05a'); 
d3.select('#slider-text').append('span').text('   Shooting cases based on year.');

// Read US-states json to map-on and projection on svg file
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

    // Read and load the US-Mass-Shooting-Data
    d3.csv('MassShootingsDatabase.csv').then(function (csv) {
      var circle_g = svg.append('g').selectAll('circle')
        .data(csv)
        .enter();

      // Create circle
      circle_g.append('circle')
        .attr('cx', function(d) {
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

// Click event on States
function states_clicked(d) {
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 2.5;
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

  // Translate Map path and zoom
  states.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
  
  // Translate circle data and zoom
  svg.selectAll('circle')
    .transition().duration(750)
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
    .style('stroke-width', 1.5/k + 'px');
}

// Display US-Mass-Shooting cases on the detail panel
function displayDetails(d) {
  d3.select('#case-title').text(d.Case).append('br');

  d3.select('#case-fatalities').text(d.Fatalities);
  d3.select('#f-description').text(' casualties.').append('br');
  d3.select('#case-injuries').text(d.Injuries);
  d3.select('#i-description').text(' injured.').append('p');
  
  d3.select('#case-loc').text(d.Location).append('br');
  d3.select('#case-date').text(d.Date).append('p');
  
  d3.select('#case-summary').text(d.summary);
}

// Update Map based on Year from slider-event
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

// Slider Set-up 
function sliderSetUp() {
  var slider_x = (data_panel_w - slider_w)/2.0;
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
