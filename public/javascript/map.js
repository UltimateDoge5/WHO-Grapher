const key = "AIzaSyDMlOAWV0hPByaFcpfarjqMs6-iZImWp9A"; //Key only usable on public site
let geocoder;
let map;
let isFetch = false;
let marker;
let isoCode;
let country = null;
let mode = "single"; //Map modes: single*, multi, global 
let countries = [];
let isoCodes = []
let polygons = {};
let noDataCountries = {}
let scale = 0;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 20, lng: 10 },
        zoom: 2.9,
        mapTypeControl: false,
        draggable: true,
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
                    show_alert(languageText[lang].wrongCountry, 'danger');
                    return false;
                }

                if (response.plus_code.compound_code == undefined) { //If first possible path is not correct
                    if (response.results[response.results.length - 1].formatted_address == undefined) { //If second possible path is not correct
                        show_alert(languageText[lang].wrongCountry, 'danger');
                        return false;
                    } else {
                        country = response.results[response.results.length - 1].formatted_address;
                    }
                } else {
                    country = response.plus_code.compound_code.split(", ");
                    country = country[country.length - 1];
                }
                if (country.includes("Ocean") || country.includes("Sea")) {
                    show_alert(languageText[lang].invalidCountry, 'warning');
                    return false;
                }

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
    resetView()
}

function checkBorders(legend, borders) {
    let blacklist = [];
    for (let object of legend) {
        for (year in object.countries) {
            for (country of object.countries[year]) {
                if (borders[country.name] == undefined && !blacklist.includes(country.name)) {
                    blacklist.push(country.name)
                }
            }
        }
    }
    return blacklist;
}

function drawBorders(legendObject, borders, blacklist, vievedYear, showNoData = { enabled: true, color: "#5e5e5e" }) { //Implement loading of one year only
    let usedCountries = [];
    if (polygons[0] != undefined) {
        destroyPoligons()
    }
    for (let object of legendObject) {
        if (object.countries[vievedYear] == undefined) {
            continue;
        }
        for (country of object.countries[vievedYear]) {
            if (polygons[country.name] == undefined) {
                polygons[country.name] = [];
            }
            if (blacklist.indexOf(country.name) != -1 || country.name == undefined) {
                continue;
            }
            usedCountries.push(country.name)
            if (Array.isArray(borders[country.name][0]) == true) {
                for (chunk of borders[country.name]) {
                    polygons[country.name].push(drawPolygon(chunk, object.color, country, vievedYear));
                }
            } else {
                polygons[country.name].push(drawPolygon(borders[country.name], object.color, country, vievedYear));
            }
        }

    }

    if (showNoData.enabled) {
        for (country in borders) {
            if (!usedCountries.includes(country)) {
                if (noDataCountries[country] == undefined) {
                    noDataCountries[country] = [];
                }
                if (Array.isArray(borders[country][0]) == true) {
                    for (chunk of borders[country]) {
                        noDataCountries[country].push(drawPolygon(chunk, showNoData.color, { name: country, value: languageText[lang].noDataPolygon }, vievedYear));
                    }
                } else {
                    noDataCountries[country].push(drawPolygon(borders[country], showNoData.color, { name: country, value: languageText[lang].noDataPolygon }, vievedYear));
                }
                //noDataCountries.push(drawPolygon(borders[country], showNoData.color, { name: country, value: languageText[lang].noDataPolygon }, vievedYear))
            }
        }
        for (country in noDataCountries) {
            for (polygon of noDataCountries[country]) {
                polygon.setMap(map);
            }
        }

        for (country in polygons) {
            for (polygon of polygons[country]) {
                polygon.setMap(map);
            }
        }

    }
}

function destroyPoligons() {
    for (country in polygons) {
        for (polygon of polygons[country])
            polygon.setMap(null);
    }
    for (country in noDataCountries) {
        for (polygon of noDataCountries[country]) {
            polygon.setMap(null);
        }
    }
    noDataCountries = {};
    polygons = {};
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
        if (this.data.value == "No data" || this.data.value == "Brak danych") {
            for (polygon of noDataCountries[this.data.name]) {
                polygon.setOptions({ fillColor: "#00FF00", fillOpacity: 0.6 })
            }
        } else {
            for (polygon of polygons[this.data.name]) {
                polygon.setOptions({ fillColor: "#00FF00", fillOpacity: 0.6 })
            }
        }
    });
    google.maps.event.addListener(polygon, "mouseout", function() {
        if (this.data.value == "No data" || this.data.value == "Brak danych") {
            for (polygon of noDataCountries[this.data.name]) {
                polygon.setOptions({ fillColor: color, fillOpacity: 0.8 })
            }
        } else {
            for (polygon of polygons[this.data.name]) {
                polygon.setOptions({ fillColor: color, fillOpacity: 0.8 })
            }
        }
        infoWindow.close();
    });
    return polygon;
}

function addCountry() { //Adds the country to the array and resets the view
    if (country == null) {
        show_alert(languageText[lang].countryIsNull, "warning");
        return false;
    }

    if (countries.includes(country)) {
        show_alert(languageText[lang].countryOnList, "warning");
        return false;
    }

    countries.push(country);
    country = null;
    map.setZoom(2.9);
    map.setCenter({ lat: 20, lng: 10 })
    document.querySelector('#selected-country').innerHTML = languageText[lang].nullCountry;
    return true;
}

function resetView() {
    countries = [];
    country = null;
    document.querySelector('#selected-country').innerHTML = languageText[lang].nullCountry;
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