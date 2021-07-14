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

let svgArea = d3.select("plot")
    .append("svg")
    .attr("height", svgHeight)
    .attr("width", svgWidth);

let positionChart = svgArea.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);


//Initial Paramters

//var xData = data.param1;
//var yData = data.param2;

function axisScale(dataSet, dataColumn) {
    let scale = d3.scaleLinear()
        .domain(d3.min(dataSet[dataColumn])* 0.8, d3.max(dataSet[dataColumn]) * 1.2)
        .range([0,width]);
    
    return scale;
}

function drawAxis(xData, yData) {
    let xAxis = d3.axisBottom(xData);
    let yAxis = d3.axisLeft(yData);
};
    
d3.csv("D3_data_journalism/data/data.csv").then(rawData => {
    console.log(rawData)
});
