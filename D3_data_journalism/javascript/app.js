let svgHeight = 600;
let svgWidth = 600;

let margin = {
    top:50,
    bottom: 50,
    left: 50,
    right: 50
};

let chartHeight = svgHeight - margin.top - margin.bottom;
let chartWidth = svgWidth - margin.left - margin.right;

let svgArea = d3.select("#plot")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

var prepareChart = svgArea.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

let menuLabels = [
    {poverty: "Poverty (%)"},
    {age: "Age (Median)"},
    {income: "Income (Median)"},
    {healthcare: "Healthcare Coverage (%)"},
    {obesity: "Obesity (%)"},
    {smokes: "Active Smokers (%)"}];


//Initial Paramters

var xData = Object.keys(menuLabels[1])
var yData = Object.keys(menuLabels[3])
var xLabels = Object.values(menuLabels[2])
var yLabels = Object.values(menuLabels[1])

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

function drawAxis(xScale, yScale) {
    let xAxis = d3.axisBottom(xScale);
    let yAxis = d3.axisLeft(yScale);

    prepareChart.append("g")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(xAxis);

    prepareChart.append("g")
        .call(yAxis);
};

function drawCircles(xScale, yScale, dataSet){
    prepareChart.selectAll("circle")
        .data(dataSet)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d[xData]))
        .attr("cy", d => yScale(d[yData]))
        .attr("r","10")
        .attr("fill","lightblue")
        .attr("opacity","1.0");
};

function addText(xScale, yScale, dataSet) {
    dataSet.forEach((d) => {
        prepareChart.append("text")
            .attr("x", xScale(d[xData]-0.45))
            .attr("y", yScale(d[yData]-0.2))
            .attr("fill","black")
            .attr("style","font-size:10px")
            .text(d.abbr)
        });

        console.log(dataSet);
        };

    function labelAxes(xlabel, ylabel) {
        let xGroup = svgArea.append("g");
        let yGroup = svgArea.append("g");
        let titleGroup = svgArea.append("g");
        
        xGroup.append("text")
            .attr("x", (chartWidth /2) + margin.left)
            .attr("y",chartHeight + margin.top + 35 )
            .attr("style","text-anchor:middle")
            .attr("value","xAxisLabel")
            .text(xlabel)

        yGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 20)
            .attr("x",- (chartHeight /2 ) - margin.top)
            .attr("value","yAxisLabel")
            .attr("style","text-anchor:middle")
            .text(ylabel)

        titleGroup.append("text")
            .attr("x", (chartWidth /2) + margin.left)
            .attr("y", margin.top)
            .attr("value","title")
            .attr("style","text-anchor:middle")
            .text("TITLE")
    };

function populateMenu(menu, data) {
    // generate options for the select menu, and link the associated index with the id option
    // This linkage will be used to select which data set to display
    data.forEach((entry) => {
        let selectMenu = d3.select(menu);
        let dataOption = selectMenu.append("option")
        dataOption.text(Object.values(entry));
        dataOption.attr('value', Object.keys(entry)); 
    });
};
    
d3.csv("D3_data_journalism/data/data.csv").then(rawData => {
    rawData.forEach(data => {
        data[xData] = +data[xData];
        data[yData] = +data[yData];
    });

    let xScale = xAxisScale(rawData, xData);
    let yScale = yAxisScale(rawData, yData);
    
    populateMenu("#xdata", menuLabels);
    populateMenu("#ydata", menuLabels);
    drawAxis(xScale, yScale);
    drawCircles(xScale, yScale, rawData);
    addText(xScale, yScale, rawData);
    labelAxes(xLabels,yLabels);
});
