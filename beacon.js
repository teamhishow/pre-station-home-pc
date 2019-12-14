const request = require('request');
const fs = require('fs');
const Bleacon = require('bleacon');

const uuid = 'aaaaaaaabbbbccccddddeeeeeeeeeeee';

let http_address = fs.readFileSync("/tmp/hishow/http/next-station", 'utf-8');
http_address = http_address.replace(/\r?\n/g, '');
console.log(http_address)

Bleacon.startScanning(uuid);

var congestions = [];

var refresh_interval;

Bleacon.on('discover', function(bleacon) {
    if(Object.keys(congestions).length == 0) {
        setTimeout(function(){
            congestions = {};
        }, 120000);
        //}, 5000);
    }
    if(congestions[bleacon.major]) {
        return;
    } else {
        congestions[bleacon.major] = bleacon.minor;
    }
    request.post({
        url: "http://" + http_address,
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({door_id: bleacon.major, congestion: bleacon.minor})
    }, function (error, response, body){
        console.log(body);
    });

});

