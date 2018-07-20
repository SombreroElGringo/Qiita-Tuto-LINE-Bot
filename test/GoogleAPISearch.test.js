const chai = require('chai');
const chaiAsPromised = require("chai-as-promised");

const googleAPISearch = require('../skill/GoogleAPISearch');

chai.use(chaiAsPromised);
chai.should();

const DATA_NULL = null;
const DATA_EMPTY = {};
const DATA_INVALID = {
    location: '123,azerty',
    type: 123,
    keyword: '',
};
const DATA = {
    location: '35.6893644,139.7017639',
    type: 'restaurant',
    keyword: '',
};

describe('GoogleAPISearch', () => {
    describe('#getAllRestaurantsNear', () => {

        it('should be rejected, if data is null', () => {
            googleAPISearch.getAllRestaurantsNear(DATA_NULL).should.be.eventually.rejected;
        });

        it('should be rejected, if data is a empty Object', () => {
            googleAPISearch.getAllRestaurantsNear(DATA_EMPTY).should.be.eventually.rejected;
        });

        it('should be rejected, if data is invalid', () => {
            googleAPISearch.getAllRestaurantsNear(DATA_INVALID).should.be.eventually.rejected;
        });

        it('should be resolved, if data is correct', async () => {
            const result = await googleAPISearch.getAllRestaurantsNear(DATA);
            result.should.be.an('array');
            result.should.be.not.empty;
        });
    })
});
