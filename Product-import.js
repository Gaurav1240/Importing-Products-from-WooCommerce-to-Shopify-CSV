import fetch from 'node-fetch';
import csvWriter from 'csv-write-stream';
import fs from 'fs';



const writer = csvWriter({
  headers: [
    'Handle',
    'Title',
    'Body (HTML)',
    'Vendor',
    'Product Category',
    'Type',
    'Tags',
    'Published',
    'Option1 Name',
    'Option1 Value',
    'Option2 Name',
    'Option2 Value',
    'Option3 Name',
    'Option3 Value',
    'Variant SKU',
    'Variant Grams',
    'Variant Inventory Tracker',
    'Variant Inventory Qty',
    'Variant Inventory Policy',
    'Variant Fulfillment Service',
    'Variant Price',
    'Variant Compare At Price',
    'Variant Requires Shipping',
    'Variant Taxable',
    'Variant Barcode',
    'Image Src',
    'Image Position',
    'Image Alt Text',
    'Gift Card',
    'SEO Title',
    'SEO Description',
    'Google Shopping / Google Product Category',
    'Google Shopping / Gender',
    'Google Shopping / Age Group',
    'Google Shopping / MPN',
    'Google Shopping / AdWords Grouping',
    'Google Shopping / AdWords Labels',
    'Google Shopping / Condition',
    'Google Shopping / Custom Product',
    'Google Shopping / Custom Label 0',
    'Google Shopping / Custom Label 1',
    'Google Shopping / Custom Label 2',
    'Google Shopping / Custom Label 3',
    'Google Shopping / Custom Label 4',
    'Variant Image',
    'Variant Weight Unit',
    'Variant Tax Code',
    'Cost per item',
    'Price / International',
    'Compare At Price / International',
    'Status',
    'collection',
  ]
});
writer.pipe(fs.createWriteStream('products_shopify.csv'));

/*

fetch('https://example.com/wp-json/wc/v3/products?per_page=200', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + Buffer.from('ck_API Key' + ':' + 'cs_API Secrete').toString('base64')
  }
})
  .then(response => response.json())
  .then(products => {
    console.log(`Received ${products.length} products from WooCommerce.`);
*/

writer.pipe(fs.createWriteStream('products2.csv'));

const apiEndpoint = 'https://fimonaa.com/wp-json/wc/v3/products/tags<id>';
const perPage = 100;
let currentPage = 1;

const fetchProducts = async () => {
  let products = [];

  while (true) {
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

fetchProducts()
  .then(products => {
    console.log(`Received ${products.length} products from WooCommerce.`);

    products.forEach(product => { 
      const title = product.name;
      const description = product.description;
      const productType = product.type;
      const imageUrl = product.images[0].src;
      const tags = product.tags.join();
      const price =  product.price;
      const sku = product.sku;
      const qty = product.stock_quantity;
      const collection = product.categories[0].name;

      writer.write({
        'Handle':  title.toLowerCase().replace(/\s+/g, '-'),
        'Title': title,
        'Body (HTML)': description,
        'Vendor': 'Fimonaa',
        'Product Category': 'Apparel & Accessories',
        'Type': productType,
        'Tags': tags,
        'Published': '',
        'Option1 Name': '',
        'Option1 Value': '',
        'Option2 Name': '',
        'Option2 Value': '',
        'Option3 Name': '',
        'Option3 Value': '',
        'Variant SKU': sku,
        'Variant Grams': '',
        'Variant Inventory Tracker': 'shopify',
        'Variant Inventory Qty': qty,
        'Variant Inventory Policy': 'deny',
        'Variant Fulfillment Service': 'manual',
        'Variant Price': price,
        'Variant Compare At Price': '',
        'Variant Requires Shipping': 'TRUE',
        'Variant Taxable': 'TRUE',
        'Variant Barcode': '',
        'Image Src': imageUrl,
        'Image Position': '1',
       'Image Alt Text':'',
        'Gift Card':'',
       'SEO Title':'',
       'SEO Description':'',
       'Google Shopping / Google Product Category':'',
       'Google Shopping / Gender':'',
       'Google Shopping / Age Group':'',
       'Google Shopping / MPN':'',
       'Google Shopping / AdWords Grouping':'',
       'Google Shopping / AdWords Labels':'',
       'Google Shopping / Condition':'',
       'Google Shopping / Custom Product':'',
       'Google Shopping / Custom Label 0':'',
       'Google Shopping / Custom Label 1':'',
       'Google Shopping / Custom Label 2':'',
       'Google Shopping / Custom Label 3':'',
       'Google Shopping / Custom Label 4':'',
       'Variant Image':'',
       'Variant Weight Unit':'',
       'Variant Tax Code':'',
       'Cost per item':'',
       'Price / International':'',
       'Compare At Price / International':'',
       'Status': 'Active',
       'collection': collection ,
      }); 
   });
  
})
.catch(error => {
console.error('Failed to get products from WooCommerce. Error:', error);
});


