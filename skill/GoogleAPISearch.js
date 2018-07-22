const https = require('https');

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_PLACES_URI = process.env.GOOGLE_PLACES_URI;

const MAX_PLACES = 10; // max 10 places
const DEFAULT_RADIUS = 500; // radius in meter

/**
 * Get N restaurants near the location and in the radius given
 * @param {Object} data - object with all informations for the search
 * @param {string} data.location - 'latitude,longitude' of the client
 * @param {string} data.type - type of place we want search
 * @param {string} data.keyword - keyword to refine the search
 * @param {number} numberOfPlaces - number of places we want
 * @param {number} radius - radius of the search in meter
 * @returns {Object[]} result - array of places
 */
exports.getAllRestaurantsNear = ( data, numberOfPlaces = MAX_PLACES, radius = DEFAULT_RADIUS ) => {
    return new Promise( (resolve, reject) => {

        const location = data.location; // latitude,longitude
        const type = data.type ? data.type : 'restaurant';
        const keyword = data.keyword ? data.keyword : '';
        
        numberOfPlaces = (numberOfPlaces > 10 || !numberOfPlaces) ? MAX_PLACES : numberOfPlaces; // carousel can't have more than 10 items
        radius = (!parseInt(radius) || !radius) ? DEFAULT_RADIUS : radius;

        // create the filter of our search
        const params = `key=${GOOGLE_API_KEY}&location=${location}&radius=${radius}&type=${type}&keyword=${keyword}`;
        const url = `${GOOGLE_PLACES_URI}json?${params}`;

        https.get(url, response => {
            let body = '';
            // get the body of the request
            response.on('data', chunk => body += chunk);
            
            response.on('end', () => {
                // parse the body
                const bodyObject = JSON.parse(body);
                // array of places
                const arrOfPlaces = bodyObject.results;
                // result with N places
                const result = arrOfPlaces.slice(0, numberOfPlaces).map(place => place); 
                // if we have some results we return it, else we research by enlarging the radius
                result.length > 0 ? resolve(result) : resolve(this.getAllRestaurantsNear(data, numberOfPlaces, radius + 500));
            });

        }).on('error', error => reject(error));
    });
};
