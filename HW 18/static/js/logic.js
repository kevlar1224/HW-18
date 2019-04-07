var myMap = L.map("map", {
    center: [20, -20],
    zoom: 2
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function selectColor(value) {
    if (value < 1) {
        return "#ffffcc"            
    }
    else if (value < 2) {
        return "#ffff66"
    }
    else if (value < 3) {
        return "#ffcc66"
    }
    else if (value < 4) {
        return "#ff9933"
    }
    else if (value < 5) {
        return "#ff3300"
    }
    else {
        return "#800000"
    }
};

d3.json(link, function(data) {

    var features = d3.values(data.features);

    features.forEach(function(entry) {
        var lat = entry.geometry.coordinates[1];
        var lon = entry.geometry.coordinates[0];
        var circle = L.circle([lat, lon], {
            color: selectColor(entry.properties.mag),
            fillColor: selectColor(entry.properties.mag),
            fillOpacity: 0.8,
            radius: 10000*(entry.properties.mag)
        }).addTo(myMap);
    circle.bindPopup(`<p class="popup">${entry.properties.place}<br />Magnitude: ${entry.properties.mag}</p>`).openPopup();

   });
});

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
    grades = [0, 1, 2, 3, 4, 5],
    labels = [];

    for (var i = 0; i < grades.length; i++) {
    div.innerHTML +=
        '<i style="background:' + selectColor(grades[i] + .5) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    };
 return div;
};

legend.addTo(myMap);