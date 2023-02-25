require('dotenv').config()
const helmet = require("helmet");
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors')
const NodeCache = require("node-cache")
const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));

var app = express();

const cache = new NodeCache({stdTTL: 120, checkperiod: 300, maxKeys: 3});

app.use(bodyParser.json());

app.post('/getImages',(req,res) =>{
    temporary_array_to_match_old_endpoint = [];
    if(cache.has("image1")){

        if(cache.get("image1").length > 1){
            let temp = cache.get("image1"); // store as separate to not mutate original cache for now
            first_element_of_cache = temp.shift(1); // temp now becomes the rest of the cache with the first element removed

            // overwrite cached value with new subcached element
            cache.set("image1", temp);
            temporary_array_to_match_old_endpoint.push(first_element_of_cache)
            // res.status(200).json(first_element_of_cache);
            res.status(200).json(temporary_array_to_match_old_endpoint);
            
        }
        else if (cache.get("image1").length == 1){
            // res.status(200).json(cache.take("image1")[0]); // take gets the cache and then deletes it. this one returns it in an array so need to grab first element 
            res.status(200).json(cache.take("image1"));
        }
        else{
            res.status(500); // something is wrong with the cache
        }
        
    }
    else{
        getOpenAIResponseSingle(req.body.prompt,"testAutocompleteClient").then((generatedText) => {
            getImages(generatedText,"testAutocompleteClient").then((results) =>{
                // construct original response object
                let first_result_object = {
                    "text": results[0].text,
                    "img": results[0].img[0].url
                };

                // create datapoint for cache
                temp_list = [];
                for(i = 1; i < results[0].img.length; i++){
                    // i = 1 ignore the first one
                    let temp_cache_object = {
                        "text": results[0].text,
                        "img": results[0].img[i].url
                    };
                    temp_list.push(temp_cache_object);
                }

                cache.set("image1", temp_list); // TODO: Test to see if type works
                // res.status(200).json(first_result_object);
                temporary_array_to_match_old_endpoint.push(first_result_object)
                res.status(200).json(temporary_array_to_match_old_endpoint);
            })
        }).catch((e) => {
            res.status(500)
        })
    }
    
})

app.post('/getImages2',(req,res) =>{
    temporary_array_to_match_old_endpoint = [];
    if(cache.has("image2")){
        if(cache.get("image2").length > 1){
            let temp = cache.get("image2"); // store as separate to not mutate original cache for now
            first_element_of_cache = temp.shift(1); // temp now becomes the rest of the cache with the first element removed

            // overwrite cached value with new subcached element
            cache.set("image2", temp);
            temporary_array_to_match_old_endpoint.push(first_element_of_cache)
            // res.status(200).json(first_element_of_cache);
            res.status(200).json(temporary_array_to_match_old_endpoint);
        }
        else if (cache.get("image2").length == 1){
            // res.status(200).json(cache.take("image2")[0]); // take gets the cache and then deletes it. this one returns it in an array so need to grab first element 
            res.status(200).json(cache.take("image2"));
        }
        else{
            res.status(500); // something is wrong with the cache
        }
    }
    else{
        getOpenAIResponseSingle(req.body.prompt,"testAutocompleteClient").then((generatedText) => {
            getImages(generatedText,"testAutocompleteClient").then((results) =>{
                // construct original response object
                let first_result_object = {
                    "text": results[0].text,
                    "img": results[0].img[0].url
                };

                // create datapoint for cache
                temp_list = [];
                for(i = 1; i < results[0].img.length; i++){
                    // i = 1 ignore the first one
                    let temp_cache_object = {
                        "text": results[0].text,
                        "img": results[0].img[i].url
                    };
                    temp_list.push(temp_cache_object);
                }

                cache.set("image2", temp_list); // TODO: Test to see if type works
                // res.status(200).json(first_result_object);
                temporary_array_to_match_old_endpoint.push(first_result_object)
                res.status(200).json(temporary_array_to_match_old_endpoint);
            })
        }).catch((e) => {
            res.status(500)
        })
    }
    
})

