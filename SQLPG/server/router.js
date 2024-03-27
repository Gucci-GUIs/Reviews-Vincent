const express = require('express');
const controller = require('./controllers.js');
const router = express.Router();
const { cacheMiddleware } = require("../Cache/cache.js");


router.get('/reviews/:productId', cacheMiddleware, controller.getAllReviews);
router.get('/reviews/meta/:productId', cacheMiddleware, controller.getMetaData);
router.put('/reviews/helpful/:reviewId', controller.updateHelpfulCount);
router.put('/reviews/report/:reviewId', controller.reportReview);

router.post('/reviews', controller.postReview);


module.exports = router;