let svgHeight = 500;
let svgWidth = 960;

let margin = {
    top:20,
    bottom: 20,
    left: 20,
    right:20
};

let chartHeight = svgHeight - margin.top - margin.bottom;
let chartWidth = svgHeight - margin.left - margin.right;

let svgArea = d3.select("#plot")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

var prepareChart = svgArea.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


//Initial Paramters

var xData = "age"
var yData = "smokes"

function xAxisScale(dataSet) {
    let scale = d3.scaleLinear()
        .domain([
            d3.min(dataSet, d =>d.age) * 0.8,
            d3.max(dataSet, d => d.age) * 1.2])
        .range([0,chartWidth]);
    
    return scale;
}

function yAxisScale(dataSet, dataColumn) {
    let scale = d3.scaleLinear()
        .domain([
            d3.min(dataSet, data => data[dataColumn] * 0.8), 
            d3.max(dataSet, data => data[dataColumn]) * 1.2])
        .range([chartHeight,0]);

    return scale;
}

function drawAxis(xData, yData) {
    let xAxis = d3.axisBottom(xData);
    let yAxis = d3.axisLeft(yData);

    prepareChart.append("g")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(xAxis);

    prepareChart.append("g")
        .call(yAxis)

    console.log("pizza");
};
    
d3.csv("D3_data_journalism/data/data.csv").then(rawData => {
    console.log(rawData)
    rawData.forEach(data => {
        data[xData] = +data[xData];
        data[yData] = +data[yData];
    })

    console.log(rawData)

    xScale = xAxisScale(rawData, xData);
    yScale = yAxisScale(rawData, yData);

    drawAxis(xScale,yScale);
});
