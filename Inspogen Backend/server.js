require('dotenv').config()
const helmet = require("helmet");
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const NodeCache = require("node-cache"); 
const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));

var app = express();

const cache = new NodeCache({stdTTL: 120, checkperiod: 300, maxKeys: 3});
// cache.data = {cache.key1: {}, cache.key2: {}, ... }

app.use(bodyParser.json());

app.post('/getImages',(req,res) =>{
/*
    RETURNS Reponse in form of
    {
        "text": "string",
        "img": "url"
    }
*/
    // Parse metadata = {}
    // let metadata = req.body.metadata;

    if(cache.has("image") && (cache.get("metadata").promptType == req.body.metadata.promptType) ){ // image: [ {object}, {object}, ...]
        if(req.body.metadata.promptType == "continue" 
            && (cache.get("metadata").continueFocus == req.body.metadata.continueFocus) 
            && (cache.get("metadata").continueTone == req.body.metadata.continueTone)){
                sendResponseFromCache(res);
        }
        else if (req.body.metadata.promptType == "link" 
            && (cache.get("metadata").linkText == req.body.metadata.linkText) ){
                sendResponseFromCache(res);
        }
        else if (req.body.metadata.promptType == "describe" 
            && (cache.get("metadata").describeTopic== req.body.metadata.describeTopic) 
            && (cache.get("metadata").describeStyle == req.body.metadata.describeStyle)){
                sendResponseFromCache(res);
        }
        else if (req.body.metadata.promptType == "list" 
            && (cache.get("metadata").listTopic== req.body.metadata.listTopic) 
            && (cache.get("metadata").listContext == req.body.metadata.listContext)){
                sendResponseFromCache(res);
        }
        else{
            generateAndCacheImages(req.body.prompt, "testAutocompleteClient", req.body.metadata, res);
        }

    }
    else{
        generateAndCacheImages(req.body.prompt, "testAutocompleteClient", req.body.metadata, res);
    }

})

async function generateAndCacheImages(prompt, user, metadata, res){
    getImages(prompt, user).then((results) =>{
        // console.log(req.body.prompt);
        // construct first response object
        let first_result_object = {
            "text": results.text,
            "img": results.img[0].url
        };

        // // create datapoint for cache
        temp_list = [];
        for(i = 1; i < results.img.length; i++){
            // i = 1 ignore the first one
            let temp_cache_object = {
                "text": results.text,
                "img": results.img[i].url
            };
            temp_list.push(temp_cache_object);
        }

        cache.set("image", temp_list);

        // then store cache metadata to determine image generation
        cache.set("metadata", metadata);

        res.status(200).json(first_result_object);

    }).catch((e) => {
        res.status(500)
    })
}

async function sendResponseFromCache(res){
    if(cache.get("image").length > 1){
        let rest_of_cache = cache.get("image"); // store as separate to not mutate original cache for now
        first_element_of_cache = rest_of_cache.shift(1); // temp now becomes the rest of the cache with the first element removed

        // overwrite cached value with new subcached element
        cache.set("image", rest_of_cache);
        res.status(200).json(first_element_of_cache);
    }
    else if(cache.get("image").length == 1){
        res.status(200).json(cache.take("image")[0]); // take gets the cache and then deletes it. this one returns it in an array so need to grab first element 
    }
    else{
        res.status(500); // something is wrong with the cache
    }
}

app.post('/checkPlagarism',(req,res) =>{
    checkPlagarism(req.body.text).then((result)=>{
        res.status(200).json(result)
    })
})

// *** New stuff for text generation *** //

app.post('/continuePrompt',(req,res) =>{
    console.log("in continuePrompt")
    // Parameters `req.body` are: `prompt`, `continueFocus`, `continueTone`
    getOpenAIResponseContinue(req.body.prompt,req.body.continueFocus,req.body.continueTone,"testAutocompleteClient").then((generatedText) => {
        let metadata_object = {
            "promptType": "continue",
            "continueFocus": req.body.continueFocus,
            "continueTone": req.body.continueTone
        };
        
        res.status(200).json({text: generatedText, metadata: metadata_object})
    }).catch((e) => {
        res.status(500)
    })
})

