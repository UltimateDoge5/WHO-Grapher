const key = "AIzaSyDMlOAWV0hPByaFcpfarjqMs6-iZImWp9A"
let geocoder;
let map;
let isFetch = false;
let marker;
let isoCode;
let country = null;
let mode = "single"; //Map modes: single*, multi, global 
let countries = [];
let isoCodes = []
let polygons = [];

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 20, lng: 10 },
        zoom: 2.9,
        mapTypeControl: false,
        draggable: false,
        scaleControl: false,
        scrollwheel: false,
        navigationControl: false,
        streetViewControl: false,
    });

    geocoder = new google.maps.Geocoder();
    map.addListener("click", (clickInput) => {
        if (mode == "global") {
            return;
        }
        if (marker != undefined) {
            marker.setMap(null)
        }
        marker = new google.maps.Marker({
            position: clickInput.latLng,
            map: map
        });
        getData(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${clickInput.latLng.lat()},${clickInput.latLng.lng()}&key=${key}&language=en-GB`)
            .then(response => {
                isFetch = false;
                if (response.status != "OK") {
                    show_alert("Clicked country was not recognized", 'danger');
                    return false;
                }

                if (response.plus_code.compound_code == undefined) { //If first possible path is not correct
                    if (response.results[response.results.length - 1].formatted_address == undefined) { //If second possible path is not correct
                        show_alert("Clicked country was not recognized", 'danger');
                        return false;
                    } else {
                        country = response.results[response.results.length - 1].formatted_address;
                    }
                } else {
                    country = response.plus_code.compound_code.split(", ");
                    country = country[country.length - 1];
                }
                if (country.includes("Ocean")) {
                    show_alert("Please select a valid country", 'danger');
                    return false;
                }

                console.log(country)
                document.querySelector('#selected-country').innerHTML = country

                if (country.endsWith('Saudi Arabia')) {
                    let country_arr = country.split(" ");
                    country = `${country_arr[country_arr.length - 2]} ${country_arr[country_arr.length - 1]}`;
                }
                enable_categories()

                geocoder.geocode({ 'address': country }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        map.setCenter(results[0].geometry.location);
                        if (country == "Russia") {
                            map.setZoom(4)
                        } else {
                            map.setZoom(5);
                        }
                    }
                });
            })
            .catch(error => show_alert(error, "danger"))
    });
}
/*const legend = [{
    color: "#342414",
    compartment: { "from": 0, "to": 20 },
    countries: {
        2000: [{ name: "Poland", value: 12 },
            { name: "Mexico", value: 8 }
        ],
        2001: [{ name: "France", value: 18 }]
    }
}, {
    color: "#253532",
    compartment: { "from": 21, "to": 40 },
    countries: {
        2000: [{ name: "Canada", value: 24 }],
        2001: [{ name: "Poland", value: 38 }]
    }
}];*/

function checkBorders(legend, borders) {
    let cos = [];
    for (let object of legend) {
        for (year in object.countries) {
            for (country of object.countries[year]) {
                if (borders[country.name] == undefined) {
                    cos.push(country.name)
                }

            }
        }
    }
    return cos;
}
//const blacklist = JSON.parse(`["Comoros", "Equatorial Guinea", "Congo", "Dominican Republic", "Iran (Islamic Republic of)", "Timor-Leste", "Bolivia (Plurinational State of)", "Micronesia (Federated States of)", "Russian Federation", "Sao Tome and Principe", "Central African Republic", "Cabo Verde", "Guinea-Bissau", "Syrian Arab Republic", "United Republic of Tanzania", "Bosnia and Herzegovina", "Czechia", "Republic of Korea", "North Macedonia", "Viet Nam", "Côte d'Ivoire", "Lao People's Democratic Republic", "Republic of Moldova", "Mauritius", "Tonga", "Venezuela (Bolivarian Republic of)", "Samoa", "Kiribati", "Democratic People's Republic of Korea", "Solomon Islands", "South Sudan", "Eswatini", "Democratic Republic of the Congo"]`)

function drawBorders(legendObject, borders, blacklist, vievedYear) { //Implement loading of one year only
    if (polygons[0] != undefined) {
        destroyPoligons()
    }
    for (let object of legendObject) {
        if (object.countries[vievedYear] == undefined) {
            continue;
        }
        for (country of object.countries[vievedYear]) {
            if (blacklist.indexOf(country.name) != -1 || country.name == undefined) {
                continue;
            }
            if (Array.isArray(borders[country.name][0]) == true) {
                for (chunk of borders[country.name]) {
                    polygons.push(drawPolygon(chunk, object.color, country, vievedYear));
                }
            } else {
                polygons.push(drawPolygon(borders[country.name], object.color, country, vievedYear));
            }
        }

    }
    for (polygon of polygons) {
        polygon.setMap(map)
    }
    console.log(polygons.length)
}

function destroyPoligons() {
    for (polygon of polygons) {
        polygon.setMap(null)
    }
    polygons = [];
}

function drawPolygon(path, color, object, year) {
    let polygon = new google.maps.Polygon({
        paths: path,
        strokeColor: "#ffffff",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: color,
        fillOpacity: 0.8,
        data: object,
    });
    let infoWindow = new google.maps.InfoWindow();
    google.maps.event.addListener(polygon, "mouseover", function(e) {

        infoWindow.setContent(`
        Country: ${object.name}<br>
        Value: ${object.value}<br>
        Year: ${year}`);
        var latLng = e.latLng;
        infoWindow.setPosition(latLng);
        infoWindow.open(map);
        this.setOptions({ fillColor: "#00FF00", fillOpacity: 0.6 });

    });
    google.maps.event.addListener(polygon, "mouseout", function() {
        this.setOptions({ fillColor: color, fillOpacity: 0.8 });
        infoWindow.close();
    });
    return polygon;
}

function addCountry() { //Adds the country to the array and resets the view
    if (country == null) {
        show_alert("Cannot add nothing to country list", "warning");
        return false;
    }

    countries.push(country);
    country = null;
    map.setZoom(2.9);
    map.setCenter({ lat: 20, lng: 10 })
    document.querySelector('#selected-country').innerHTML = "None";
}

function resetView() {
    countries = [];
    country = null;
    document.querySelector('#selected-country').innerHTML = "None";
    document.querySelector('#category').disabled = true;
    document.querySelector('#subcategory').disabled = true;
    document.querySelector('#search').disabled = true;
    map.setZoom(2.9);
    map.setCenter({ lat: 20, lng: 10 })
    if (marker != undefined) {
        marker.setMap(null)
    }
}

document.querySelector('#reset').addEventListener('click', () => {
    resetView()
    document.querySelector('.selected-countries__list').innerHTML = "";
})

async function getData(url = '') {
    const response = await fetch(url)
    return response.json();
}