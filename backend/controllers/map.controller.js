const mapService = require('../services/maps.service');
const { validationResult } = require('express-validator');


module.exports.getCoordinates = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }


    const { address } = req.query;

    try {
        const coordinates = await mapService.getAddressCoordinate(address);
        res.status(200).json(coordinates);
    } catch (error) {
        res.status(404).json({ message: 'Coordinates not found' });
    }
}

module.exports.getDistanceTime = async (req, res, next) => {

    try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { origin, destination } = req.query;

        const distanceTime = await mapService.getDistanceTime(origin, destination);

        res.status(200).json(distanceTime);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.getAutoCompleteSuggestions = async (req, res, next) => {
    console.log('Received request for suggestions:', {
        input: req.query.input,
        headers: req.headers
    });

    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('Validation errors:', errors.array());
            return res.status(400).json({ 
                message: 'Invalid input parameters',
                errors: errors.array() 
            });
        }

        const { input } = req.query;
        
        if (!input || input.trim().length === 0) {
            console.log('Empty input received');
            return res.status(400).json({ 
                message: 'Input parameter is required'
            });
        }

        console.log('Fetching suggestions for input:', input);
        const suggestions = await mapService.getAutoCompleteSuggestions(input);

        // If no suggestions found, return empty array instead of error
        if (!suggestions || suggestions.length === 0) {
            console.log('No suggestions found');
            return res.status(200).json([]);
        }

        console.log(`Found ${suggestions.length} suggestions`);
        res.status(200).json(suggestions);
    } catch (err) {
        console.error('Error in getAutoCompleteSuggestions controller:', {
            error: err.message,
            stack: err.stack,
            input: req.query.input
        });

        // Check for specific error types
        if (err.message === 'Google Maps API key is not configured') {
            return res.status(500).json({ 
                message: 'Server configuration error. Please contact support.',
                error: 'MAPS_API_KEY_MISSING'
            });
        }

        if (err.message.includes('Google Places API error')) {
            return res.status(503).json({ 
                message: 'Location service temporarily unavailable',
                error: 'PLACES_API_ERROR'
            });
        }

        if (err.message.includes('Unable to connect to Google Maps API')) {
            return res.status(503).json({ 
                message: 'Location service is currently unreachable',
                error: 'NETWORK_ERROR'
            });
        }

        res.status(500).json({ 
            message: 'Failed to fetch location suggestions',
            error: 'INTERNAL_SERVER_ERROR'
        });
    }
}