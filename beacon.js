const request = require('request');
const fs = require('fs');
const Bleacon = require('bleacon');

const uuid = 'aaaaaaaabbbbccccddddeeeeeeeeeeee';

let http_address = fs.readFileSync("/tmp/hishow/http/next-station", 'utf-8');
http_address = http_address.replace(/\r?\n/g, '');
console.log(http_address)

Bleacon.startScanning(uuid);

var conjestions = [];

var refresh_interval;

Bleacon.on('discover', function(bleacon) {
    if(Object.keys(conjestions).length == 0) {
        setTimeout(function(){
            conjestions = {};
        }, 120000);
        //}, 5000);
    }
    if(conjestions[bleacon.major]) {
        return;
    } else {
        conjestions[bleacon.major] = bleacon.minor;
    }
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

