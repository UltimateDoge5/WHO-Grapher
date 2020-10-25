let canvas = document.querySelector("canvas").getContext("2d");
let chart;
let parsedData;
let legend;
let blacklist;

function createChart(data = null, type = "bar", years, title = "", country) { //Create chart with one country
    let sum = 0;
    let colors = GenerateColors([0]);
    for (index of data) {
        sum += index;
    }
    if (sum == 0) {
        show_alert(languageText[lang].dataZero, 'info')
        return false;
    }

    chart = new Chart(canvas, {
        type: type,
        data: {
            labels: years,
            datasets: [{
                fill: false,
                label: country,
                data: data,
                backgroundColor: colors.background[0],
                borderColor: colors.border[0],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
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
    $('#chart_modal').modal('show');
    pointDifference()
}

function createMultiChart(datasets, type = "bar", years, title = "") { //Create chart with multiple countries
    console.log(datasets)
    let finalOutput = [];
    let rejected = [];
    for (i = 0; i < datasets.length; i++) {
        if (datasets[i].backgroundColor != undefined) {
            finalOutput.push(datasets[i])
        } else {
            rejected.push(datasets[i])
        }
    }

    /*let emptyCountries = [];
    let i = 0;
    for (country of datasets) {
        let sum = 0.0;
        for (index of country.data) {
            sum += index;
        }
        if (sum == 0) {
            emptyCountries.push(country.label)

            datasets.splice(i, 1)
        }
        i++;
    }
    for (country of datasets) {
        if (country.background == undefined) {
            datasets.splice(i, 1)
        }
    }

    if (emptyCountries.length > 0) {
        let string = languageText[lang].dataZeroMulti[0];
        let countriesBuffer = "";
        for (country of emptyCountries) {
            if (countriesBuffer.length > 0) {
                string += ", ";
            }
            countriesBuffer += country
        }
        string += countriesBuffer;
        string += languageText[lang].dataZeroMulti[1];
        show_alert(string, "warning");
    }

    if (datasets.length == 0) {
        return false;
    }

    */
    if (rejected.length > 0) {
        let string = languageText[lang].dataZeroMulti[0];
        let wasAdded = false;
        for (country of rejected) {
            if (wasAdded) {
                string += ", ";
            }
            wasAdded = true;
            string += country.label;
        }
        string += languageText[lang].dataZeroMulti[1];
        show_alert(string, "warning");
    }
    chart = new Chart(canvas, {
        type: type,
        data: {
            labels: years,
            datasets: finalOutput,
        },
        options: {
            responsive: true,
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
    $('#chart_modal').modal('show');
    pointDifference()
}

function getDataset(data) { //Parse the data to human readable & chart compatible format
    let dataset = {};
    for (object of data.fact) {
        if (object.Value == "No data") {
            return false;
        }
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
            borderWidth: 1,
            fill: false
        };
        i++;
        result.push(dataset)
    }
    return result;
}

function getGlobalData(data) {
    function parserAlgorithm(object) {
        if (object.dim.SEX == undefined || object.dim.SEX == "Both sexes" || object.dim.UNREGION != undefined) { //If object is valid for chart

            if (object.dim.ENVCAUSE != undefined) {
                //If subcatogory is devided by extra causes, only add to chart total amount of deaths
                if (object.dim.ENVCAUSE == "Total" || object.dim.ENVCAUSE == "Lower respiratory infections") {
                    return parseFloat(object.Value);
                }
            } else {
                return parseFloat(object.Value);
            }
        } else {
            return false;
        }
        return false;
    }

    let output = {};

    for (object of data.fact) {
        let value = parserAlgorithm(object)
        if (value === false || object.dim.COUNTRY == undefined) {
            continue;
        }
        if (Array.isArray(output[object.dim.YEAR]) == false) {
            output[object.dim.YEAR] = [];
        }
        output[object.dim.YEAR].push({ name: object.dim.COUNTRY, value: value });

    }
    return output;
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

function getYearsForGlobal(parsedData) {
    let years = [];
    for (year in parsedData) {
        years.push(year);
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
    const roundToTwo = num => +(Math.round(num + "e+2") + "e-2");
    for (let country of chart.data.datasets) {
        const data = country.data;
        const difference = data[data.length - 1] - data[0];
        const between = [chart.data.labels[0], chart.data.labels[chart.data.labels.length - 1]];
        const percent = Math.abs(roundToTwo(difference / data[0] * 100));
        if (difference > 0) { // increased
            document.querySelector('.difference').innerHTML += languageText[lang].difference.increased(between[0], between[1], country.label, subcategory, percent);
        } else { // decreased
            document.querySelector('.difference').innerHTML += languageText[lang].difference.decreased(between[0], between[1], country.label, subcategory, percent)
        }
    }

}

function renderChart(data, country) {

    document.querySelector('.difference').innerHTML = ""; // remove information about point difference
    if (data.error != undefined) { //If server returned an error
        show_alert(languageText[lang].fetchError, 'danger');
        return false;
    }

    if (data.fact.length == 0) { //If no data for given country is present
        show_alert(languageText[lang].noData, 'info');
        return false;
    }

    if (chart == undefined) { //If chart does not exist create it
        const years = getYears(data)
        const dataset = getDataset(data);
        if (dataset == false) { //No data
            show_alert(languageText[lang].noData, "info")
            return false;
        }
        createChart(dataset, "bar", years, subcategory, country);
    } else { //If chart does exist destroy it and then create it
        chart.destroy();
        chart = undefined;
        renderChart(data, country);
    }
}

function renderMultiChart(data, countries) {
    document.querySelector('.difference').innerHTML = ""; // remove information about point difference

    if (countries.length < 2) {
        show_alert(languageText[lang].minCountry, "warning")
        return false;
    }
    if (data.error != undefined) {
        show_alert(languageText[lang].fetchError, 'warning');
        return false;
    }

    if (chart == undefined) { //If chart does exist destroy it and then create it
        const years = getMultipleYears(data);
        const dataset = getDatasets(data, countries);
        console.log(dataset)
        createMultiChart(dataset, "bar", years, subcategory);
    } else { //If chart does exist destroy it and then create it
        chart.destroy();
        chart = undefined;
        renderMultiChart(data, countries);
    }
}

function fetchGlobal(dataCode) {
    getData(`/api/${dataCode}`) //Fetch only one country for single-country chart
        .then(response => {
            renderGlobalMode(response);
        })
        .catch(err => console.error(err))
}

function renderGlobalMode(data) {
    getBorders().then(result => { //Wait for borders to load (if not cashed in borwser will be fetched from server)
            borders = result;
            parsedData = getGlobalData(data);
            let minMax = getMinMax(parsedData)
            let years = getYearsForGlobal(parsedData);
            years_list(years); // generate caption for years range
            legend = assignToLegend(generateCompartment(minMax, 5), getGlobalData(data, years), legend_color_list(legends_colors())); //Create the legend
            legend_compartments(legend)
            console.log(minMax, parsedData, data, generateCompartment(minMax, 5), legend)
            blacklist = checkBorders(legend, borders); //Create blacklist for countries of which borders we don't have
            let keys = Object.keys(legend[0].countries);
            drawBorders(legend, borders, blacklist, keys[keys.length - 1], { enabled: true, color: "#5e5e5e" });
        })
        .catch(err => console.error(err))
}

function getBorders() { //Get countries borders
    return new Promise(async function(resolve, reject) {
        let borders = JSON.parse(localStorage.getItem("borders"));
        if (borders == null) {
            getData(`/get/borders`) //Fetch only one country for single-country chart
                .then(response => {
                    localStorage.setItem("borders", JSON.stringify(response));
                    resolve(response);
                })
                .catch(err => reject(err))
        } else {
            resolve(borders)
        }
    })
}

function fetchSingleCountry(dataCode) { //Wrapper for data loading (single chart)
    isoCode = countryToIso(country);
    getData(`/api/${dataCode}?country=${isoCode}`) //Fetch only one country for single-country chart
        .then(response => {
            isFetch = false;
            renderChart(response, country);
        })
        .catch(err => console.error(err))
}

function fetchMultipleCountries(dataCode) { //Wrapper for data loading (multi chart)
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

function GenerateColors(data) { //Generate random colors for countries in multi mode
    let colors = {
        background: [],
        border: []
    }

    for (let i = 0; i < data.length; i++) {
        let rgb = []
        for (let j = 0; j < 3; j++) {
            let random = Math.floor(Math.random() * (201 - 100)) + 100; // min = 150 || max = 256
            rgb.push(random)
        }
        const to_rgba = (aplha) => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${aplha})`
        colors['background'].push(to_rgba('0.6'));
        colors['border'].push(to_rgba('1'));
    }
    return colors;
}

function getCountryNames(data) {
    let countries = [];
    for (object of data.fact) {
        if (!countries.includes(object.dim.COUNTRY)) {
            countries.push(object.dim.COUNTRY);
        }
    }
    return countries;
}

function assignToLegend(compartments, data, colors) {
    let legend = [];
    for (i = 0; i < compartments.length; i++) {
        legend.push({ color: colors[i], compartment: compartments[i], countries: {} })
    }
    for (year in data) {
        for (country of data[year]) {
            for (compartment of compartments) {
                //i++;
                if (country.value >= compartment.from && country.value <= compartment.to) {
                    let index = compartments.indexOf(compartment);
                    if (legend[index].countries[year] == undefined) {
                        legend[index].countries[year] = [];
                    }
                    legend[index].countries[year].push(country)
                }
            }
        }
    }
    return legend;
}

function generateCompartment(minMax, denominator = 5) {
    if (denominator < 2) {
        denominator = 2;
    }
    let compartment = [];
    let base = (minMax.max + 1) - (minMax.min + 1);
    let nominator = parseFloat((base / denominator).toFixed(1));
    let min = minMax.min;
    let max = nominator;

    for (let i = 0; i < denominator; i++) {
        compartment.push({ from: parseFloat(min.toFixed(1)), to: parseFloat(max.toFixed(1)) })
        min = max + 0.1;
        max += nominator;
    }
    return compartment;
}

function getMinMax(parsedData) {
    let keys = Object.keys(parsedData);
    let min = parseFloat(parsedData[keys[0]][0].value);
    let max = parseFloat(parsedData[keys[0]][0].value);
    for (year in parsedData) {
        for (object of parsedData[year]) {
            if (isNaN(parseFloat(object.value))) {
                continue;
            }
            min = Math.min(min, parseFloat(object.value));
            max = Math.max(max, parseFloat(object.value));
        }
    }
    return { min: min, max: max };
}