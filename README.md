# U.S. Mass Shooting Visualization

U.S. Mass Shooting Visualization presents the mass shooting cases in the USA through the map.

## Data Source
<b>MassShootingsDataBase.csv</b> [Download](https://www.motherjones.com/politics/2012/12/mass-shootings-mother-jones-full-data/)

Use the data from [U.S. Mass Shootings, 1982-2022: Data From Mother Jones' Inverstigation](https://www.motherjones.com/politics/2012/12/mass-shootings-mother-jones-full-data/). 

<b>counties-albers-10m.json</b> · [Download](https://cdn.jsdelivr.net/npm/us-atlas@3/counties-albers-10m.json "Source")

A [TopoJSON file](https://github.com/topojson/topojson-specification/blob/master/README.md#21-topology-objects) file containing the geometry collections counties, states, and nation. The geometry is quantized, projected using [d3.geoAlbersUsa](https://github.com/d3/d3-geo/blob/master/README.md#geoAlbersUsa) to fit a 975×610 viewport, and simplified. 

## Usage

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
3. Append a circle for each case.
```js
// Create circle
      circle_g.append('circle')
```
    1. Set the coordinate of each circle based on the _projection_ with _Longitude_ and _Latitude_ from the data.
```js
circle_g.append('circle')
        .attr('cx', function(d) {
          return projection([d.Longitude, d.Latitude])[0];
        })
        .attr('cy', function(d) {
          return projection([d.Longitude, d.Latitude])[1];
        });
```
    2. Change the radius based on the number of _TotalVictims_ from the data. 
    (Set the size of the radius for visibility).

```js
circle_g.append('circle')
    .attr('r', d => isNaN(d.TotalVictims) ? 0 
        : 0.3 * d.TotalVictims < 4 ? 4 
        : 0.3 * d.TotalVictims > 20 ? 20
        : 0.3 * d.TotalVictims);
```
## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)