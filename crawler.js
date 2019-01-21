var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');
var stringify = require('csv-stringify');
var fs = require('fs');

var allDetails = [];
//var START_URL = "http://www.arstechnica.com";
var START_URL = "https://ces19.mapyourshow.com/7_0/alphalist.cfm?endrow=300&alpha=*";
var SEARCH_WORD = "";
//var MAX_PAGES_TO_VISIT = 1000;

var pagesVisited = {};
var numPagesVisited = 0;
var numItems = 0;
var pagesToVisit = [START_URL];
//var links=[];
var url = new URL(START_URL);
var baseUrl = url.protocol + "//" + url.hostname;
var isLastPage = false;
//pagesToVisit.push(START_URL);
var data={};

var customHeaderRequest = request.defaults({
    headers: {'User-Agent': `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36`}
})


visitFrPage(START_URL);

 for(var i=0;i<pagesToVisit.length;i++){
     var currLink = pagesToVisit[i];
 }


function requestPage(url) {
    return new Promise(function(resolve, reject) {
        // Do async job
       customHeaderRequest.get(url, function(err, resp, body) {
            if (err) {
                reject(err);
            } else {
                resolve(body);
            }
        })
    })
}

function visitFrPage(url) {
    // Add page to our set
    pagesVisited[url] = true;
    // Make the request
    console.log("Visiting page " + url);
    var requestPag = requestPage(url);
    //promisez.push(requestPag);
    requestPag.then(function(body) {
        var $ = cheerio.load(body);
        var exhibitors = $("tbody tr td.mys-table-exhname");
        var booths = $(".mys-table-booths");
        var lnks = $(".mys-table-exhname a");

        //console.log(exhibitors);
         for(var i=0;i<exhibitors.length;i++){
             var exb=$(exhibitors[i]).text();
             var bth=$(booths[i]).text();
             var lnk=$(lnks[i]).attr('href');
             data[lnk]={
                exhibitor_name:exb,
                booths:bth
             }
             console.log(lnk);
         }

    }, function(err) {
        console.log(err);

    })
}

function visitPage(url) {
    // Add page to our set
    pagesVisited[url] = true;
    // Make the request
    console.log("Visiting page " + url);
    var requestPag = requestPage(url);
    requestPag.then(function(body) {
        var $ = cheerio.load(body);
        scrape($, url);
    }, function(err) {
        console.log(err);
    })
}


function scrape($, url) {

    var desc = $('.mys-toggle.mys-box-light.jq-toggle');
    var model;
    var brand;
    if (desc) {
        var arr = desc.split(' ');
        brand = arr[0];
        arr = desc.split(' - ');
        model = arr[arr.length - 1];
    }
    var price = $('strong.pdp-overview__price').text();
    console.log(desc);
    console.log(model + "    <>>>>>>>>>>>>>>>>>>>>>>>  " + brand);

    if (model && brand && price) {
        var item = {
            brand: brand,
            model: model,
            price: price,
            description: desc,
            category: category,
            source: 'Carrefour Egypt',
            sourceType: 'online',
            url: url
        };
        allDetails.push(item);
    }

}

function saveCsv(name) {
    stringify(allDetails, function(err, output) {
        fs.writeFile(name, output, 'utf8', function(err) {
            if (err) {
                console.log('Some error occured - file either not saved or corrupted file saved.');
            } else {
                console.log('It\'s saved!');
            }
        });
    });
}