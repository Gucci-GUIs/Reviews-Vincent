const connection = require('./db');

function getAllReviews(productId) {
  const query = `
    SELECT
        reviews.*,
        json_agg(json_build_object('photo_id', review_photos.id, 'url', review_photos.url)) AS photos
    FROM
        reviews
    LEFT JOIN
        review_photos ON reviews.id = review_photos.review_id
    WHERE
        reviews.product_id = $1
    GROUP BY
        reviews.id`;
  const params = [productId];

  return connection.query(query, params)
    .then((result) => result.rows)
    .catch((error) => {
      throw error;
    });
}

function getMetaData(productId) {
  // Define queries for retrieving counts and averages separately
  const countQuery = `
    SELECT
      rating,
      COUNT(*) AS rating_count
    FROM
      reviews
    WHERE
      product_id = $1
    GROUP BY
      rating`;

  const recommendQuery = `
    SELECT
      recommend,
      COUNT(*) AS recommend_count
    FROM
      reviews
    WHERE
      product_id = $1
    GROUP BY
      recommend`;

  const avgCharacteristicRatingQuery = `
    SELECT
      AVG(characteristics_reviews.value) AS avg_characteristic_rating,
      characteristics.name AS characteristic_name,
      characteristics.id AS characteristic_id
    FROM
      reviews
    LEFT JOIN
      characteristics_reviews ON reviews.id = characteristics_reviews.review_id
    LEFT JOIN
      characteristics ON characteristics_reviews.characteristic_id = characteristics.id
    WHERE
      reviews.product_id = $1
    GROUP BY
      characteristics.id,
      characteristics.name`;

  const params = [productId];

  const countPromise = connection.query(countQuery, params);
  const recommendPromise = connection.query(recommendQuery, params);
  const avgCharacteristicRatingPromise = connection.query(avgCharacteristicRatingQuery, params);

  // Return a promise that resolves with an object containing the results of all queries
  return Promise.all([countPromise, recommendPromise, avgCharacteristicRatingPromise])
    .then((results) => {
      // destructure results
      const [ratingCountsResult, recommendCountsResult, avgCharacteristicRatingResult] = results;
      console.log(avgCharacteristicRatingResult.rows)
      return {
        ratingCounts: ratingCountsResult.rows,
        recommendCounts: recommendCountsResult.rows,
        avgCharacteristicRating: avgCharacteristicRatingResult.rows,
      };
    })
    .catch((error) => {
      throw error;
    });
}

// Function to post a review
function postReview(reviewData) {
  // Define the SQL query
  const reviewsQuery = `
    INSERT INTO reviews
        (product_id, rating,summary, body, recommend, reviewer_name, reviewer_email)
    VALUES
        ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id;`;
  // Define the parameters
  const reviewsParams = [
    reviewData.product_id,
    reviewData.rating,
    reviewData.summary,
    reviewData.body,
    reviewData.recommend,
    reviewData.name,
    reviewData.email,
  ];

  return connection.query(reviewsQuery, reviewsParams)
    .then((result) => {
      const reviewId = result.rows[0].id;
      // need to handle reivew_photo insert
      // add with review ID and url
      const photoQueryValues = reviewData.photos.map((url, index) => `($1, $${index + 2})`).join(', ');
      const photoQuery = `
    INSERT INTO review_photos (review_id, url)
    VALUES
    ${photoQueryValues}
    ON CONFLICT DO NOTHING;
    `;
      const photoParams = [reviewId, ...reviewData.photos];

      return connection.query(photoQuery, photoParams)
        .then(() => {
          // need to handle characteristics_review insert
          // add with characteristic_id, review_id, and value
          const characteristicQueryValues = Object.entries(reviewData.characteristics).map(([characteristicId, value], index) => `($1, $${index * 2 + 2}, $${index * 2 + 3})`).join(', ');
          console.log(characteristicQueryValues)
          const characteristicQuery = `
        INSERT INTO characteristics_reviews (review_id, characteristic_id, value)
        VALUES
        ${characteristicQueryValues}
        ON CONFLICT DO NOTHING;
      `;

          // Define the parameters for inserting characteristics reviews
          const characteristicsData = Object.entries(reviewData.characteristics)
            .flatMap(([characteristicId, value]) => [characteristicId, value]);

          const characteristicParams = [reviewId, ...characteristicsData];
          console.log(characteristicParams);

          // Execute the query to insert characteristics reviews
          return connection.query(characteristicQuery, characteristicParams);
        })
        .then(() => reviewId); // Return the ID of the inserted review
    })
    .catch((error) => {
      throw error;
    });
}

// Function to update helpful count for an individual review
function updateHelpfulCount(reviewId) {
  // Define the SQL query
  const query = 'UPDATE reviews SET helpfulness = COALESCE(helpfulness, 0) + 1 WHERE id = $1';
  // Define the parameters
  const params = [reviewId];

  // Execute the query using connection.query()
  return connection.query(query, params)
    .catch((error) => {
      throw error;
    });
}

// Function to change a report status to true for an individual review
function reportReview(reviewId) {
  // Define the SQL query
  const query = 'UPDATE reviews SET reported = TRUE WHERE id = $1';
  // Define the parameters
  const params = [reviewId];

  // Execute the query using connection.query()
  return connection.query(query, params)
    .catch((error) => {
      throw error;
    });
}

module.exports = {
  getAllReviews,
  getMetaData,
  postReview,
  updateHelpfulCount,
  reportReview,
};
