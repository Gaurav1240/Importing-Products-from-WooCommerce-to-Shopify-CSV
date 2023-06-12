Importing Products from WooCommerce to Shopify CSV

This technical document provides an overview and explanation of the code for importing products from WooCommerce to Shopify CSV using Node.js. The code snippet includes importing necessary libraries, setting up CSV writer and file system, fetching products from the WooCommerce API, and writing the product data to a Shopify CSV file.


Prerequisites
Before using the code, ensure that you have the following:

Node.js installed on your system.
WooCommerce API credentials (API Key and Secret).
Access to the WooCommerce API endpoint.
Basic knowledge of JavaScript and Node.js.
Code Explanation
javascript
Copy code
import fetch from 'node-fetch';
import csvWriter from 'csv-write-stream';
import fs from 'fs';
The code starts by importing the necessary libraries: node-fetch for making API requests, csv-write-stream for writing data to a CSV file, and fs for file system operations.

javascript
Copy code
const writer = csvWriter({
  headers: [
    // CSV header column names
  ]
});
writer.pipe(fs.createWriteStream('products_shopify.csv'));
A CSV writer is created with the specified header column names. The headers array should contain all the column names for the Shopify CSV file. The writer is then piped to a write stream, which creates a file named products_shopify.csv for writing the CSV data.

javascript
Copy code
const apiEndpoint = 'https://example.com/wp-json/wc/v3/products/tags<id>';
const perPage = 100;
let currentPage = 1;
The apiEndpoint variable should be replaced with the actual WooCommerce API endpoint from which you want to fetch the products. The perPage variable determines the number of products to fetch per page, and currentPage keeps track of the current page number being fetched.

javascript
Copy code
const fetchProducts = async () => {
  let products = [];

  while (true) {
    // Fetch products from WooCommerce API
    const response = await fetch(`${apiEndpoint}?per_page=${perPage}&page=${currentPage}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from('ck_Fill API Key' + ':' + 'cs_Fill API Secrete').toString('base64')
      }
    });

    const pageProducts = await response.json();
    products = products.concat(pageProducts);

    if (pageProducts.length < perPage) {
      break;
    }

    currentPage++;
  }

  return products;
};
The fetchProducts function is an asynchronous function that fetches products from the WooCommerce API. It uses a while loop to fetch products from each page until all products are fetched. The fetched products are stored in the products array. The function returns the array of products.

javascript
Copy code
fetchProducts()
  .then(products => {
    console.log(`Received ${products.length} products from WooCommerce.`);

    products.forEach(product => {
      // Extract product data
      // Write product data to Shopify CSV
    });
  })
  .catch(error => {
    console.error('Failed to get products from WooCommerce. Error:', error);
  });
The fetchProducts function is called, and once the products are fetched successfully, the .then block executes. It logs the number of received products and iterates over each product using forEach. Inside the iteration, you can extract the required data from each product and write it to the Shopify CSV file.

The extracted product data should be mapped to the corresponding columns in the Shopify CSV file, as shown in the code. Replace the empty strings with the actual values to be written for each product.







