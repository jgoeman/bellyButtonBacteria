function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

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

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
  // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    let metaData = data.metadata;
    // Create a variable that holds the first sample in the array.
    let guageResultArray = metaData.filter(bellyObj => bellyObj.id == sample);

    // 2. Create a variable that holds the first sample in the metadata array.
    let guageResult = guageResultArray[0]
  
    // 3. Create a variable that holds the samples array. 
    let samplesArray = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    let filteredSamples = samplesArray.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    let filterSampleResult = filteredSamples[0]
    console.log(filterSampleResult)
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let otuIds = filterSampleResult.otu_ids;
    let sampleValues = filterSampleResult.sample_values.slice(0,10).reverse();
    let otuLabels = filterSampleResult.otu_labels.slice(0,10);
    let bubbley = filterSampleResult.sample_values;
    let bubbleyLabels = filterSampleResult.otu_labels;
    // 3. Create a variable that holds the washing frequency.
    let guageValue = parseFloat(guageResult.wfreq);
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    
    var yticks =  otuIds.map(sampleObj => "OTU " + sampleObj + " ").slice(0, 10).reverse();
    
    console.log(yticks)
    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues,
      y: yticks,
      type:"bar",
      orientation: "h",
      text: otuLabels 
    }
      
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top Ten Bacteria Cultures"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout)
    
    // 1. Create the trace for the bubble chart.
        var bubbleData = [{
        x: otuIds,
        y: bubbley,
        text: bubbleyLabels,
        mode: 'markers',
        marker: {
          color: bubbley,
          size: bubbley,
          colorscale: 'Picnic'
        }
      }];
      
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      plot_bgcolor: "#A9A9A9",
      paper_bgcolor: "#FF7F00",
      xaxis: {title: "OTU ID"}

    };
    
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{    
      value: guageValue,
      title: { text: "Belly Button Washing Frequecy \n Scrubs Per Week" },
      type: "indicator",
      mode: "gauge+number",
      gauge: {
        axis: {range: [null, 10], tickwidth: 2, tickcolor: "black"},
        bar:{color: "black"},
        bgcolor: "white",
      
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange"},
          { range: [4,6], color: "yellow"},
          { range: [6,8], color: "lime"},
          { range: [8,10], color: "green"},
        ]
      }

    }
     
    ];
    
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      width: 500, height: 500, margin: { t: 0, b: 0 }
     
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge",gaugeData,gaugeLayout);
  });
}


