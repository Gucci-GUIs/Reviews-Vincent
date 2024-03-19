CREATE DATABASE reviews;

CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    product_id INT,
    rating INT,
    summary TEXT,
    recommend BOOLEAN,
    response TEXT,
    body TEXT,
    date DATE,
    reviewer_name VARCHAR(255),
    helpfulness INT
);

CREATE TABLE review_photos (
    photo_id SERIAL PRIMARY KEY,
    review_id INT REFERENCES reviews(review_id),
    photo_url TEXT
);

CREATE TABLE reviews_meta (
    product_id INT PRIMARY KEY,
    rating_1 INT,
    rating_2 INT,
    rating_3 INT,
    rating_4 INT,
    rating_5 INT,
    recommended_false INT,
    recommended_true INT
);

CREATE TABLE characteristics (
    characteristic_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES reviews_meta(product_id),
    characteristic_name VARCHAR(255),
    characteristic_value FLOAT
);
