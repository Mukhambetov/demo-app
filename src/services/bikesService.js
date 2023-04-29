const BikeRepository = require('../repositories/bikeRepository');
const logger = require("../helpers/logger");

class BikeService {
    list(filter, page, pageSize, user) {
        const {upperLeftLat, upperLeftLng, lowerRightLat, lowerRightLng} = filter;
        const queryFilter = {...filter};

        if (upperLeftLat && upperLeftLng && lowerRightLat && lowerRightLng) {
            queryFilter.location = {
                minLat: parseFloat(upperLeftLat),
                maxLat: parseFloat(lowerRightLat),
                minLng: parseFloat(upperLeftLng),
                maxLng: parseFloat(lowerRightLng),
            };
        }

        logger.debug({
            ...queryFilter,
            page,
            pageSize,
            user,
        }, 'List of Bikes by location')
        return BikeRepository.list(queryFilter, page, pageSize);
    }

    count(filter, user) {
        const {upperLeftLat, upperLeftLng, lowerRightLat, lowerRightLng} = filter;
        const queryFilter = {...filter};

        if (upperLeftLat && upperLeftLng && lowerRightLat && lowerRightLng) {
            queryFilter.location = {
                minLat: parseFloat(upperLeftLat),
                maxLat: parseFloat(lowerRightLat),
                minLng: parseFloat(upperLeftLng),
                maxLng: parseFloat(lowerRightLng),
            };
        }

        logger.debug({
            ...queryFilter,
            user
        }, 'Count of bikes')
        return BikeRepository.count(filter);
    }

    get(bikeId, user) {
        logger.debug({
            bikeId,
            user
        }, 'Count of bikes');
        return BikeRepository.get(bikeId)
    }
}

module.exports = new BikeService();
