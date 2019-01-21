const puppeteer = require('puppeteer');

const jsonfile = require('jsonfile');

const fs = require('fs');
var stringify = require('csv-stringify');
//var arr = require('./arr');
let startUrl = 'https://ces19.mapyourshow.com/7_0/alphalist.cfm?endrow=300&alpha=*';
var pagesToVist = [startUrl];
var vistedPages = []; //jsonfile.readFileSync('./afr.json');
var allDetails = [];

var data =  jsonfile.readFileSync('./data.json');
//console.log(arr.length);
async function scrapeF() {

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 900 });
    await page.goto(startUrl, { waitUntil: 'networkidle2', timeout: 0 });

    let lnks = await page.evaluate(() => {
        let links = [];
        let tableHeader = document.querySelectorAll('.mys-table-exhname a');
        tableHeader.forEach((tableh) => {
            links.push(tableh.getAttribute('href'));
        });
        return links;
    });
    let booths = await page.evaluate(() => {
        let links = [];
        let tableHeader = document.querySelectorAll('.mys-table-booths');
        tableHeader.forEach((tableh) => {
            links.push(tableh.innerText);
        });
        return links;
    });

    let exhibitors = await page.evaluate(() => {
        let links = [];
        let tableHeader = document.querySelectorAll('.mys-table-exhname');
        tableHeader.forEach((tableh) => {
            links.push(tableh.innerText);
        });
        return links;
    });
    console.log(exhibitors.length);
    browser.close();
    for (var i = 0; i < exhibitors.length; i++) {
        var exb = exhibitors[i];
        var bth = booths[i].trim();
        var lnk = `https://ces19.mapyourshow.com${lnks[i].trim()}`;
        data[lnk] = {
            exhibitor_name: exb,
            booths: bth
        }

    }
    var keys = Object.keys(data);
    for (var i = 0; i < keys.length; i++) {
        var lnk = keys[i];
        if(data[currlink]['Screen shot']){
            continue;
        }
        await scrape(lnk, i);
        if (i==keys.length-1 ||i%10==0) {
            jsonfile.writeFile('./data.json', data, { spaces: 2 }, function(err) {
                console.error(err + ' ==');

            });
        }
    }
    jsonfile.writeFile('./data.json', data, { spaces: 2 }, function(err) {
        console.error(err + ' ==');

    });
}
async function scrape(currlink, ik) {
    console.log(currlink);
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 900 });
    await page.goto(currlink, { waitUntil: 'networkidle2', timeout: 0 });
    await page.screenshot({ path: `./screenshots/shot${ik}.jpeg`, type: 'jpeg', fullPage: true });

    let values = await page.evaluate(() => {
        let links = {};
        var buss = document.querySelector('div.mys-taper-measure');
        if (address) {
            links["Nature of Business"] = buss.innerText;
        }
        var address = document.querySelector('.sc-Exhibitor_Address');
        if (address) {
            links["Business Address"] = address.innerText;
        }
        var phone = document.querySelector('.sc-Exhibitor_PhoneFax');
        if (address) {
            links["Contact Information"] = phone.innerText;
        }
        var exhibitionDomain = document.querySelector('.sc-Exhibitor_Url a');
        if (exhibitionDomain) {
            links['Exhibition Domain'] = exhibitionDomain.getAttribute('href');
        }
        let tableHeader = document.querySelectorAll('#mys-exhibitor-details-wrapper strong');

        tableHeader.forEach((tableh, i) => {

            let dat = document.querySelectorAll(`.mys-toggleShow.jq-toggleShow`)[i];
            const result = dat.innerText.split('\n').filter(word => word.trim('\t'));
            for (var i = 0; i < result.length; i++) {
                result[i] = result[i].trim('\t');
            }

            links[tableh.innerText] = result;
        });
        return links;
    });
    var keys = Object.keys(values);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        data[currlink][key] = values[key];

    }
     data[currlink]['Screen shot']=`shot${ik}.jpeg`
    console.log(data[currlink]);
    browser.close();

}

function dt(i) {
    let links = [];
    let tableHeader = document.querySelectorAll(`.mys-toggleShow.jq-toggleShowmys:nth-child(${i})`);
    tableHeader.forEach((tableh) => {
        links.push(tableh.innerText);
    });
    return links;
}

function saveCsv(name) {
    stringify(allDetails, function(err, output) {
        fs.appendFile(name, output, 'utf8', function(err) {
            if (err) {
                console.log('Some error occured - file either not saved or corrupted file saved.');
            } else {
                console.log('It\'s saved!');
            }
        });
    });

    jsonfile.writeFile('./afr.json', vistedPages, { spaces: 2 }, function(err) {
        console.error(err + ' ==');
    });
    allDetails = [];
}

scrapeF();