async function getOpenAIResponseContinue(prompt, continueFocus, continueTone, user) {  
    return new Promise(function (resolve, reject) {
        let fetch_url = `https://api.openai.com/v1/completions`;
        prompt = prompt.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
        continueFocus = continueFocus.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
        continueTone = continueTone.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
        
        let promptWithCommand;
      
        if(continueFocus == "any" && continueTone == "any"){
          promptWithCommand = `'${prompt}' Based on the quoted text continue the text.`;
        }else if(continueFocus == "any"){
          promptWithCommand = `'${prompt}' Based on the quoted text continue the text with a ${continueTone} undertone.`;
        }else if (continueTone == "any"){
          promptWithCommand = `'${prompt}' Based on the quoted text continue the text with lots of ${continueFocus}.`;
        }else{
          promptWithCommand = `'${prompt}' Based on the quoted text continue the text with lots of ${continueFocus} and with a ${continueTone} undertone.`;        
        }

        var data = `{
        "model": "text-davinci-003",
        "prompt": "${promptWithCommand}",
        "user": "${user}",
        "temperature": 0.9,
        "max_tokens": 150,
        "top_p": 1,
        "frequency_penalty": 0.2,
        "presence_penalty": 0.2
        }`;

        let fetch_options = {
        method: "POST",
        headers: {
            Authorization: "Bearer " + process.env.OPEN_AI_KEY,
            "Content-Type": "application/json",
        },
        body: data,
        };

        fetch(fetch_url, fetch_options).then((initialResponse) => {
            if (initialResponse.status >= 400) {
                initialResponse.json().then((openAIResponse) => {
                  console.log(openAIResponse)
                  resolve("...Failed to generate, please try again later.");
                });
            } else {
                initialResponse.json().then((openAIResponse) => {
                isResultNotAllowed(openAIResponse.choices[0].text).then(
                    (isUnsafeText) => {
                    if (isUnsafeText) {
                        resolve(
                        "... generated a sensitive prompt regarding OpenAI content policy (i.e violence/self-harm)."
                        );
                    } else if (openAIResponse.choices[0].text.length < 2) {
                        resolve(
                        "... InspoGen believes this is the end of an idea/plot."
                        );
                    } else {
                        resolve("..." + openAIResponse.choices[0].text.trim() + "...");
                    }
                    }
                );
                });
            }
        })
    });
}


// LINK TEXT

app.post('/linkPrompt',(req,res) =>{
    console.log("in linkPrompt")
    // Parameters `req.body` are: `prompt`, `linkText`
    getOpenAIResponseLink(req.body.prompt,req.body.linkText,"testAutocompleteClient").then((generatedText) => {
        let metadata_object = {
            "promptType": "link",
            "linkText": req.body.linkText,
        };

        res.status(200).json({text: generatedText, metadata: metadata_object})
    }).catch((e) => {
        res.status(500)
    })
})

