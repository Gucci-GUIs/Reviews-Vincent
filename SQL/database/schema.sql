CREATE DATABASE reviews;

USE reviews;

CREATE TABLE reviews (
    review_id INT PRIMARY KEY,
    product_id VARCHAR(255),
    rating INT,
    summary TEXT,
    recommend BOOLEAN,
    response TEXT,
    body TEXT,
    date DATE,
    reviewer_name VARCHAR(255),
    helpfulness INT
);


CREATE TABLE reviews_meta (
    product_id VARCHAR(255) PRIMARY KEY,
    rating_1 INT,
    rating_2 INT,
    rating_3 INT,
    rating_4 INT,
    rating_5 INT,
    recommended_false INT,
    recommended_true INT,
    quality_value DECIMAL(10, 4),
    quality_id INT
);