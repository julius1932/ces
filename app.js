const jsonfile = require('jsonfile');
var data = jsonfile.readFileSync('./data.json');
var newData = {};

var links = Object.keys(data);
for (var j = links.length - 1; j >= 0; j--) {
    var link = links[j];
    var keys = Object.keys(data[link]);
  console.log(link);
    newData[link] = {};
    for (var i =0;i< keys.length ;  i++) {
        var key = keys[i];
        if (key.includes("exhibitor_name")) {
            newData[link]['Exhibitor Name'] = data[link][key];
        } else if (key.includes("booths")) {
            newData[link]['Booths'] = data[link][key];

        } else if (key.includes('Business Address')) {

            newData[link]['Business Address'] = data[link][key];
        } else if (key.includes('Contact Information')) {

            newData[link]['Contact Information'] = data[link][key];
        } else if (key.includes('Brands')) {

            newData[link]['Brands'] = data[link][key];
        } else if (key.includes("Product Categories")) {
            newData[link]['Product Categories'] = data[link][key];

        } else if (key.includes("Company Contacts")) {

            newData[link]['Company Contacts'] = data[link][key];
        } else if (key.includes("Screen shot")) {

            newData[link]['Screen shot'] = data[link][key];
        } else if (key.includes('Exhibition Domain')) {
            newData[link]['Exhibition Domain'] = data[link][key];

        } else if (key.includes('Nature of Business')) {
            newData[link]['Nature of Business'] = data[link][key];

        } else if (key.includes("Product Categories")) {
            newData[link]['Product Categories'] = data[link][key];
        }

    }
}
jsonfile.writeFile('./data12.json', newData, { spaces: 2 }, function(err) {
        console.error(err + ' ==');

    });