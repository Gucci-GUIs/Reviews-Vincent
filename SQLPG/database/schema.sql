CREATE DATABASE reviews;

\c reviews;

DROP TABLE IF EXISTS review_photos, characteristics_reviews, characteristics, reviews CASCADE;


CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    product_id INT,
    rating INT,
    temp_date BIGINT,
    date DATE,
    summary TEXT,
    body TEXT,
    recommend BOOLEAN,
    reported BOOLEAN,
    reviewer_name TEXT,
    reviewer_email TEXT,
    response TEXT,
    helpfulness INT
);


CREATE TABLE review_photos (
    id SERIAL PRIMARY KEY,
    review_id INT REFERENCES reviews(id),
    url TEXT
);

CREATE TABLE characteristics (
    id SERIAL PRIMARY KEY,
    product_id INT,
    name TEXT
);

CREATE TABLE characteristics_reviews (
    id SERIAL PRIMARY KEY,
    characteristic_id INT REFERENCES characteristics(id),
    review_id INT REFERENCES reviews(id),
    value INT
);




    -- product_id INT REFERENCES reviews_meta(product_id),
    -- characteristic_name VARCHAR(255),
    -- characteristic_value FLOAT



-- CREATE TABLE reviews_meta (
--     product_id INT PRIMARY KEY,
--     rating_1 INT,
--     rating_2 INT,
--     rating_3 INT,
--     rating_4 INT,
--     rating_5 INT,
--     recommended_false INT,
--     recommended_true INT
-- );


