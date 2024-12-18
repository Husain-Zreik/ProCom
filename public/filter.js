import { readFile, writeFile } from 'fs';

function filterGeoJSON(inputFile, outputFile) {
    // Read the input GeoJSON file
    readFile(inputFile, 'utf8', (err, data) => {
        if (err) throw err;

        // Parse the GeoJSON data
        const geoData = JSON.parse(data);

        // Filter the features to keep only necessary fields
        const filteredData = {
            type: geoData.type,
            features: geoData.features.map(feature => {
                return {
                    type: feature.type,
                    properties: {
                        sovereign: feature.properties.sovereignt
                    },
                    geometry: {
                        type: feature.geometry.type,
                        coordinates: feature.geometry.coordinates
                    }
                };
            })
        };

        // Write the filtered data to a new file
        writeFile(outputFile, JSON.stringify(filteredData, null, 2), (err) => {
            if (err) throw err;
            console.log('Filtered GeoJSON saved!');
        });
    });
}

// Example usage
filterGeoJSON('geo.json', 'filtered.json');
