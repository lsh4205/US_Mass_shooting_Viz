# U.S. Mass Shooting Visualization

U.S. Mass Shooting Visualization presents the mass shooting cases in the USA through the map.

## Data Source
<b>MassShootingsDataBase.csv</b> ⋅ [Download](https://www.motherjones.com/politics/2012/12/mass-shootings-mother-jones-full-data/)

* Data from [U.S. Mass Shootings, 1982-2022: Data From Mother Jones' Inverstigation](https://www.motherjones.com/politics/2012/12/mass-shootings-mother-jones-full-data/). 

<b>counties-albers-10m.json</b> · [Download](https://cdn.jsdelivr.net/npm/us-atlas@3/counties-albers-10m.json "Source")

* A [TopoJSON file](https://github.com/topojson/topojson-specification/blob/master/README.md#21-topology-objects) file containing the geometry collections counties, states, and nation. The geometry is quantized, projected using [d3.geoAlbersUsa](https://github.com/d3/d3-geo/blob/master/README.md#geoAlbersUsa) to fit a 975×610 viewport, and simplified. 

## Usage

```js
const projection = d3.geoAlbersUsa().scale(1200).translate([width/2.0, height/2.0]);
const path = d3.geoPath().projection(projection);
```
It is a conic equal-area Albers projection suitable for U.S. map and designed to fit a 975×610 viewport.

### 1. Read Data
1. Read the TopoJSON file and append it to the SVG file.
```js
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
    .attr("stroke", "gray");
    //...
  });
```
2. Under that code, read <b>MassShootingsDatabase.csv</b> and save it to all circles that will represent each mass shooting case.
```js
// Read and load the US-Mass-Shooting-Data
    d3.csv('MassShootingsDatabase.csv').then(function (csv) {
      var circle_g = svg.append('g').selectAll('circle')
        .data(csv)
        .enter();
        //...
    });
```
### 2. Display Data
#### 2.1. Set up the circle

1. We used a _circle_ to represent each shooting case on map. The coordinate of each circle is projected based on the _projection_ with _Longitude_ and _Latitude_ from the data. Set the radius based on the number of _TotalVictims_ from the data. 
(the _max_ and _min_ size of the radius limiited for visibility).

```js
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
          : 0.3 * d.TotalVictims);
```

2. Each _circle_ has _class_ for _click_.
Default _class_ is _'deselected'_ and the class of clicked _circle_(case) will be changed it to _'selected'_. Due to the _slider_year_, only _vis_(visible) data will be displayed on the map.
```js
circle_g.append('circle')
  .attr('class', 'deselected')
  .on('click', function(d) {
    displayDetails(d);
    // Change only visible circles
    d3.selectAll('.vis').attr('class', 'vis deselected');
    d3.select(this).attr('class', 'vis selected');
});
```
3. IF the _circle_ is clicked on the map. The detail of the case is displayed
on the right side of the map .
```js
circle_g.append('circle')
  // ... Other set-up for circle
  .on('click', function(d) {
    displayDetails(d);
    // Change only visible circles
    d3.selectAll('.vis').attr('class', 'vis deselected');
    d3.select(this).attr('class', 'vis selected');
  });

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
```
#### 2.2. Display cases based on the _Year_ slider
1. The slider is applied to allow the user to change the year.
It automatically updates the map from the filtered year by slider. 
Cases happened later than the filtered year will be invisible by changing 
their _class_ as _invis_.
```js
// Slider Set-up 
function sliderSetUp() {
  var slider = d3
    .sliderBottom()
    .min(1980)
    .max(2022)
    .step(1)
    .width(slider_w)
    .ticks(4)
    .default(2022)
    .displayValue(true)
    .on('onchange', function(num) {
      updateMapYear(num);
    })
}

// Update Map based on Year from slider-event
function updateMapYear(year) {
  var circles = d3.selectAll('circle');
  circles.filter(d => Number(d.Year) > year)
    .attr('class', 'invis')
  circles.filter(d => Number(d.Year) <= year)
    .attr('class', 'vis deselected');
}
```
#### 2.3. Zoom effect on map
1. If the user click the state, the map will be zoomed and centered that state. _Circles_ are also translated and scaled as the map is. 
```js
function states_clicked(d) {
  // ... 
  var states = d3.select('#states')
  states.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  // Translate Map path and zoom
  states.transition()
    .duration(750)
    .attr("transform", 
      "translate(" + width / 2 + "," + height / 2 
      + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
    .style("stroke-width", 1.5 / k + "px");
  
  // Translate circle data and zoom
  svg.selectAll('circle')
    .transition().duration(750)
    .attr("transform", 
      "translate(" + width / 2 + "," + height / 2 
      + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
    .style('stroke-width', 1.5/k + 'px');
}
```


## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)