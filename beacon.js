require('date-utils');
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
        //}, 120000);
        }, 5000);
    }
    if(congestions[bleacon.major]) {
        return;
    } else {
        congestions[bleacon.major] = bleacon.minor;
    }

    var train_id = Number(String(bleacon.major).slice(0,3));
    var car_id = Number(String(bleacon.major).slice(-2));
    var door_id = Number(String(bleacon.major).slice(-1));

    var dt = new Date();
    var formatted_date = dt.toFormat("YYYY/MM/DD/HH24/MI/SS");
    request.post({
        url: "http://" + http_address,
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({
            station: "神田",
            train_id: train_id,
            car_id: car_id,
            door_id: door_id,
            congestion: bleacon.minor,
            time: formatted_date
        })
    }, function (error, response, body){
        console.log(body);
    });

});

