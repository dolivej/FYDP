const https = require('https');
const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));
require('dotenv').config({path : '../.env'});
let plotly = require("plotly")(process.env.PLOTLY_USERNAME, process.env.PLOTLY_KEY);

function getEpochTime(){
    return Date.now();
}

// console.log(getEpochTime());

const url = "http://localhost:5000/getImages";
let prompt_list = ["The knight walked into the deep dark crypt", "The astronaut took off his helmet"];


async function testImageTime(prompt){
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    let raw = JSON.stringify({
        "idToken": "test",
        "todaysDate": new Date(),
        "prompt": prompt
    });
    
    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    
    let response = await fetch(url, requestOptions).then((res) => {
        // console.log(res);
        res.json().then((resData) => {
            // console.log(resData);
        })
    }).catch((e) => {
        console.log(e);
    });
}

async function testSuite(){
    let times = [];
    let j = 0;
    for(i = 0; i < prompt_list.length; i++){
        before = getEpochTime();
        await testImageTime(prompt_list[j]);
        after = getEpochTime();
        times.push(after - before);

        if(i%4 == 3){
            j = j + 1;
        }
    }
    times = times.map(x => Math.log(x));

    // console.log(times);

    let x_axis = Array.from({length: prompt_list.length}, (_, key) => key + 1);

    let trace1 = {
        x: x_axis,
        y: times,
        type: "scatter"
    };

    let graphOptions = {
        filename: "basic-line",
         fileopt: "overwrite"
    };

    plotly.plot(trace1, graphOptions, function (err, msg) {
        console.log(msg);
    });

}

testSuite();