async function getOpenAIResponseLink(prompt, linkText, user) {
    return new Promise(function (resolve, reject) {
        let fetch_url = `https://api.openai.com/v1/completions`;
        prompt = prompt.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
        linkText = linkText.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
        const promptWithCommand = `'${prompt}' Based on the quoted text continue the text to connect with '${linkText}'.`;  

        var data = `{
        "model": "text-davinci-003",
        "prompt": "${promptWithCommand}",
        "user": "${user}",
        "temperature": 0.9,
        "max_tokens": 150,
        "top_p": 1,
        "frequency_penalty": 0.2,
        "presence_penalty": 0.2
        }`;

        let fetch_options = {
        method: "POST",
        headers: {
            Authorization: "Bearer " + process.env.OPEN_AI_KEY,
            "Content-Type": "application/json",
        },
        body: data,
        };

        fetch(fetch_url, fetch_options).then((initialResponse) => {
            if (initialResponse.status >= 400) {
                resolve("...Failed to generate, please try again later.");
            } else {
                initialResponse.json().then((openAIResponse) => {
                isResultNotAllowed(openAIResponse.choices[0].text).then(
                    (isUnsafeText) => {
                    if (isUnsafeText) {
                        resolve(
                        "... generated a sensitive prompt regarding OpenAI content policy (i.e violence/self-harm)."
                        );
                    } else if (openAIResponse.choices[0].text.length < 2) {
                        resolve(
                        "... AI believes this is the end of an idea/plot."
                        );
                    } else {
                        resolve("..." + openAIResponse.choices[0].text.trim() + "...");
                    }
                    }
                );
                });
            }
        })
    });
}

// DESCRIBE ELEMENT

app.post('/describePrompt',(req,res) =>{
    console.log("in describePrompt")
    // Parameters `req.body` are: `prompt`, `describeTopic`, `describeStyle`
    getOpenAIResponseDescribe(req.body.prompt,req.body.describeTopic,req.body.describeStyle,"testAutocompleteClient").then((generatedText) => {
        let metadata_object = {
            "promptType": "describe",
            "describeTopic": req.body.describeTopic,
            "describeStyle": req.body.describeStyle
        };

        res.status(200).json({text: generatedText, metadata: metadata_object})
    }).catch((e) => {
        res.status(500)
    })
})

async function getOpenAIResponseDescribe(prompt, describeTopic, describeStyle, user) {
    return new Promise(function (resolve, reject) {
        let fetch_url = `https://api.openai.com/v1/completions`;
        prompt = prompt.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
        describeTopic = describeTopic.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
        describeStyle = describeStyle.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
        
        console.log(describeStyle)
      
        var promptWithCommand
        
        if(describeStyle == "any"){
          promptWithCommand = `'${prompt}' With the previous quoted text for context, describe '${describeTopic}'.`;
        }else{
          promptWithCommand = `'${prompt}' With the previous quoted text for context, describe '${describeTopic}' in terms of only ${describeStyle}.`;
        }
        

        var data = `{
        "model": "text-davinci-003",
        "prompt": "${promptWithCommand}",
        "user": "${user}",
        "temperature": 0.9,
        "max_tokens": 150,
        "top_p": 1,
        "frequency_penalty": 0.2,
        "presence_penalty": 0.2
        }`;

        let fetch_options = {
        method: "POST",
        headers: {
            Authorization: "Bearer " + process.env.OPEN_AI_KEY,
            "Content-Type": "application/json",
        },
        body: data,
        };

        fetch(fetch_url, fetch_options).then((initialResponse) => {
            if (initialResponse.status >= 400) {
                resolve("...Failed to generate, please try again later.");
            } else {
                initialResponse.json().then((openAIResponse) => {
                isResultNotAllowed(openAIResponse.choices[0].text).then(
                    (isUnsafeText) => {
                    if (isUnsafeText) {
                        resolve(
                        "... generated a sensitive prompt regarding OpenAI content policy (i.e violence/self-harm)."
                        );
                    } else if (openAIResponse.choices[0].text.length < 2) {
                        resolve(
                        "... AI believes this is the end of an idea/plot."
                        );
                    } else {
                        resolve(openAIResponse.choices[0].text.trim());
                    }
                    }
                );
                });
            }
        })
    });
}

//List prompt
app.post('/listPrompt',(req,res) =>{
    console.log("in listPrompt")
    // Parameters `req.body` are: `prompt`, `listTopic`, `listContext`
    getOpenAIResponseList(req.body.prompt,req.body.listTopic,req.body.listContext,"testAutocompleteClient").then((generatedText) => {
        let metadata_object = {
            "promptType": "list",
            "listTopic": req.body.listTopic,
            "listContext": req.body.listContext
        };

        res.status(200).json({text: generatedText})
    }).catch((e) => {
        res.status(500)
    })
})

