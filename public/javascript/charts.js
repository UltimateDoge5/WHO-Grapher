let canvas = document.querySelector("canvas").getContext("2d");
let chart;

function createChart(data = null, type = "bar", years, title = "", country) { //Create chart with one country
    let sum = 0;
    let colors = GenerateColors(data);
    for (index of data) {
        sum += index;
    }
    if (sum == 0) {
        show_alert("Data is equal to zero and is not able to be displayed on graph", 'info')
    }

    chart = new Chart(canvas, {
        type: type,
        data: {
            labels: years,
            datasets: [{
                label: country,
                data: data,
                backgroundColor: colors.background,
                borderColor: colors.border,
                borderWidth: 1
            }]
        },
        options: {
            title: {
                display: true,
                text: title
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    pointDifference()
}

function createMultiChart(datasets, type = "bar", years, title = "") { //Create chart with multiple countries
    chart = new Chart(canvas, {
        type: type,
        data: {
            labels: years,
            datasets: datasets
        },
        options: {
            title: {
                display: true,
                text: title
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    pointDifference()
}

function getDataset(data) { //Parse the data to human readable & chart compatible format
    let dataset = {};
    for (object of data.fact) {
        if (object.dim.SEX == undefined || object.dim.SEX == "Both sexes" && dataset[object.dim.YEAR] == undefined) { //If object is valid for chart
            if (isNaN(parseFloat(object.Value))) {
                if (object.dim.ENVCAUSE != undefined) {
                    //If value is provided with margin of error, cut in half to get the value
                    if (object.dim.ENVCAUSE == "Total") {
                        //If subcatogory is devided by extra causes, only add to chart total amount of deaths
                        let slice = object.Value.split("[");
                        dataset[object.dim.YEAR] = parseFloat(slice[0]);
                    }
                } else {
                    let slice = object.Value.split("[");
                    dataset[object.dim.YEAR] = parseFloat(slice[0]);
                }
            } else {
                if (object.dim.ENVCAUSE != undefined) {
                    //If subcatogory is devided by extra causes, only add to chart total amount of deaths
                    if (object.dim.ENVCAUSE == "Total") {
                        dataset[object.dim.YEAR] = parseFloat(object.Value);
                    }
                } else {
                    dataset[object.dim.YEAR] = parseFloat(object.Value);
                }
            }
        }
    }

    let datasetFinal = [];
    for (year in dataset) {
        datasetFinal.push(dataset[year])
    }
    return datasetFinal;
}

function getDatasets(data, countries) { //Parse the data of multiple countries and output them in chart format
    let i = 0;
    let result = [];
    for (country in data) {
        let parsedCountry = getDataset(data[country])
        let colors = GenerateColors(parsedCountry)
        let dataset = {
            label: countries[i],
            data: parsedCountry,
            backgroundColor: colors['background'][0], //Implement generation of random RGB colors for every country
            borderColor: colors['border'][0],
            borderWidth: 1
        };
        i++;
        result.push(dataset)
    }
    return result;
}

function getMultipleYears(data) {
    let years = [];
    for (country in data) {
        for (object of data[country].fact) {
            if (!years.includes(object.dim.YEAR)) {
                years.push(object.dim.YEAR);
            }
        }
    }
    return years;
}

function getYears(data) {
    let years = [];
    for (object of data.fact) {
        if (!years.includes(object.dim.YEAR)) {
            years.push(object.dim.YEAR);
        }
    }
    return years;
}

const pointDifference = () => {
    const roundToTwo = num => +(Math.round(num + "e+2")  + "e-2");
    for(let country of chart.data.datasets){
        const data = country.data;
        const difference = data[data.length - 1] - data[0];
        const between = [chart.data.labels[0], chart.data.labels[chart.data.labels.length - 1]];
        const percent = Math.abs(roundToTwo(difference / data[0] * 100));
        if (difference > 0){ // increased
            document.querySelector('.difference').innerHTML += `<p>For ${country.label}, between years <b>${between[0]}</b> and <b>${between[1]}</b> ${subcategory} increased by <b>${percent}</b>%</p>`;
        }
        else{ // decreased
            document.querySelector('.difference').innerHTML += `<p>For ${country.label}, between years <b>${between[0]}</b> and <b>${between[1]}</b> ${subcategory} decreased by <b>${percent}</b>%</p>`;
        }
    }
    
}


function renderChart(data, country) {
    document.querySelector('.difference').innerHTML = ""; // remove information about point difference

    if (data.error != undefined) {
        show_alert("Data was not fetched succesfully", 'warning');
        return false;
    }
    if (data.fact.length == 0) {
        show_alert("No data avaiable for this country", 'info');
        chart.destroy();
        chart = undefined;
        return false;
    }

    if (chart == undefined) {
        const years = getYears(data)
        const dataset = getDataset(data);
        createChart(dataset, "bar", years, data.fact[0].dim.GHO, country);
    } else {
        chart.destroy();
        chart = undefined;
        renderChart(data, country);
    }
}

function renderMultiChart(data, countries) {
    document.querySelector('.difference').innerHTML = ""; // remove information about point difference

    if (countries.length < 2) {
        show_alert("Please select 2 or more countries", "warning")
        return false;
    }
    if (data.error != undefined) {
        show_alert("Data was not fetched succesfully", 'warning');
        return false;
    }

    if (chart == undefined) {
        const years = getMultipleYears(data);
        const dataset = getDatasets(data, countries);
        createMultiChart(dataset, "bar", years);
    } else {
        chart.destroy();
        chart = undefined;
        renderMultiChart(data, countries);
    }
}

function fetchSingleCountry(dataCode) { //Wrapper for data loading
    isoCode = countryToIso(country);
    getData(`/api/${dataCode}?country=${isoCode}`) //Fetch only one country for single-country chart
        .then(response => {
            isFetch = false;
            renderChart(response, country);
        })
        .catch(err => console.error(err))
}

function fetchMultipleCountries(dataCode) { //Wrapper for data loading
    isoCodes = countriesToIso(countries);
    fetchLoop(dataCode, isoCodes)
        .then(result => renderMultiChart(result, countries))
        .catch(err => console.error(err))
}

function fetchLoop(code, isoCodes) { //Queue fetch as many countries for fetch as given for multi-country chart
    return new Promise(async function(resolve, reject) {
        let result = {};
        for (iso of isoCodes) {
            await getData(`/api/${code}?country=${iso}`)
                .then(response => {
                    result[iso] = response;
                    if (iso == isoCodes[isoCodes.length - 1]) {
                        resolve(result);
                    }
                })
                .catch(err => {
                    reject(err);
                })
        }
    })
}

function GenerateColors(data) {
    let colors = {
        background: [],
        border: []
    }

    for(let i = 0; i < data.length; i++){
        let rgb = []
        for(let j = 0; j < 3; j++){
            let random = Math.floor(Math.random() * (256 - 100)) + 100; // min = 150 || max = 256
            rgb.push(random)
        }
        const to_rgba = (aplha) => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${aplha})` 
        colors['background'].push(to_rgba('0.6'));
        colors['border'].push(to_rgba('1'));
    }
    return colors
}
