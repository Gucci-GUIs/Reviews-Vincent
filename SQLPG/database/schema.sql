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

CREATE TABLE characteristic_avgratings (
    product_id INT,
    characteristic_id INT,
    characteristic_name TEXT,
    avg_characteristic_rating DECIMAL(10, 9),
    PRIMARY KEY (product_id, characteristic_id)
);

-- ~~~~~FOR INDEXING~~~~~

CREATE INDEX idx_reviews_product_id
ON reviews (product_id);

CREATE INDEX idx_review_photos_review_id
ON review_photos (review_id);

CREATE INDEX idx_characteristics_reviews_review_id
ON characteristics_reviews (review_id);

CREATE INDEX idx_product_id ON characteristic_avgratings (product_id);

-- CREATE INDEX idx_characteristics_reviews_characteristic_id
-- ON characteristics_reviews (characteristic_id);

-- CREATE INDEX idx_characteristics_product_id
-- ON characteristics (product_id);




INSERT INTO characteristic_avgratings (product_id, characteristic_id, characteristic_name, avg_characteristic_rating)
SELECT
    reviews.product_id AS product_id,
    characteristics.id AS characteristic_id,
    characteristics.name AS characteristic_name,
    AVG(characteristics_reviews.value) AS avg_characteristic_rating
FROM
    reviews
LEFT JOIN
    characteristics_reviews ON reviews.id = characteristics_reviews.review_id
LEFT JOIN
    characteristics ON characteristics_reviews.characteristic_id = characteristics.id
GROUP BY
    reviews.product_id,
    characteristics.id,
    characteristics.name;







-- ~~~~~FOR CREATING AVG TABLE FUNCTION + TRIGGER~~~~~


-- -- Funtion to add/update avg table
-- CREATE FUNCTION update_characteristic_avgratings_table()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     DELETE FROM characteristic_avgratings WHERE product_id = NEW.product_id;

--     INSERT INTO characteristic_avgratings (product_id, characteristic_id, characteristic_name, avg_characteristic_rating)
--     SELECT
--         reviews.product_id AS product_id,
--         characteristics.id AS characteristic_id,
--         characteristics.name AS characteristic_name,
--         AVG(characteristics_reviews.value) AS avg_characteristic_rating
--     FROM
--         reviews
--     LEFT JOIN
--         characteristics_reviews ON reviews.id = characteristics_reviews.review_id
--     LEFT JOIN
--         characteristics ON characteristics_reviews.characteristic_id = characteristics.id
--     WHERE
--         reviews.product_id = NEW.product_id
--     GROUP BY
--         reviews.product_id,
--         characteristics.id,
--         characteristics.name;

--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;


-- -- trigger function to trigger above function
-- CREATE TRIGGER after_review_insert
-- AFTER INSERT ON characteristics_reviews
-- FOR EACH ROW
-- EXECUTE FUNCTION update_characteristic_avgratings_table();

-- -- Trigger on reviews table
-- CREATE TRIGGER after_review_insert_reviews
-- AFTER INSERT ON reviews
-- FOR EACH ROW
-- EXECUTE FUNCTION update_characteristic_avgratings_trigger_function();

-- -- Trigger on characteristics_reviews table
-- CREATE TRIGGER after_review_insert_characteristics_reviews
-- AFTER INSERT ON characteristics_reviews
-- FOR EACH ROW
-- EXECUTE FUNCTION update_characteristic_avgratings_trigger_function();












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


