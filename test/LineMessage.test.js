const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");

const lineMessage = require('../skill/LineMessage');

chai.use(chaiAsPromised);
chai.should();

const DATA_NULL = null;
const DATA_EMPTY = [];
const DATA_INVALID = [{
   location: {
        lat: 35.69114769999999,
        lng: 139.702061
    },
    name: "Kyōmachi Koishigure Shinjuku",
    open_now: true,
    price: 2,
    rate: 3.6
}];

const DATA = [
    {
        geometry: {
            location: {
                lat: 35.69114769999999,
                lng: 139.702061
            }
        },
        name: "Kyōmachi Koishigure Shinjuku",
        opening_hours: {
            open_now: true
        },
        price_level: 2,
        rating: 3.6
    }
];

describe('LineMessage', () => {
    describe('#getCarouselMessage', () => {

        it('should be rejected, if data is null', () => {
           lineMessage.getCarouselMessage(DATA_NULL).should.be.eventually.rejected;
        });

        it('should be rejected, if data is a empty Array', () => {
            lineMessage.getCarouselMessage(DATA_EMPTY).should.be.eventually.rejected;
        });

        it('should be rejected, if data is invalid', () => {
            lineMessage.getCarouselMessage(DATA_INVALID).should.be.eventually.rejected;
        });

        it('should be resolved, if data is correct', async () => {
            const result = await lineMessage.getCarouselMessage(DATA);
            result.should.be.an('Object');
            result.should.be.not.empty;
        });
    })
});
