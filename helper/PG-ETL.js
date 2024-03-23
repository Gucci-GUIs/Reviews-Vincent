const { Pool } = require('pg');
const path = require('path');

const pool = new Pool({
  // host: process.env.POSTGRES_HOST,
  // user: process.env.POSTGRES_USER,
  // password: process.env.POSTGRES_PASSWORD,
  database: 'reviews',
  port: 5432,
});

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});
pool.on('error', (err) => {
  console.log('Error connecting to PostgreSQL database', err);
  process.exit(-1);
});
pool.on('end', () => {
  console.log('PostgreSQL client connection closed.');
});

// Function to load data into reviews table
function loadReviews() {
  const pathReviews = path.join(__dirname, '../data/reviews.csv');
  console.time('Loading reviews');
  return pool.query(`COPY reviews(id, product_id, rating, temp_date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) FROM '${pathReviews}' WITH CSV HEADER`)
    .then(() => {
      console.timeEnd('Loading reviews');
      // console.log('Data loaded into reviews table.');
      // Update review dates and drop temp_date column
      console.log('Converting review dates...');
      console.time('Updating review dates');
      return pool.query(`
        UPDATE reviews
        SET date = to_timestamp(temp_date / 1000.0);
        ALTER TABLE reviews
        DROP COLUMN temp_date;
      `);
    })
    .then(() => {
      console.log('Review dates updated and temp_date column dropped.');
      console.timeEnd('Updating review dates');
    })
    .then(() => {
      // Get the maximum ID value from the reviews table
      return pool.query('SELECT MAX(id) AS max_id FROM reviews');
    })
    .then((result) => {
      const maxId = result.rows[0].max_id;
      // Reset the sequence to start from the maximum ID value
      return pool.query(`ALTER SEQUENCE reviews_id_seq RESTART WITH ${maxId + 1}`);
    })
    .then(() => {
      console.log('Auto-increment of reviews ID field reset.');
      // Additional processing or logging if needed
    })
    .catch((err) => {
      console.error('Error loading reviews data:', err);
      throw err; // Propagate the error to the caller
    });
}

// Function to load data into photos table
function loadPhotos() {
  const pathPhotos = path.join(__dirname, '../data/reviews_photos.csv');
  console.time('Loading review_photos');
  return pool.query(`COPY review_photos(id, review_id, url) FROM '${pathPhotos}' WITH CSV HEADER`)
    .then(() => {
      console.timeEnd('Loading review_photos');
      // console.log('Data loaded into photos table.');
    })
    .then(() => {
      // Get the maximum ID value from the reviews table
      return pool.query('SELECT MAX(id) AS max_id FROM review_photos');
    })
    .then((result) => {
      const maxId = result.rows[0].max_id;
      // Reset the sequence to start from the maximum ID value
      return pool.query(`ALTER SEQUENCE review_photos_id_seq RESTART WITH ${maxId + 1}`);
    })
    .then(() => {
      console.log('Auto-increment of photos ID field reset.');
      // Additional processing or logging if needed
    })
    .catch((err) => {
      console.error('Error loading photos data:', err);
      throw err; // Propagate the error to the caller
    });
}

// Function to load data into characteristics table
function loadCharacteristics() {
  const pathChar = path.join(__dirname, '../data/characteristics.csv');
  console.time('Loading characteristics');
  return pool.query(`COPY characteristics(id, product_id, name) FROM '${pathChar}' WITH CSV HEADER`)
    .then(() => {
      console.timeEnd('Loading characteristics');
      // console.log('Data loaded into characteristics table.');
    })
    .then(() => {
      // Get the maximum ID value from the reviews table
      return pool.query('SELECT MAX(id) AS max_id FROM characteristics');
    })
    .then((result) => {
      const maxId = result.rows[0].max_id;
      // Reset the sequence to start from the maximum ID value
      return pool.query(`ALTER SEQUENCE characteristics_id_seq RESTART WITH ${maxId + 1}`);
    })
    .then(() => {
      console.log('Auto-increment of characteristics ID field reset.');
      // Additional processing or logging if needed
    })
    .catch((err) => {
      console.error('Error loading characteristics data:', err);
      throw err; // Propagate the error to the caller
    });
}

// Function to load data into characteristics_reviews table
function loadCharacteristicReviews() {
  const pathCharacteristicReviews = path.join(__dirname, '../data/characteristic_reviews.csv');
  console.time('Loading characteristics_reviews');
  return pool.query(`COPY characteristics_reviews(id, characteristic_id, review_id, value) FROM '${pathCharacteristicReviews}' WITH CSV HEADER`)
    .then(() => {
      console.timeEnd('Loading characteristics_reviews');
      // console.log('Data loaded into characteristics_reviews table.');
    })
    .then(() => {
      // Get the maximum ID value from the reviews table
      return pool.query('SELECT MAX(id) AS max_id FROM characteristics_reviews');
    })
    .then((result) => {
      const maxId = result.rows[0].max_id;
      // Reset the sequence to start from the maximum ID value
      return pool.query(`ALTER SEQUENCE characteristics_reviews_id_seq RESTART WITH ${maxId + 1}`);
    })
    .then(() => {
      console.log('Auto-increment of char reviews ID field reset.');
      // Additional processing or logging if needed
    })
    .catch((err) => {
      console.error('Error loading characteristics_reviews data:', err);
      throw err; // Propagate the error to the caller
    });
}

// Ensure reviews data is loaded before proceeding to load other tables
loadReviews()
  .then(() => loadPhotos())
  .then(() => loadCharacteristics())
  .then(() => loadCharacteristicReviews())
  .then(() => {
    console.log('All data loaded successfully.');
    // Close the pool to release resources
    pool.end(() => {
      console.log('PostgreSQL client connection closed.');
    });
  })
  .catch((err) => {
    console.error('Error:', err);
    // Close the pool to release resources
    pool.end();
  });
