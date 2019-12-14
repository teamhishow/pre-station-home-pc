const request = require('request');
const fs = require('fs');
const Bleacon = require('bleacon');

const uuid = 'aaaaaaaabbbbccccddddeeeeeeeeeeee';
const major = 12;
const minor = 34;
const measuredPower = -59;

let http_address = fs.readFileSync("/tmp/hishow/http/next-station", 'utf-8');
http_address = http_address.replace(/\r?\n/g, '');
console.log(http_address)

Bleacon.startScanning(uuid);

Bleacon.on('discover', function(bleacon) {
    console.log(bleacon)
    request.post({
        url: "http://" + http_address,
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({door_id: bleacon.major, conjestion: bleacon.minor})
    }, function (error, response, body){
        console.log(body);
    });

});

Bleacon.startAdvertising(uuid, major, minor, measuredPower);

