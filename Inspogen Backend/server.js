require('dotenv').config()
const helmet = require("helmet");
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors')
const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));

var app = express();

app.use(bodyParser.json());

app.post('/getImages',(req,res) =>{
    getOpenAIResponseSingle(req.body.prompt,"testAutocompleteClient").then((generatedText) => {
        getImages(generatedText,"testAutocompleteClient").then((results) =>{
            res.status(200).json(results)
        })
    }).catch((e) => {
        res.status(500)
    })
})

app.post('/getImages2',(req,res) =>{
    getOpenAIResponseSingle2(req.body.prompt,"testAutocompleteClient").then((generatedText) => {
        getImages(generatedText,"testAutocompleteClient").then((results) =>{
            res.status(200).json(results)
        })
    }).catch((e) => {
        res.status(500)
    })
})


async function getOpenAIResponseSingle(prompt, user){
    return new Promise(function (resolve, reject) {
        let fetch_url = `https://api.openai.com/v1/completions`;

        prompt = prompt.replace(/[\u0000-\u001F\u007F-\u009F]/g, "")

        var data = `{
        "model": "text-davinci-003",
        "prompt": "${prompt + " Describe the setting of the story."}",
        "user": "${user}",
        "temperature": 0.7,
        "max_tokens": 42,
        "top_p": 1,
        "frequency_penalty": 0.2,
        "presence_penalty": 0.2
        }`
    
        let fetch_options = {
        method: "POST",
        headers: {
            Authorization: "Bearer " + process.env.OPEN_AI_KEY,
            "Content-Type": "application/json",
        },
        body: data
        };
    
        fetch(fetch_url, fetch_options).then((initialResponse) => {
            if(initialResponse.status >= 400){
                resolve([{text: "...Failed to generate, please try again later."}])
            }else{
                initialResponse.json().then((openAIResponse) => {
                    isResultNotAllowed(openAIResponse.choices[0].text).then((isUnsafeText) => {
                        if(isUnsafeText){
                            resolve("... generated a sensitive prompt regarding OpenAI content policy.")
                        }else if(openAIResponse.choices[0].text.length < 2){
                            resolve("... AI believes this is the end of an idea/plot.")
                        }else{
                            resolve(openAIResponse.choices[0].text)
                        }
                    })
                })
            }
        })
    });
}

async function getOpenAIResponseSingle2(prompt, user){
    return new Promise(function (resolve, reject) {
        let fetch_url = `https://api.openai.com/v1/completions`;

        prompt = prompt.replace(/[\u0000-\u001F\u007F-\u009F]/g, "")

        var data = `{
        "model": "text-davinci-003",
        "prompt": "${prompt + " Describe what happens next visually."}",
        "user": "${user}",
        "temperature": 0.7,
        "max_tokens": 42,
        "top_p": 1,
        "frequency_penalty": 0.2,
        "presence_penalty": 0.2
        }`
    
        let fetch_options = {
        method: "POST",
        headers: {
            Authorization: "Bearer " + process.env.OPEN_AI_KEY,
            "Content-Type": "application/json",
        },
        body: data
        };
    
        fetch(fetch_url, fetch_options).then((initialResponse) => {
            if(initialResponse.status >= 400){
                resolve([{text: "...Failed to generate, please try again later."}])
            }else{
                initialResponse.json().then((openAIResponse) => {
                    isResultNotAllowed(openAIResponse.choices[0].text).then((isUnsafeText) => {
                        if(isUnsafeText){
                            resolve("... generated a sensitive prompt regarding OpenAI content policy.")
                        }else if(openAIResponse.choices[0].text.length < 2){
                            resolve("... AI believes this is the end of an idea/plot.")
                        }else{
                            resolve(openAIResponse.choices[0].text)
                        }
                    })
                })
            }
        })
    });
}

async function isResultNotAllowed(text){
    return new Promise(function (resolve, reject) {
        let fetch_url = `https://api.openai.com/v1/moderations`;

        let fetch_options = {
        body: '{\n  "input": "'+text.replace(/[^a-zA-Z 0-9.]+/g,'')+'"\n}',
        headers: {
            "Authorization": "Bearer " + process.env.OPEN_AI_KEY,
            "Content-Type": "application/json"
        },
        method: "POST"
        };
        
        fetch(fetch_url, fetch_options).then((initialResponse) => {
            if(initialResponse.status >= 400){
                resolve(true)
            }else{
                initialResponse.json().then((openAIResponse) => {
                    console.log(openAIResponse)
                    if(openAIResponse.results[0] == undefined || openAIResponse.results[0] == null){
                        resolve(true);
                    }else{
                        resolve(openAIResponse.results[0].flagged);
                    }
                })
            }
        })
    });
}

async function getImages(prompt,user){
    return new Promise(function (resolve, reject) {
        prompt = prompt.replace(/[\r\n]/gm, '')
        let fetch_url = `https://api.openai.com/v1/images/generations`;

        var data = `{
        "size": "256x256",
        "prompt": "${"Digital art of " + prompt}",
        "user": "${user}",
        "n": 1
        }`

        let fetch_options = {
        method: "POST",
        headers: {
            Authorization: "Bearer " + process.env.OPEN_AI_KEY,
            "Content-Type": "application/json",
        },
        body: data
        };
    
        fetch(fetch_url, fetch_options).then((initialResponse) => {
            if(initialResponse.status >= 400){
                resolve([{text: "...Failed to generate, please try again later.", img: "https://dictionary.cambridge.org/fr/images/thumb/cross_noun_002_09265.jpg"}])
            }else{
                initialResponse.json().then((openAIResponse) => {
                    resolve([{text: prompt, img: openAIResponse.data[0].url}])
                })
            }
        })
    });
}



app.listen(5000)