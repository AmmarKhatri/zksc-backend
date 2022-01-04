const puppeteer = require('puppeteer');
const S = require('string');

const stockRates = async () => {
  const browser = await puppeteer.launch({
    //executablePath: '/usr/bin/chromium-browser',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  })
  const page = await browser.newPage()
  await page.goto('https://dps.psx.com.pk/screener', {waitUntil: "domcontentloaded"});
  await page.select('select[name="screenerTable_length"]', '-1');

  const scrapedData = await page.evaluate(() =>
    
    Array.from(document.querySelectorAll("tbody > tr")).map(scrip => [
    scrip.querySelector("td:nth-child(1)").getAttribute("data-order"),
    parseFloat(scrip.querySelector("td:nth-child(3)").getAttribute("data-order"))
    ])
  );
  
  const cng1 = JSON.stringify(scrapedData);
  const cng2 = S(cng1).replaceAll("[[", "{").s;
  const cng3 = S(cng2).replaceAll("]]", "}").s;
  const cng4 = S(cng3).replaceAll(",", ":").s;
  const json = S(cng4).replaceAll("]:[", ",").s;


  await browser.close()
  return JSON.parse(json);
}

module.exports.stockRates = stockRates;
