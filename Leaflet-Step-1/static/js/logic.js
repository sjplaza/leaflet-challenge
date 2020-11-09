let myMap = L.map("map", {
    center: [39.50, -98.35],
    zoom: 5
});

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(myMap);

let earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

d3.json(earthquakeURL, function (data) {
    function styleInfo(feature) {
        return {
            fillOpacity: 1,
            fillColor: markerColor(feature.properties.mag),
            color: "black",
            radius: markerRadius(feature.properties.mag),
            weight: 0.25
        }
    }

    function markerColor(magnitude) {
        switch (true) {
            case magnitude > 5:
                return "#330000";
            case magnitude > 4:
                return "#333300";
            case magnitude > 3:
                return "#336600";
            case magnitude > 2:
                return "#339900";
            case magnitude > 1:
                return "#33CC00";
            default:
                return "#33FF00"
        }
    }

    function markerRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }

        return magnitude * 4;
    }

    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },

        style: styleInfo,

        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
        }
    }).addTo(myMap)
});

function legendColor(d) {
    return d > 5 ? "#330000" :
        d > 4 ? "#333300" :
            d > 3 ? "#336600" :
                d > 2 ? "#339900" :
                    d > 1 ? "#33CC00" :
                        "#33FF00";
}

legend = L.control({ position: "bottomright" });
legend.onAdd = function () {
    let div = L.DomUtil.create("div", "info legend"),
        mags = [0, 1, 2, 3, 4, 5],
        labels = [];
    for (let i = 0; i < mags.length; i++) {
        div.innerHTML += '<i style="background:' + legendColor(mags[i] + 1) + '"><\i> ' + mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
    };

    return div;
};

legend.addTo(myMap);