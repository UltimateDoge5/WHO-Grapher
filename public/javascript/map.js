const key = "AIzaSyDMlOAWV0hPByaFcpfarjqMs6-iZImWp9A"
let geocoder;
let map;
let isFetch = false;
let marker;
let isoCode;
let country;
let mode = "single"; //Map modes: single*, multi, global 
let countries = [];
let isoCodes = []

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

                if (country.endsWith('Saudi Arabia')){
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