// Loading in URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Function to create bar chart
function BarChart(data, id) {
    const sampleData = data.samples.find(sample => sample.id === id);

    // Extract necessary data for the bar chart
    const barValues = sampleData.sample_values.slice(0, 10).reverse();
    const barLabels = sampleData.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();
    const barDescriptions = sampleData.otu_labels.slice(0, 10).reverse();

    // Create the trace for the bar chart
    let trace = {
        x: barValues,
        y: barLabels,
        text: barDescriptions,
        type: 'bar',
        orientation: 'h'
    };

    // Create the layout for the bar chart
    var layout = {
        title: `Top 10 OTUs for Sample ${id}`,
        height: 600,
        width: 500
    };

    // Create and display the bar chart
    Plotly.newPlot('bar', [trace], layout);
}

// Function to create bubble chart
function BubbleChart(data, id) {
    const sampleData = data.samples.find(sample => sample.id === id);

    // Extract necessary data for the bubble chart
    const bubbleXValues = sampleData.otu_ids;
    const bubbleYValues = sampleData.sample_values;
    const bubbleMarkerSizes = sampleData.sample_values;
    const bubbleMarkerColors = sampleData.otu_ids;
    const bubbleTextValues = sampleData.otu_labels;

    // Create the trace for the bubble chart
    const trace = {
        x: bubbleXValues,
        y: bubbleYValues,
        text: bubbleTextValues,
        mode: 'markers',
        marker: {
            size: bubbleMarkerSizes,
            color: bubbleMarkerColors,
            colorscale: 'Viridis',
            opacity: 0.6,
        }
    };

    // Create the layout for the bubble chart
    const layout = {
        title: `Bubble Chart for Sample ${id}`,
        xaxis: {
            title: 'OTU ID',
        },
        yaxis: {
            title: 'Sample Values',
        },
        showlegend: false,
        height: 600,
        width: 1000
    };

    // Create and display the bubble chart
    Plotly.newPlot('bubble', [trace], layout);
}

// Function to display sample metadata
function displayMetadata(data, id) {
    const metadata = data.metadata.find(item => item.id == id);
    const metadataPanel = d3.select("#sample-metadata");

    // Clear existing metadata
    metadataPanel.html("");

    // Loop through the metadata and display key-value pairs
    Object.entries(metadata).forEach(([key, value]) => {
        metadataPanel.append("p").text(`${key}: ${value}`);
    });
}

// Load data and initialize the page
d3.json(url).then(function(data) {
    let namesList = data.names;
    console.log("id list", namesList);
    let dropdown = d3.select("#selDataset");

    // Add options to the dropdown
    namesList.forEach(function(name) {
        dropdown.append("option").text(name).property("value", name);
    });

    // Event listener for dropdown change
    dropdown.on("change", function () {
        let id = this.value;
        BarChart(data, id);
        BubbleChart(data, id);
        displayMetadata(data, id);
        console.log("This is the value of the id", id);
    });

    // Initialize the page with the first sample ID
    let initialSample = namesList[0];
    BarChart(data, initialSample);
    BubbleChart(data, initialSample);
    displayMetadata(data, initialSample);
    console.log("Initial starting ID value", initialSample);
});