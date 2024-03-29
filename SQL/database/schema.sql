CREATE DATABASE reviews;

USE reviews;

CREATE TABLE reviews (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
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
    review_id INT,
    photo_id INT AUTO_INCREMENT PRIMARY KEY,
    photo_url TEXT,
    FOREIGN KEY (review_id) REFERENCES reviews(review_id)
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
    product_id INT,
    characteristic_id INT PRIMARY KEY,
    characteristic_name VARCHAR(255),
    characteristic_value FLOAT,
    FOREIGN KEY (product_id) REFERENCES reviews_meta(product_id)
);




/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *  to create the database and the tables.*/