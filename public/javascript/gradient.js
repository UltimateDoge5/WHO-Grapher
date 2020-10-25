function processHEX(val) {

    var hex = (val.length > 6) ? val.substr(1, val.length - 1) : val;

    if (hex.length > 3) {
        var r = hex.substr(0, 2);
        var g = hex.substr(2, 2);
        var b = hex.substr(4, 2);

    } else {

        var r = hex.substr(0, 1) + hex.substr(0, 1);
        var g = hex.substr(1, 1) + hex.substr(1, 1);
        var b = hex.substr(2, 1) + hex.substr(2, 1);

    }

    return [
        parseInt(r, 16),
        parseInt(g, 16),
        parseInt(b, 16)
    ]
}

function generateGradient(firstColor, secondColor, steps) {
    var firstColorRGB = processHEX(firstColor);
    var secondColorRGB = processHEX(secondColor);
    var gradient = [];

    var stepsPerc = 100 / (steps + 1);

    var RGBdiffrence = [
        secondColorRGB[0] - firstColorRGB[0],
        secondColorRGB[1] - firstColorRGB[1],
        secondColorRGB[2] - firstColorRGB[2]
    ];

    for (var i = 0; i < steps; i++) {
        var clampedR = (RGBdiffrence[0] > 0) ?
            pad((Math.round(RGBdiffrence[0] / 100 * (stepsPerc * (i + 1)))).toString(16), 2) :
            pad((Math.round((firstColorRGB[0] + (RGBdiffrence[0]) / 100 * (stepsPerc * (i + 1))))).toString(16), 2);

        var clampedG = (RGBdiffrence[1] > 0) ?
            pad((Math.round(RGBdiffrence[1] / 100 * (stepsPerc * (i + 1)))).toString(16), 2) :
            pad((Math.round((firstColorRGB[1] + (RGBdiffrence[1]) / 100 * (stepsPerc * (i + 1))))).toString(16), 2);

        var clampedB = (RGBdiffrence[2] > 0) ?
            pad((Math.round(RGBdiffrence[2] / 100 * (stepsPerc * (i + 1)))).toString(16), 2) :
            pad((Math.round((firstColorRGB[2] + (RGBdiffrence[2]) / 100 * (stepsPerc * (i + 1))))).toString(16), 2);
        gradient[i] = [
            '#',
            clampedR,
            clampedG,
            clampedB
        ].join('');
    }
    return gradient;
}

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}