let canvas = document.querySelector("canvas").getContext("2d");
let chart;

function createChart(data = null, type = "bar", years, title = "", country) {
    chart = new Chart(canvas, {
        type: type,
        data: {
            labels: years,
            datasets: [{
                label: country,
                data: data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
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
        if (object.dim.SEX == undefined || object.dim.SEX == "Both sexes" && dataset[object.dim.YEAR] == undefined) {
            if (isNaN(parseFloat(object.Value))) {
                let slice = object.Value.split("[");
                dataset[object.dim.YEAR] = parseFloat(slice[0]);
            } else {
                dataset[object.dim.YEAR] = parseFloat(object.Value);
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
        //Alert error when implemented
        console.log("Data was not fetched succesfully");
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