async function getOpenAIResponseList(prompt, listTopic, listContext, user) {
    return new Promise(function (resolve, reject) {
        let fetch_url = `https://api.openai.com/v1/completions`;
        prompt = prompt.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
        listTopic = listTopic.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
        listContext = listContext.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
      
        const promptWithCommand = `'${prompt}' With the previous quoted text for context, give me a list of three '${listTopic}' one might find in '${listContext}', and give a brief description of each.`;

        var data = `{
        "model": "text-davinci-003",
        "prompt": "${promptWithCommand}",
        "user": "${user}",
        "temperature": 0.9,
        "max_tokens": 150,
        "top_p": 1,
        "frequency_penalty": 0.2,
        "presence_penalty": 0.2
        }`;

        let fetch_options = {
        method: "POST",
        headers: {
            Authorization: "Bearer " + process.env.OPEN_AI_KEY,
            "Content-Type": "application/json",
        },
        body: data,
        };

        fetch(fetch_url, fetch_options).then((initialResponse) => {
            if (initialResponse.status >= 400) {
                resolve("...Failed to generate, please try again later.");
            } else {
                initialResponse.json().then((openAIResponse) => {
                isResultNotAllowed(openAIResponse.choices[0].text).then(
                    (isUnsafeText) => {
                    if (isUnsafeText) {
                        resolve(
                        "... generated a sensitive prompt regarding OpenAI content policy (i.e violence/self-harm)."
                        );
                    } else if (openAIResponse.choices[0].text.length < 2) {
                        resolve(
                        "... AI believes this is the end of an idea/plot."
                        );
                    } else {
                        resolve(openAIResponse.choices[0].text.trim());
                    }
                    }
                );
                });
            }
        })
    });
}


///////////////////GET IMAGE/////////////////////////

async function getImages(prompt,user){
/*
    RETURNS JSON object like
    {
        "text": "string",
        img: [
            {
                "url": "url1"
            },
            {
                "url": "url2"
            },
            ...,
            {
                "url": "urlN"
            }
        ]
    }
*/
    return new Promise(function (resolve, reject) {
        prompt = prompt.replace(/[\r\n]/gm, '')
      
        let fetch_url = `https://api.openai.com/v1/completions`;
        prompt = prompt.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");

        const promptWithCommand = `'${prompt}' Convert the quoted text into a prompt for an artist to draw. Keep focus on any characters mentioned!`;

        var data = `{
        "model": "text-davinci-003",
        "prompt": "${promptWithCommand}",
        "user": "${user}",
        "temperature": 0.9,
        "max_tokens": 150,
        "top_p": 1,
        "frequency_penalty": 0.2,
        "presence_penalty": 0.2
        }`;

        let fetch_options = {
        method: "POST",
        headers: {
            Authorization: "Bearer " + process.env.OPEN_AI_KEY,
            "Content-Type": "application/json",
        },
        body: data,
        };

        fetch(fetch_url, fetch_options).then((initialResponse) => {
            if (initialResponse.status >= 400) {
                resolve({text: "...Failed to generate, please try again later.", img: "https://dictionary.cambridge.org/fr/images/thumb/cross_noun_002_09265.jpg"});
            } else {
                initialResponse.json().then((openAIResponse) => {
                isResultNotAllowed(openAIResponse.choices[0].text).then(
                    (isUnsafeText) => {
                    if (isUnsafeText) {
                        resolve(
                          {text: "... generated a sensitive prompt regarding OpenAI content policy (i.e violence/self-harm).", img: "https://dictionary.cambridge.org/fr/images/thumb/cross_noun_002_09265.jpg"}
                        );
                    } else if (openAIResponse.choices[0].text.length < 2) {
                        resolve(
                          {text: "...InspoGen believes this is the end of a plot/idea.", img: "https://dictionary.cambridge.org/fr/images/thumb/cross_noun_002_09265.jpg"}
                        );
                    } else {
                        
                        let fetch_url2 = `https://api.openai.com/v1/images/generations`;
                        var data2 = `{
                        "size": "256x256",
                        "prompt": "${prompt}",
                        "user": "${user}",
                        "n": 4
                        }`

                        let fetch_options2 = {
                        method: "POST",
                        headers: {
                            Authorization: "Bearer " + process.env.OPEN_AI_KEY,
                            "Content-Type": "application/json",
                        },
                        body: data2
                        };

                        fetch(fetch_url2, fetch_options2).then((initialResponse2) => {
                            if(initialResponse2.status >= 400){
                                resolve([{text: "...Failed to generate, please try again later.", img: "https://dictionary.cambridge.org/fr/images/thumb/cross_noun_002_09265.jpg"}])
                            }else{
                                initialResponse2.json().then((openAIResponse2) => {
                                  resolve({text: openAIResponse.choices[0].text.trim(), img: openAIResponse2.data});
                                })
                            }
                        })
                    }
                    }
                );
                });
            }
        })
    });
}


