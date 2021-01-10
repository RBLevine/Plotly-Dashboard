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
    d3.json("/data/samples.json").then(function(data) {
        
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
        Object.defineProperties(demoInfo).forEach(([key,value]) => {
            demoTable.append("h5").text(`${key}: ${value}`);
        });
    });
};



// Changed selection function
function selectionChanged(id) {
    getStats(id);
    createCharts(id);
};

init();