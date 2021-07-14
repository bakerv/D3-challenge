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

var xData = "poverty"
var yData = "healthcare"

function xAxisScale(dataSet,dataColumn) {
    let scale = d3.scaleLinear()
        .domain([
            d3.min(dataSet, data => data[dataColumn]) * 0.8,
            d3.max(dataSet, data => data[dataColumn]) * 1.2])
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

function drawChart(xScale, yScale, dataSet) {
    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale);

    prepareChart.append("g")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(xAxis);

    prepareChart.append("g")
        .call(yAxis);
    
    prepareChart.selectAll("circle")
        .data(dataSet)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d[xData]))
        .attr("cy", d => yScale(d[yData]))
        .attr("r","8")
        .attr("stroke","black")
        .attr("fill","white")
        .attr("opacity","1.0")

    prepareChart.selectAll("text")
        .data(dataSet)
        .enter()
        .append("text")
        .attr("x", d => xScale(d[xData]))
        .attr("y", d => yScale(d[yData]))
        .attr("fill","red")
        .text(d => d.abbr);
        };
        

    // dataPoints.append("text").attr("x","50%").attr("y","50%").attr("stroke","white").attr("stroke-width","2px").text("A!")
    
d3.csv("D3_data_journalism/data/data.csv").then(rawData => {
    console.log(rawData)
    rawData.forEach(data => {
        data[xData] = +data[xData];
        data[yData] = +data[yData];
    })

    console.log(rawData)

    xScale = xAxisScale(rawData, xData);
    yScale = yAxisScale(rawData, yData);

    drawChart(xScale, yScale, rawData);
});
