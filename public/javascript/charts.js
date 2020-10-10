let canvas = document.querySelector("canvas").getContext("2d");
let chart;

function createChart(data = null, type = "bar", years, title = "", country) {
    let sum = 0;
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
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
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
}

function getDataset(data) {
    let dataset = {};
    for (object of data.fact) {
        if (object.dim.SEX == undefined || object.dim.SEX == "Both sexes" && dataset[object.dim.YEAR] == undefined) { //If object is valid for chart
            if (isNaN(parseFloat(object.Value))) {
                if (object.dim.ENVCAUSE != undefined) {
                    //If value is provided with margin of error, cut in half to get the value
                    if (object.dim.ENVCAUSE == "Total") {
                        //If subcatogory is devided by extra causes, only add to chart total amount of deaths
                        let slice = object.Value.split("[");
                        console.log(slice)
                        dataset[object.dim.YEAR] = parseFloat(slice[0]);
                    }
                } else {
                    let slice = object.Value.split("[");
                    console.log(slice)
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

function getYears(data) {
    let years = [];
    for (object of data.fact) {
        if (!years.includes(object.dim.YEAR)) {
            years.push(object.dim.YEAR);
        }
    }
    return years;
}

function renderChart(data, country) {
    if (data.error != undefined) {
        show_alert("Data was not fetched succesfully", 'warning');
        return false;
    }
    if (data.fact.length == 0) {
        show_alert("No data avaiable for this country", 'warning');
        chart.destroy();
        chart = undefined;
        return false;
    }

    if (chart == undefined) {
        const years = getYears(data)
        const dataset = getDataset(data, years);
        createChart(dataset, "bar", years, data.fact[0].dim.GHO, country);
    } else {
        chart.destroy();
        chart = undefined;
        renderChart(data, country);
    }
}