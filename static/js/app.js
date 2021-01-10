// Grab user input field
var dropDown = d3.select("#selDataset");

// Get metadata div
var demoTable = d3.select("#sample-metadata");

// Get bar chart and bubble chart divs
var barChart = d3.select("#bar");
var bubbleChart = d3.select("#bubble");

// Create init screen
function init() {
    // Read json file
    d3.json("data/samples.json").then(function(data) {
        
        // Get items for the drop down
        var dropDownItems = data.names;

        // Add the dropDownItems to the dropDown menu
        for (var x = 0; x < dropDownItems.length; x++) {
            dropDown.append("option").text(dropDownItems[x]);
        };

        // Display data and plots
        getStats(dropDownItems[0]);
        createCharts(dropDownItems[0]);
    });
};

// Function to get metadata
function getStats(id) {
     
    // Read json file
    d3.json("data/samples.json").then((data) => {
         
        // Clear demographic table
        demoTable.html("");

        // Get infor for demoTable
        var demoInfo = data.metadata.filter(meta => meta.id.toString() === id)[0];
        console.log(demoInfo);

        // Add metadata demoInfo by key and value
        Object.entries(demoInfo).forEach(([key,value]) => {
            demoTable.append("h5").text(`${key}: ${value}`);
        });
    });
};

// Create charts function
function createCharts(id) {
     
    // Read json file
    d3.json("data/samples.json").then((data) => {

        // Arrays for sample data
        var otuIds = [];
        var otuLabels = [];
        var sampleVals = [];

        // Filter samples
        var idSample = data.samples.filter(item => item.id == id)[0];
        console.log(idSample);

        // Populate empty arrays from filtered data
        Object.entries(idSample).forEach(([key,value]) => {
            switch(key) {
                case "otu_ids":
                    otuIds.push(value);
                    break;
                case "sample_values":
                    sampleVals.push(value);
                    break;
                case "otu_labels":
                    otuLabels.push(value);
                    break;
                default:
                    break;
            };
        });

        // Get the top 10
        var tenotuIds = otuIds[0].slice(0,10).reverse();
        console.log("top ten Ids")
        console.log(tenotuIds);
        var tenotuIdsForm = tenotuIds.map(otuId => "OTU "+otuId);
        console.log("top ten Ids form");
        console.log(tenotuIdsForm);

        var tenotuLabels = otuLabels[0].slice(0,10).reverse();
        console.log(tenotuLabels);

        var tenSampleVals = sampleVals[0].slice(0,10).reverse();
        console.log(tenSampleVals);

        // * Bar Chart *

        var barChartTrace = {
            x: tenSampleVals,
            y: tenotuIdsForm,
            text: tenotuLabels,
            type: 'bar',
            orientation: 'h',
            marker: {
                color: 'rgb(108,195,222)'
            }            
        };

        var barChartLayout = {
            height: 400,
            width: 400,
            hoverlabel: {
                font: {
                    family: 'Arno Pro'
                }
            },
            title: {
                text: `<b>Top OTUs for Subject ID: ${id}</b>`,
                font: {
                    size: 15,
                    color: 'rgb(25,86,106)'
                }
            },
            xaxis: {
                title: "<b>Sample Values</b>",
                color: 'rgb(25,86,106)'
            },
            yaxis: {
                tickfont: {size: 12}
            }
        };  

        // Plot
        Plotly.newPlot("bar",[barChartTrace],barChartLayout);

        // * Bubble Chart *
        
        // Set up variables
        var filteredSample = data.samples.filter(sample => sample.id == id)[0];
        var xVals = filteredSample.otu_ids;
        var yVals = filteredSample.sample_values;
        var textVals = filteredSample.otu_labels;

        var bubbleChartTrace = {
            x: xVals,
            y: yVals,
            text: textVals,
            mode: 'markers',
            marker: {
                size: yVals,
                color: xVals,
                colorscale: 'YlGnBu'
            },
            type: 'scatter'
        };

        var bubbleChartLayout = {
            font:{
                family: 'Arno Pro'
            },
            hovermode: 'closest',
            hoverlabel: {
                font: {
                    family: 'Arno Pro'
                }
            },
            xaxis: {
                title: "<b>OTU ID</b>",
                color: 'rgb(25,86,106)'
            },
            yaxis: {
                title: "<b>Sample Values</b>",
                color: 'rgb(25,86,106)'
            },
            showlegend: false
        };
    
        // Plot
        Plotly.newPlot("bubble", [bubbleChartTrace],bubbleChartLayout);
    });

    
};

// Changed selection function
function optionChanged(id) {
    getStats(id);
    createCharts(id);
};

init();