/////////// UNIQUE VOICE ///////////////////

app.post('/uniqueVoice', (req, res) => {
/*
    RETURNS JSON object 
    {
        "label": "Real",
        "score": float between 0 and 1
    }

    To get the Fake score, do the following:
    Fake = 1 - (real score)
*/
    getOpenAIDetectorScore(req.body.generatedText).then((score) => {
        if(score.length == 1 || score[0].label == "Error"){
            res.status(500); // This technically does the same thing as the else statement but leaving this in here in case things need to be changed
        }
        else if (score.length == 2){
            // the response from the API will have the higher Real/Fake value first
            if(score[0].label == "Real"){
                res.status(200).json(score[0]);
            }
            else{
                res.status(200).json(score[1])
            }
        }
        else{
            res.status(500);
        }
    }).catch((e) => {
        res.status(500);
    });
});

async function getOpenAIDetectorScore(generatedText){
/*
    Associated with: /uniqueVoice
    Generates a score between 0 and 1 for how "real / human" a generated prompt sounds 
    Required params: 
    {
        "generatedText": string
    }
    Requires .env HUGGINGFACE_KEY
    RETURNS JSON object like
    [
        {
            "label": "Real, Fake, or Error",
            "score": float between 0 and 1
        },
        {same as above}
    ]
*/
    return new Promise (function (resolve, reject) {
        let fetch_url = `https://api-inference.huggingface.co/models/roberta-base-openai-detector`;
        generatedText = generatedText.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");

        let data = `{
            "inputs": "${generatedText}"
        }`;

        let fetch_options = {
            method: "POST",
            headers: {
                Authorization: "Bearer " + process.env.HUGGINGFACE_KEY,
                "Content-Type": "application/json"
            },
            body: data
        };

        fetch(fetch_url, fetch_options).then((initialResponse) => {
            if(initialResponse.status >= 400){
                resolve([{label: "Error", score: 0}]);
            }
            else{
                initialResponse.json().then((data) => {
                    resolve(data[0]);
                });
            }
        });
    });
}

////////////////////////////////////////////

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

async function checkPlagarism(prompt){
    return new Promise(function (resolve, reject) {
        fetch("https://www.check-plagiarism.com/apis/checkPlag", {
        body: "key=38fbadfbd004cf7826f3a8eb11ce2268&data=" + prompt,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
        }).then((initialResponse) => {
            if(initialResponse.status >= 400){
                resolve({plagarismScore : 0, paraphrasingScore : 0})
            }else{
                initialResponse.json().then((plagarismCheck) => {
                    // console.log(plagarismCheck)
                    resolve({plagarismScore : plagarismCheck.plagPercent, paraphrasingScore : plagarismCheck.paraphrasePercent})
                })
            }
        })
    });
}

app.listen(process.env.PORT)