app.get('/testPlagarismChecker',(req,res) =>{
    checkPlagarism('When he was nearly thirteen, my brother Jem got his arm badly broken at the elbow. When it healed, and Jem’s fears of never being able to play football were assuaged, he was seldom self-conscious about his injury.').then((result)=>{
        res.status(200).json(result)
    })
})

// *** New stuff for text generation *** //

app.post('/continuePrompt',(req,res) =>{
    console.log("in continuePrompt")
    // Parameters `req.body` are: `prompt`, `continueFocus`, `continueTone`
    getOpenAIResponseContinue(req.body.prompt,req.body.continueFocus,req.body.continueTone,"testAutocompleteClient").then((generatedText) => {
        res.status(200).json({text: generatedText})
    }).catch((e) => {
        res.status(500)
    })
})

async function getOpenAIResponseContinue(prompt, continueFocus, continueTone, user) {
    return new Promise(function (resolve, reject) {
        let fetch_url = `https://api.openai.com/v1/completions`;
        prompt = prompt.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
        const promptWithCommand = `"""${prompt}""" Continue the story as a ${continueFocus} with ${continueTone} undertone.`;

        var data = `{
        "model": "davinci-003",
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
                resolve([{ text: "...Failed to generate, please try again later." }]);
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
                        resolve(openAIResponse.choices[0].text);
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
        res.status(200).json({text: generatedText})
    }).catch((e) => {
        res.status(500)
    })
})

async function getOpenAIResponseLink(prompt, linkText, user) {
    return new Promise(function (resolve, reject) {
        let fetch_url = `https://api.openai.com/v1/completions`;
        prompt = prompt.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
        const promptWithCommand = `"""${prompt}""" Continue the story to connect with """${linkText}""".`;

        var data = `{
        "model": "davinci-003",
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
                resolve([{ text: "...Failed to generate, please try again later." }]);
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
                        resolve(openAIResponse.choices[0].text);
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
        res.status(200).json({text: generatedText})
    }).catch((e) => {
        res.status(500)
    })
})

async function getOpenAIResponseDescribe(prompt, describeTopic, describeStyle, user) {
    return new Promise(function (resolve, reject) {
        let fetch_url = `https://api.openai.com/v1/completions`;
        prompt = prompt.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
        const promptWithCommand = `"""${prompt}""" Describe """${describeTopic}""" in terms of ${describeStyle}`;

        var data = `{
        "model": "davinci-003",
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
                resolve([{ text: "...Failed to generate, please try again later." }]);
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
                        resolve(openAIResponse.choices[0].text);
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
        res.status(200).json({text: generatedText})
    }).catch((e) => {
        res.status(500)
    })
})

async function getOpenAIResponseList(prompt, listTopic, listContext, user) {
    return new Promise(function (resolve, reject) {
        let fetch_url = `https://api.openai.com/v1/completions`;
        prompt = prompt.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
        const promptWithCommand = `"""${prompt}""" Generate a list of """${listTopic}""" one might find in """${listContext}"""`;

        var data = `{
        "model": "davinci-003",
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
                resolve([{ text: "...Failed to generate, please try again later." }]);
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
                        resolve(openAIResponse.choices[0].text);
                    }
                    }
                );
                });
            }
        })
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

async function getImages(prompt,user){
    return new Promise(function (resolve, reject) {
        prompt = prompt.replace(/[\r\n]/gm, '')
        let fetch_url = `https://api.openai.com/v1/images/generations`;

        var data = `{
        "size": "256x256",
        "prompt": "${"Digital art of " + prompt}",
        "user": "${user}",
        "n": 4 
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
                    // resolve([{text: prompt, img: openAIResponse.data[0].url}])
                    resolve([{text: prompt, img: openAIResponse.data}]) // not zero to return all responses, must account for this in getImages()
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
                resolve([{checkFailed : true}])
            }else{
                initialResponse.json().then((plagarismCheck) => {
                    console.log(plagarismCheck)
                    resolve([{checkFailed : false}])
                })
            }
        })
    });
}

app.listen(5000)
