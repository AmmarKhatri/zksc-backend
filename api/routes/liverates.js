const express = require('express');
const scraper = require('../utils/scraper');
const router = express.Router();
const cron = require("node-schedule");
const fs = require("fs");

router.get('/', (req, res) => {
  var data = fs.readFileSync('./api/data/rates.json');
  var response = JSON.parse(data);
  res.status(200).send(response);
});

const job = cron.scheduleJob('*/15 5-14 * * 1-5', function(){
  const stockRates = new Promise((resolve, reject) => {
    scraper
      .stockRates()
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        console.log(err);
    });
  });
  Promise.resolve(stockRates)
  .then(data => {
    const file = JSON.stringify(data);
    fs.writeFile('./api/data/rates.json', file, function(err) { console.log(err)});
    console.log(file)
  })
  .catch(err => console.log(err));
});
//'0 16 * * 1-5'
const job2 = cron.scheduleJob('* * * * *', function(){
  const stockRates = new Promise((resolve, reject) => {
    scraper
      .stockRates()
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        console.log(err);
    });
  });
  Promise.resolve(stockRates)
  .then(data => {
    const file = JSON.stringify(data);
    fs.writeFile('./api/data/rates.json', file, function(err) { console.log(err)});
    console.log(file)
  })
  .catch(err => console.log(err));
});
  

module.exports = router;





