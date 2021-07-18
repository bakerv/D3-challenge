d3.csv("D3_data_journalism/data/data.csv").then(rawData => {
    rawData.forEach(data => +data);

    // specify overall plotting parameters
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

    // Create html tags for dynamic editing
    let svgArea = d3.select("#plot")
        .append("svg")
        .attr("height", svgHeight)
        .attr("width", svgWidth);

    let prepareChart = svgArea.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    //Create display labels for each column of the data
    let menuLabels = [
        {poverty: "Poverty (%)"},
        {age: "Age (Median)"},
        {income: "Income (Median)"},
        {healthcare: "Healthcare Coverage (%)"},
        {obesity: "Obesity (%)"},
        {smokes: "Active Smokers (%)"}];

    // Initial Plot Parameters
    var xData = Object.keys(menuLabels[1])
    var yData = Object.keys(menuLabels[1])
    var xLabel = Object.values(menuLabels[1])
    var yLabel = Object.values(menuLabels[1])
    
    function xAxisScale(dataSet,dataColumn) {
        let scale = d3.scaleLinear()
            .domain([
                d3.min(dataSet, data => data[dataColumn]) * 0.8,
                d3.max(dataSet, data => data[dataColumn]) * 1.2])
            .range([0,chartWidth]);
        
        return scale;
    };

    function yAxisScale(dataSet, dataColumn) {
        let scale = d3.scaleLinear()
            .domain([
                d3.min(dataSet, data => data[dataColumn] * 0.8), 
                d3.max(dataSet, data => data[dataColumn]) * 1.2])
            .range([chartHeight,0]);

        return scale;
    };

    function drawAxis(xScale, yScale) {
        let xAxis = d3.axisBottom(xScale);
        let yAxis = d3.axisLeft(yScale);
       
        prepareChart.append("g")
            .attr("transform", `translate(0,${chartHeight})`)
            .attr("id","xAxis")
            .call(xAxis);

        prepareChart.append("g")
            .attr("id","yAxis")
            .call(yAxis);
    };

    function updateAxis(xScale, yScale){
        d3.selectAll("#xAxis").transition()
            .duration(1000)
            .call(d3.axisBottom(xScale));

        d3.selectAll("#yAxis").transition()
            .duration(1000)
            .call(d3.axisLeft(yScale));
    };

    function drawCircles(xScale, yScale, dataSet){
        dataMarkerGroup = prepareChart.selectAll("circle")
            .data(dataSet)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d[xData]))
            .attr("cy", d => yScale(d[yData]))
            .attr("r",10)
            .attr("fill","lightblue")
            .attr("opacity","1.0");

        return dataMarkerGroup;
    };

    function updateCircles(dataMarkerGroup, xData, xScale, yData, yScale) {
        dataMarkerGroup.transition()
            .duration(1000)
            .attr("cx", d => xScale(d[xData]))
            .attr("cy", d => yScale(d[yData]));
    }

    function addText(xScale, yScale, dataSet) {
        dataSet.forEach((d) => {
            prepareChart.append("text")
                .attr("x", xScale(d[xData]-0.45))
                .attr("y", yScale(d[yData]-0.2))
                .attr("fill","black")
                .attr("style","font-size:10px")
                .text(d.abbr)
        });
    };

    function labelAxes(xLabel, yLabel) {
        let xGroup = svgArea.append("g");
        let yGroup = svgArea.append("g");
        let titleGroup = svgArea.append("g");
        
        xGroup.append("text")
            .attr("x", (chartWidth /2) + margin.left)
            .attr("y",chartHeight + margin.top + 35 )
            .attr("style","text-anchor:middle")
            .attr("id","xAxisLabel")
            .text(xLabel)

        yGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 20)
            .attr("x",- (chartHeight /2 ) - margin.top)
            .attr("id","yAxisLabel")
            .attr("style","text-anchor:middle")
            .text(yLabel)

        titleGroup.append("text")
            .attr("x", (chartWidth /2) + margin.left)
            .attr("y", margin.top)
            .attr("value","title")
            .attr("style","text-anchor:middle")
            .text("Comparison of Demographics and Risk Factors in the United States")
    };
    function populateMenu(menu, data) {
        // generate options for the select menu, and link the associated index with the id option
        // This linkage will be used to select which data set to display
        data.forEach((entry,index) => {
            let selectMenu = d3.select(menu);
            let dataOption = selectMenu.append("option")
            dataOption.text(Object.values(entry));
            dataOption.attr('value', index); 
        });
    };
 
    var xScale = xAxisScale(rawData, xData);
    var yScale = yAxisScale(rawData, yData);

    drawAxis(xScale, yScale);
    dataMarkers = drawCircles(xScale, yScale, rawData);
    addText(xScale, yScale, rawData);
    labelAxes(xLabel,yLabel);
    populateMenu("#xdata", menuLabels);
    populateMenu("#ydata", menuLabels);
    d3.selectAll("select").on("change", function() {
        // retrieve new x axis data
        let xValue = d3.select("#xdata")
            .property("value");
        let dataX = Object.keys(menuLabels[xValue]);
        let xLabels = Object.values(menuLabels[xValue]);

        //retrieve new y axis data
        let yValue = d3.select("#ydata")
            .property("value");
        let dataY = Object.keys(menuLabels[yValue]);
        let yLabels = Object.values(menuLabels[yValue]);

        // update the chart with the new data
        d3.selectAll("#xAxisLabel").text(xLabels);
        d3.selectAll("#yAxisLabel").text(yLabels);
        var xScaleNew = xAxisScale(rawData,dataX);
        var yScaleNew = yAxisScale(rawData,dataY);

        updateAxis(xScaleNew, yScaleNew);
        updateCircles(dataMarkers, dataX, xScaleNew,dataY, yScaleNew);



        console.log(dataY)
    });
});
