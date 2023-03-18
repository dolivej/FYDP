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