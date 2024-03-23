const express = require('express');
const controller = require('./controllers.js');
const router = express.Router();

router.get('/reviews/:productId', controller.getAllReviews);
router.get('/reviews/meta/:productId', controller.getMetaData);
router.put('/reviews/helpful/:reviewId', controller.updateHelpfulCount);
router.put('/reviews/report/:reviewId', controller.reportReview);

router.post('/reviews', controller.postReview);


module.exports = router;