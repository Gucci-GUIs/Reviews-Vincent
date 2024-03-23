const models = require('../database/queries.js');

exports.getAllReviews = (req, res) => {
  // res.sendStatus(418);
  const { productId } = req.params;
  models.getAllReviews(productId)
    .then((reviews) => res.json(reviews))
    .catch((err) => res.sendStatus(500));
};

function formatMetaData(metadata) {
  // Initialize objects to store formatted data
  const ratings = {};
  const recommended = {};
  const characteristics = {};

  // Format rating counts
  metadata.ratingCounts.forEach((item) => {
    ratings[item.rating.toString()] = item.rating_count.toString();
  });

  // Format recommendation counts
  metadata.recommendCounts.forEach((item) => {
    recommended[item.recommend.toString()] = item.recommend_count.toString();
  });

  // Format characteristic ratings
  metadata.avgCharacteristicRating.forEach((item) => {
    characteristics[item.characteristic_name] = {
      id: item.characteristic_id,
      value: item.avg_characteristic_rating.toString()
    };
  });

  // Return the formatted data
  return { ratings, recommended, characteristics };
}

exports.getMetaData = (req, res) => {
  const { productId } = req.params;
  models.getMetaData(productId)
    .then((metadata) => {
      const formattedMetadata = formatMetaData(metadata);
      res.json(formattedMetadata);
    })
    .catch((error) => res.status(500).send(error.message));
};

exports.postReview = (req, res) => {
  const reviewData = req.body;
  models.postReview(reviewData)
    .then((reviewId) => res.status(201).json({ reviewId }))
    .catch((error) => res.status(500).send(error.message));
};

exports.updateHelpfulCount = (req, res) => {
  const { reviewId } = req.params;
  models.updateHelpfulCount(reviewId)
    .then(() => res.status(204).send())
    .catch((error) => res.status(500).send(error.message));
};

exports.reportReview = (req, res) => {
  const { reviewId } = req.params;
  models.reportReview(reviewId)
    .then(() => res.status(204).send())
    .catch((error) => res.status(500).send(error.message));
};
