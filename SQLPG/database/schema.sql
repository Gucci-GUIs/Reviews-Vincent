CREATE DATABASE reviews;

\c reviews;

DROP TABLE IF EXISTS review_photos, characteristics_reviews, characteristics, reviews CASCADE;


CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    product_id INT, -- POST
    rating INT, --GET, POST
    temp_date BIGINT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, --GET
    summary TEXT, --GET, POST
    body TEXT, --GET, POST
    recommend BOOLEAN, --GET, POST
    reported BOOLEAN,
    reviewer_name TEXT, --GET, POST
    reviewer_email TEXT, -- POST
    response TEXT, --GET
    helpfulness INT --GET
);


CREATE TABLE review_photos ( --GET -- POST
    id SERIAL PRIMARY KEY,
    review_id INT REFERENCES reviews(id),
    url TEXT
);

CREATE TABLE characteristics (
    id SERIAL PRIMARY KEY,
    product_id INT,
    name TEXT
);

CREATE TABLE characteristics_reviews ( -- POST
    id SERIAL PRIMARY KEY,
    characteristic_id INT REFERENCES characteristics(id),
    review_id INT REFERENCES reviews(id),
    value INT
);


-- CREATE INDEX idx_reviews_product_id
-- ON reviews (product_id);

-- CREATE INDEX idx_review_photos_review_id
-- ON review_photos (review_id);

-- CREATE INDEX idx_characteristics_reviews_review_id
-- ON characteristics_reviews (review_id);

-- CREATE INDEX idx_characteristics_reviews_characteristic_id
-- ON characteristics_reviews (characteristic_id);

-- CREATE INDEX idx_characteristics_product_id
-- ON characteristics (product_id);



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


