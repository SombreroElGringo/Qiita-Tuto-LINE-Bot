const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_STATIC_MAP_URI = process.env.GOOGLE_STATIC_MAP_URI;

/**
 * Create the carousel structure with the places given
 * @param {Object[]} data - array of places
 * @returns {Object} message - the carousel to send to the client
 */
exports.getCarouselMessage = (data) => {
    return new Promise( (resolve, reject) => {
        if (data.length === 0) reject('data must have at least 1 item');
        // each column of the carousel 
        // more info https://developers.line.me/en/reference/messaging-api/#carousel
        let columns = data.map(place => {
            let column = {
                thumbnailImageUrl: place.photos ? `${GOOGLE_STATIC_MAP_URI}?center=${place.geometry.location.lat},${place.geometry.location.lng}&markers=${place.geometry.location.lat},${place.geometry.location.lng}&size=500x300&zoom=15&format=png&key=${GOOGLE_API_KEY}` : '',
                imageBackgroundColor: '#FFFFFF',
                title: place.name,
                text: `${!place.opening_hours ? '' : `Open: ${place.opening_hours.open_now ? 'Yes' : 'No'}`} ${place.price_level ? `Price: ${place.price_level}/4` : '' } ${place.rating ? `Rating: ${place.rating}/5` : '' }`,
                // when the user will click on 'Get direction' he will be redirect on Google Map
                // with the route to the restaurant
                actions: [
                    {
                        type: 'uri',
                        label: 'Get direction',
                        uri: `http://maps.google.com/maps?q=${place.geometry.location.lat},${place.geometry.location.lng}`
                    }
                ]
            };
            return column;
        });

        // Max: 10 columns
        columns = columns.slice(0, 9);

        const message = {
            type: 'template',
            altText: `Restaurants!`,
            template: {
                type: 'carousel',
                columns,
                imageAspectRatio: 'rectangle',
                imageSize: 'cover'
            }
        };

        resolve(message);
    });
};
