const request = require('request');
const fs = require('fs');
const Bleacon = require('bleacon');

const uuid = 'aaaaaaaabbbbccccddddeeeeeeeeeeee';
const major = 12;
const minor = 34;
const measuredPower = -59;

let http_address = fs.readFileSync("/tmp/hishow/http/next-station", 'utf-8');
http_address = http_address.replace(/\r?\n/g, '');

Bleacon.startScanning(uuid);

Bleacon.on('discover', function(bleacon) {
    var options = {
        url: http_address,
        method: "post",
        form: {"name":"太郎"}
    }
    request(options, function (error, response, body) {
        console.log(body);
    })

});

Bleacon.startAdvertising(uuid, major, minor, measuredPower);

