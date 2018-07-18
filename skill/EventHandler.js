const googleApiSearch = require('./GoogleAPISearch');
const lineMessage = require('./LineMessage');

/**
 * Handle the event.message of type location and reply to the client 
 * with a carousel with a list of restaurant near of his location
 * @param {Object} event - Event sended from LINE
 * @param {Object} client - LINE client
 * @returns {Promise} result - Message well sent
 */
exports.handleLineLocationMessage = async (event, client) => {
    try {
        if (!event.message) return null; // if the message is null

        if (event.message.type === 'location') {
            const data = {
                location: `${event.message.latitude},${event.message.longitude}`, // 'latitude,longitude'
                type: 'restaurant', // we want to look for restaurants
                keyword: '', // of any type, if you only want Italian restaurants or ... you can add keywords
            };
            // fetch all restaurants near the location given
            const places = await googleApiSearch.getAllRestaurantsNear(data);
            // create the structure of the message Carrousel to return to the LINE client
            const message = await lineMessage.getCarouselMessage(places);
            // send the message to the LINE client
            return await client.replyMessage(event.replyToken, message);
        } else {
            return null; // if the event.message.type is not a location
        }
    } catch (error) {
        return error;
    };   
};
