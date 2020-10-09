const key = "AIzaSyDMlOAWV0hPByaFcpfarjqMs6-iZImWp9A"
let geocoder;
let map;
let isFetch = false;
let marker;
let iso_code;
let country;

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
                console.log(response)
                isFetch = false;
                if (response.status != "OK") {
                    //Alert error when implemented
                    console.log("Clicked country was not recognized");
                    return false;
                }

                if (response.plus_code.compound_code == undefined) { //If first possible path is not correct
                    if (response.results[response.results.length - 1].formatted_address == undefined) { //If second possible path is not correct
                        //Alert error when implemented
                        console.log("Clicked country was not recognized");
                        return false;
                    } else {
                        country = response.results[response.results.length - 1].formatted_address;
                    }
                } else {
                    country = response.plus_code.compound_code.split(", ");
                    country = country[country.length - 1];
                }
                if (country.includes("Ocean")) {
                    //Alert error when implemented
                    console.log("Please select a valid country");
                    return false;
                }
                console.log(country)
                document.querySelector('#selected-country').innerHTML = country;
                document.querySelector('#category').disabled = false;
                document.querySelector('#subcategory').disabled = false;
                geocoder.geocode({ 'address': country }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        map.setCenter(results[0].geometry.location);
                        iso_code = country_to_iso(country);
                        if (country == "Russia") {
                            map.setZoom(4)
                        } else {
                            map.setZoom(5);
                        }
                    }
                });
            });
    });
}

function resetView() {
    map.setZoom(2.9);
    map.setCenter({ lat: 20, lng: 10 })
    if (marker != undefined) {
        marker.setMap(null)
    }
}

async function getData(url = '') {
    if (isFetch) { //Dont fetch if another fetch is in progress
        console.log("Fetch in progress")
        return false;
    }
    isFetch = true;
    const response = await fetch(url)
    return response.json();
}