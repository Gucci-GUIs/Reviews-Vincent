const csv = require('csv-parser');
const createCsvStringifier = require('csv-writer').createObjectCsvStringifier;
const fs = require('fs');
const { Transform } = require('stream');

// define the CSV stringifier for headers
const csvStringifier = createCsvStringifier({
  header: [
    { id: 'id', title: 'id' },
    { id: 'product_id', title: 'product_id' },
    { id: 'rating', title: 'rating' },
    { id: 'date', title: 'date' },
    { id: 'summary', title: 'summary' },
    { id: 'body', title: 'body' },
    { id: 'recommend', title: 'recommend' },
    { id: 'reported', title: 'reported' },
    { id: 'reviewer_name', title: 'reviewer_name' },
    { id: 'reviewer_email', title: 'reviewer_email' },
    { id: 'response', title: 'response' },
    { id: 'helpfulness', title: 'helpfulness' },
  ],
});

// define paths for the read and write streams
const readStream = fs.createReadStream('../data/reviews.csv');
const writeStream = fs.createWriteStream('../data/clean-reviews.csv');

// define the CSV cleaner class
class CSVCleaner extends Transform {
  constructor(options) {
    super(options);
    this.lineCount = 0;
  }

  _transform(data, encoding, next) {
    // console.log("Received data:", data);
    console.log("Line count:", this.lineCount);
    // Clean and transform the data here

    this.lineCount++;

      // if (this.lineCount <= 10) {
    // REVIEW ID/PRODUCT ID: Check for key fields and if they contain valid values
      // if (isNaN(data[0]) || !data[0] || isNaN(data[1]) || !data[1]) {
      // // Skip
      //   next();
      //   return
      // }

      // Convert field formats


// REVIEW ID: convert to number
if (!isNaN(data.id)) {
  data.id = Number(data.id);
}

// PRODUCT ID: convert to number
if (!isNaN(data.product_id)) {
  data.product_id = Number(data.product_id);
}

// RATING: convert to number
if (data.rating !== null && !isNaN(data.rating)) {
  data.rating = Number(data.rating);
} else {
  data.rating = null;
}

// DATE: date format
if (data.date !== null) {
  data.date = new Date(parseInt(data.date));
} else {
  data.date = null;
}

// SUMMARY: slice to 50
if (data.summary !== null) {
  data.summary = data.summary.slice(0, 50);
} else {
  data.summary = '';
}

// BODY: slice to 1000
if (data.body !== null) {
  data.body = data.body.slice(0, 1000);
} else {
  data.body = '';
}

// RECOMMEND: convert to boolean
if (data.recommend !== null && data.recommend !== undefined) {
  data.recommend = data.recommend.toLowerCase() === 'true';
} else {
  data.recommend = null;
}

// REPORTED: convert to boolean
if (data.reported !== null && data.reported !== undefined) {
  data.reported = data.reported.toLowerCase() === 'true';
} else {
  data.reported = null;
}

// REVIEWER_NAME: convert to string
if (data.reviewer_name !== null) {
  data.reviewer_name = String(data.reviewer_name);
} else {
  data.reviewer_name = '';
}

// REVIEWER_EMAIL: convert to string
if (data.reviewer_email !== null) {
  data.reviewer_email = String(data.reviewer_email);
} else {
  data.reviewer_email = '';
}

// RESPONSE: slice to 300
if (data.response !== null && data.response !== undefined) {
  data.response = data.response.slice(0, 300);
} else {
  data.response = null;
}

// HELPFULNESS: convert to number
if (data.helpfulness !== null && !isNaN(data.helpfulness)) {
  data.helpfulness = Number(data.helpfulness);
} else {
  data.helpfulness = 0;
}



      // Stringify the cleaned data to CSV format
      // console.log("prestring data:", data);
      data = csvStringifier.stringifyRecords([data]);
      // Push the cleaned data to the output stream
      // console.log("push data:", data);
      this.push(data);
      next();
    // }



      // If line count exceeds 10, end the stream
      // if (this.lineCount > 10) {
      //   this.push(null); // End the stream
      //   return;
      // }



    // Call the callback function to proceed to the next data

  }
}

// create an instance of the CSV cleaner with writable object mode set to true
const transformer = new CSVCleaner({ writableObjectMode: true });

// write the header to the output CSV file
writeStream.write(csvStringifier.getHeaderString());

// pipe the read stream through the CSV parser, transformer, and write stream
readStream
  .pipe(csv())
  .pipe(transformer)
  .pipe(writeStream)
  .on('finish', () => {
    console.log('Data cleaning finished.');
  });
