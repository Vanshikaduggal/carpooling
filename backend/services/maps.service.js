const axios = require('axios');
const captainModel = require('../models/captain.model');

module.exports.getAddressCoordinate = async (address) => {
    const apiKey = process.env.GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {
            const location = response.data.results[ 0 ].geometry.location;
            return {
                ltd: location.lat,
                lng: location.lng
            };
        } else {
            throw new Error('Unable to fetch coordinates');
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        if (response.data.status === 'OK') {

            if (response.data.rows[ 0 ].elements[ 0 ].status === 'ZERO_RESULTS') {
                throw new Error('No routes found');
            }

            return response.data.rows[ 0 ].elements[ 0 ];
        } else {
            throw new Error('Unable to fetch distance and time');
        }

    } catch (err) {
        console.error(err);
        throw err;
    }
}

module.exports.getAutoCompleteSuggestions = async (input) => {
    console.log('Starting getAutoCompleteSuggestions with input:', input);

    if (!input) {
        throw new Error('query is required');
    }

    const apiKey = process.env.GOOGLE_MAPS_API;
    if (!apiKey) {
        console.error('Google Maps API key is missing in environment variables');
        throw new Error('Google Maps API key is not configured');
    }

    console.log('Using API key:', apiKey.substring(0, 10) + '...');

    try {
        // First try to get place predictions
        const predictionsUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&types=geocode&components=country:in&key=${apiKey}`;
        console.log('Making request to Places API:', predictionsUrl.replace(apiKey, 'API_KEY_HIDDEN'));
        
        const predictionsResponse = await axios.get(predictionsUrl);
        console.log('Places API Response status:', predictionsResponse.data.status);
        console.log('Places API Response:', JSON.stringify(predictionsResponse.data, null, 2));

        // If no predictions found, try geocoding
        if (predictionsResponse.data.status === 'ZERO_RESULTS') {
            console.log('No predictions found, trying geocoding API');
            const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(input)}&key=${apiKey}`;
            console.log('Making request to Geocoding API:', geocodeUrl.replace(apiKey, 'API_KEY_HIDDEN'));
            
            const geocodeResponse = await axios.get(geocodeUrl);
            console.log('Geocoding API Response status:', geocodeResponse.data.status);
            console.log('Geocoding API Response:', JSON.stringify(geocodeResponse.data, null, 2));
            
            if (geocodeResponse.data.status === 'OK') {
                const result = geocodeResponse.data.results[0];
                return [{
                    description: result.formatted_address,
                    placeId: result.place_id,
                    mainText: result.formatted_address,
                    secondaryText: '',
                    location: result.geometry.location
                }];
            }
            return [];
        }

        // Process autocomplete results
        if (predictionsResponse.data.status === 'OK') {
            const predictions = predictionsResponse.data.predictions.map(prediction => ({
                description: prediction.description,
                placeId: prediction.place_id,
                mainText: prediction.structured_formatting?.main_text || prediction.description,
                secondaryText: prediction.structured_formatting?.secondary_text || '',
                location: null
            }));
            console.log('Processed predictions:', JSON.stringify(predictions, null, 2));
            return predictions;
        } else if (predictionsResponse.data.status === 'ZERO_RESULTS') {
            console.log('No results found');
            return [];
        } else if (predictionsResponse.data.status === 'INVALID_REQUEST') {
            throw new Error('Invalid request to Places API');
        } else if (predictionsResponse.data.status === 'OVER_QUERY_LIMIT') {
            throw new Error('Places API query limit exceeded');
        } else if (predictionsResponse.data.status === 'REQUEST_DENIED') {
            console.error('Places API request denied. Full response:', predictionsResponse.data);
            throw new Error('Places API request was denied. Please check your API key');
        } else {
            console.error('Unexpected Places API response:', predictionsResponse.data);
            throw new Error(`Google Places API error: ${predictionsResponse.data.status}`);
        }
    } catch (err) {
        console.error('Error in getAutoCompleteSuggestions:', {
            message: err.message,
            stack: err.stack,
            input: input,
            response: err.response?.data,
            status: err.response?.status,
            headers: err.response?.headers
        });
        
        // Check if it's an axios error with response
        if (err.response) {
            console.error('API Error Response:', {
                status: err.response.status,
                data: err.response.data,
                headers: err.response.headers
            });
        }
        
        // Check if it's a network error
        if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
            throw new Error('Unable to connect to Google Maps API. Please check your internet connection.');
        }
        
        throw new Error(err.message || 'Failed to fetch location suggestions');
    }
}

module.exports.getCaptainsInTheRadius = async (ltd, lng, radius) => {

    // radius in km


    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [ [ ltd, lng ], radius / 6371 ]
            }
        }
    });

    return captains;


}