function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
  var sampleNames = data.names;
  //console.log(data);
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}
// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");
 
    // Use `.html("") to clear any existing metadata
    PANEL.html("");
  
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}


//  Create the buildCharts function.
function buildCharts(sample) {
  //  Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    //  Create a variable that holds the samples array. 
    var samples = data.samples;
    //  Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    // DEV3-QUEST1: Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;
    var metadataArray = metadata.filter(sampleObj => sampleObj.id == sample);
    //  Create a variable that holds the first sample in the array.
    var result = resultArray[0]; 
    // DEV3-QUEST2: Create a variable that holds the first sample in the metadata array.
    var metaresults = metadataArray[0];
    //  Create variables that hold the otu_ids, otu_labels, and sample_values.
    var PANEL = d3.select("#sample-metadata");  
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;
    // DEV3-QUEST3: Create a variable that holds the washing frequency.
    var washing_frequency = metaresults.wfreq;
    //  Create the yticks for the bar chart. Hint: Get the the top 10 otu_ids and map them in descending order so the otu_ids with the most bacteria are last. 
    var yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();




    //################################################################################
    //  Create the trace for the bar chart. 
    var barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      } 
    ];
    //  Create the layout for the bar chart. 
    var barLayout = {
      width: 500, height: 500,
      title: "Top 10 Bacteria Cultures",
      margin: { t: 30, l: 150 }   
    };
    //  Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout); 






    //#################################################################################
    //  Create the trace for the bubble chart.
    var bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Navy"
        }
      }
    ];
    //  Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30} 
    };  
    //  Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);





    //##################################################################################
    //  Create the trace for the gauge chart.
    var gaugeData = [{
      domain: { x: [0, 1], y: [0, 1] },
      value: washing_frequency,
      type: "indicator",
      mode: "gauge+number",
      title: { text: "<b> Belly Button Washing Frequency</b> <br> # of Scrubs per Week" },
      gauge: {
        axis: { range: [null, 10], tickwidth: 2, tickcolor: "black" },
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "firebrick" },
          { range: [2, 4], color: "darkorange" },
          { range: [4, 6], color: "greenyellow" },
          { range: [6, 8], color: "lightseagreen" },
          { range: [8, 10], color: "dodgerblue" }
        ],
        threshold: {
          value: washing_frequency,
        }
      },
      
    }];
    //  Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 600, height: 500, margin: { t: 0, b: 0 },
      font: { color: "black"}
    };
    //  Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}