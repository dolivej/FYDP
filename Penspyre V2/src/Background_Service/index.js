//Global variables
const GOOGLE_DOCS_APP_ID  = 'AIzaSyATNqxPaw3hkaL4v2VTVy0oQPxgZT1PfCo';
const BACKEND_URL = "https://hospitable-decisive-leo.glitch.me";

/*
Google Authentication for Docs READ/WRITE access
FUNCTIONS | LISTENERS | VARIABLES
*/
var ACCESS_TOKEN = ""

const REDIRECT_URL = chrome.identity.getRedirectURL();
const CLIENT_ID = "472792657842-acodhpdgi7gne5ph1tvc2npe18u25edv.apps.googleusercontent.com";
const SCOPES = ["https://www.googleapis.com/auth/documents"];
const AUTH_URL =
`https://accounts.google.com/o/oauth2/auth\
?client_id=${CLIENT_ID}\
&response_type=token\
&redirect_uri=${encodeURIComponent(REDIRECT_URL)}\
&scope=${encodeURIComponent(SCOPES.join(' '))}`;

function extractAccessToken(redirectUri) {
    let m = redirectUri.match(/[#?](.*)/);
    if (!m || m.length < 1)
      return null;
    let params = new URLSearchParams(m[1].split("#")[0]);
    return params.get("access_token");
}

function getAccessTokenNotGoogleChrome(INSTANCE_ID){
    chrome.identity.launchWebAuthFlow(
      {
        url:AUTH_URL,
        interactive: true
      },
      function(responseUrl){
        if(responseUrl.includes('access_token')){
          ACCESS_TOKEN = extractAccessToken(responseUrl)
          chrome.storage.local.set({ACCESS_TOKEN: ACCESS_TOKEN}, function() {});
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            chrome.tabs.sendMessage(tabs[0].id,{
              type: 'docs:authenticate:success',
              INSTANCE_ID: INSTANCE_ID
            });  
          });
        }
      }
    )
}

function getAccessToken(INSTANCE_ID){
    try{
      chrome.identity.getAuthToken({interactive: true}, function(token) {
        ACCESS_TOKEN = token
        chrome.storage.local.set({ACCESS_TOKEN: ACCESS_TOKEN}, function() {});

        if(ACCESS_TOKEN == undefined){
            getAccessTokenNotGoogleChrome(INSTANCE_ID);
        }else{
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                chrome.tabs.sendMessage(tabs[0].id,{
                  type: 'docs:authenticate:success',
                  INSTANCE_ID: INSTANCE_ID
                });  
            });
        }
      })
    }catch(e){
      console.log(e)
    }
}


/*
Google Docs reading words
FUNCTIONS | LISTENERS | VARIABLES
*/
async function docsIdleCheck(INSTANCE_ID, prevWordCount, differenceAmount) {
  console.log(ACCESS_TOKEN)
  if(ACCESS_TOKEN == undefined || ACCESS_TOKEN.length < 5){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id,{
        type: 'idlecheck',
        INSTANCE_ID: INSTANCE_ID,
        isIdle: false,
        prevWordCount: 0
      }); 
    });
    return
  }

  const regex = /d\/(.*?)\//g;
  var DocID = INSTANCE_ID.match(regex)[0];
  DocID = DocID.replace("d/","")
  DocID = DocID.replace("/","")

  let fetch_url = `https://docs.googleapis.com/v1/documents/${DocID}?key=${GOOGLE_DOCS_APP_ID}`;

  let fetch_options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  };
  
  const response = await fetch(fetch_url, fetch_options)
  const payload = await response.json()
  
  doc = payload.body
  if(doc == undefined || doc == null){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id,{
        type: 'idlecheck',
        INSTANCE_ID: INSTANCE_ID,
        isIdle: false,
        prevWordCount: 0
      }); 
    });
    return
  }

  let currentWords = ""
  for (let i = doc.content.length - 1; i > 0; i--) {
    if(doc.content[i].paragraph !== undefined && doc.content[i].paragraph !== null){
      let text = doc.content[i].paragraph.elements;
      for (let j = text.length - 1; j >= 0; j--) {
        if(text[j].textRun !== undefined && text[j].textRun !== null){
          currentWords = text[j].textRun.content + currentWords;
        }
      }
    }
  }

  let currentWordsCount = currentWords.length
  console.log(currentWordsCount)

  if(currentWordsCount - prevWordCount < differenceAmount){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id,{
        type: 'idlecheck',
        INSTANCE_ID: INSTANCE_ID,
        isIdle: true,
        prevWordCount: currentWordsCount
      });  
    });
  }else{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id,{
        type: 'idlecheck',
        INSTANCE_ID: INSTANCE_ID,
        isIdle: false,
        prevWordCount: currentWordsCount
      });  
    });
  }
}


/*
Generating Text only Prompts
FUNCTIONS | LISTENERS | VARIABLES
*/
function generateData(INSTANCE_ID, generateData){
    if(!generateData.isTextAndImages){
      generateDataTextOnly(INSTANCE_ID, generateData)
    }else{
      generateDataTextAndImages(INSTANCE_ID, generateData)
    }
}

async function generateDataTextOnly(INSTANCE_ID, generateData) {
  if(ACCESS_TOKEN == undefined || ACCESS_TOKEN.length < 5){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id,{
        type: 'generated:result',
        INSTANCE_ID: INSTANCE_ID,
        prompts: [{text:"",image:""},{text:"",image:""},{text:"Failed to generate, please try again.",image:""}]
      });  
    }); 
    return
  }

  const regex = /d\/(.*?)\//g;
  var DocID = INSTANCE_ID.match(regex)[0];
  DocID = DocID.replace("d/","")
  DocID = DocID.replace("/","")

  let fetch_url = `https://docs.googleapis.com/v1/documents/${DocID}?key=${GOOGLE_DOCS_APP_ID}`;

  let fetch_options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  };
  
  const response = await fetch(fetch_url, fetch_options)
  const payload = await response.json()
  
  doc = payload.body
  if(doc == undefined || doc == null){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id,{
        type: 'generated:result',
        INSTANCE_ID: INSTANCE_ID,
        prompts: [{text:"",image:""},{text:"",image:""},{text:"Failed to generate, please try again.",image:""}]
      });  
    }); 
    return
  }

  let currentWords = ""
  for (let i = doc.content.length - 1; i > 0; i--) {
    if(doc.content[i].paragraph !== undefined && doc.content[i].paragraph !== null){
      let text = doc.content[i].paragraph.elements;
      if (currentWords.length > 1800){break}
      for (let j = text.length - 1; j >= 0; j--) {
        if(text[j].textRun !== undefined && text[j].textRun !== null){
          currentWords = text[j].textRun.content + currentWords;
          if (currentWords.length > 1800){break}
        }
      }
    }
  }

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "idToken": "FYDP",
    "prompt": currentWords,
    "continueFocus": generateData.continueFocus,
    "continueTone": generateData.continueTone,
    "linkText": generateData.linkText,
    "describeTopic": generateData.describeTopic,
    "describeStyle": generateData.describeStyle,
    "listTopic": generateData.listTopic,
    "listContext": generateData.listContext
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  var promptTypeUrl = ""
  if(generateData.promptType == "continue"){
    promptTypeUrl = "/continuePrompt"
  }else if(generateData.promptType == "link"){
    promptTypeUrl = "/linkPrompt"
  }else if(generateData.promptType == "describe"){
    promptTypeUrl = "/describePrompt"
  }else if(generateData.promptType == "list"){
    promptTypeUrl = "/listPrompt"
  }

  fetch(BACKEND_URL + promptTypeUrl, requestOptions).then((res) => {
    res.json().then((resData => {
      console.log(resData)
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id,{
          type: 'generated:result',
          INSTANCE_ID: INSTANCE_ID,
          prompts: [{text:"",image:""},{text:"",image:""},{text:resData.text,image:""}]
        });  
      }); 
    }))
  }).catch(e => {
    console.log(e)
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id,{
        type: 'generated:result',
        INSTANCE_ID: INSTANCE_ID,
        prompts: [{text:"",image:""},{text:"",image:""},{text:"Failed to generate, please try again.",image:""}]
      });  
    }); 
  })
}

async function generateDataTextAndImages(INSTANCE_ID, generateData) {
  if(ACCESS_TOKEN == undefined || ACCESS_TOKEN.length < 5){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id,{
        type: 'generated:result',
        INSTANCE_ID: INSTANCE_ID,
        prompts: [{text:"",image:""},{text:"",image:""},{text:"Failed to generate, please try again.",image:"https://dictionary.cambridge.org/fr/images/thumb/cross_noun_002_09265.jpg"}]
      });  
    }); 
    return
  }

  const regex = /d\/(.*?)\//g;
  var DocID = INSTANCE_ID.match(regex)[0];
  DocID = DocID.replace("d/","")
  DocID = DocID.replace("/","")

  let fetch_url = `https://docs.googleapis.com/v1/documents/${DocID}?key=${GOOGLE_DOCS_APP_ID}`;

  let fetch_options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
  };
  
  const response = await fetch(fetch_url, fetch_options)
  const payload = await response.json()
  
  doc = payload.body
  if(doc == undefined || doc == null){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id,{
        type: 'generated:result',
        INSTANCE_ID: INSTANCE_ID,
        prompts: [{text:"",image:""},{text:"",image:""},{text:"Failed to generate, please try again.",image:"https://dictionary.cambridge.org/fr/images/thumb/cross_noun_002_09265.jpg"}]
      });  
    }); 
    return
  }

  let currentWords = ""
  for (let i = doc.content.length - 1; i > 0; i--) {
    if(doc.content[i].paragraph !== undefined && doc.content[i].paragraph !== null){
      let text = doc.content[i].paragraph.elements;
      if (currentWords.length > 1800){break}
      for (let j = text.length - 1; j >= 0; j--) {
        if(text[j].textRun !== undefined && text[j].textRun !== null){
          currentWords = text[j].textRun.content + currentWords;
          if (currentWords.length > 1800){break}
        }
      }
    }
  }

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "idToken": "FYDP",
    "prompt": currentWords,
    "continueFocus": generateData.continueFocus,
    "continueTone": generateData.continueTone,
    "linkText": generateData.linkText,
    "describeTopic": generateData.describeTopic,
    "describeStyle": generateData.describeStyle,
    "listTopic": generateData.listTopic,
    "listContext": generateData.listContext
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  var promptTypeUrl = ""
  if(generateData.promptType == "continue"){
    promptTypeUrl = "/continuePrompt"
  }else if(generateData.promptType == "link"){
    promptTypeUrl = "/linkPrompt"
  }else if(generateData.promptType == "describe"){
    promptTypeUrl = "/describePrompt"
  }else if(generateData.promptType == "list"){
    promptTypeUrl = "/listPrompt"
  }

  fetch(BACKEND_URL + promptTypeUrl, requestOptions).then((res) => {
    res.json().then((resData => {
      getImage(INSTANCE_ID,resData.text)
    }))
  }).catch(e => {
    console.log(e)
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id,{
        type: 'generated:result',
        INSTANCE_ID: INSTANCE_ID,
        prompts: [{text:"",image:""},{text:"",image:""},{text:"Failed to generate, please try again.",image:"https://dictionary.cambridge.org/fr/images/thumb/cross_noun_002_09265.jpg"}]
      });  
    }); 
  })
}

async function getImage(INSTANCE_ID, prompt) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "idToken": "FYDP",
    "prompt": prompt
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch(BACKEND_URL + "/getImages", requestOptions).then((res) => {
    res.json().then((resData => {
      console.log(resData)
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id,{
          type: 'generated:result',
          INSTANCE_ID: INSTANCE_ID,
          prompts: [{text:"",image:""},{text:"",image:""},{text:prompt,image:resData.img}]
        });  
      }); 
    }))
  }).catch(e => {
    console.log(e)
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id,{
        type: 'generated:result',
        INSTANCE_ID: INSTANCE_ID,
        prompts: [{text:"",image:""},{text:"",image:""},{text:"Failed to generate, please try again.",image:"https://dictionary.cambridge.org/fr/images/thumb/cross_noun_002_09265.jpg"}]
      });  
    }); 
  })
}


/*
Generating Text only Prompts
FUNCTIONS | LISTENERS | VARIABLES
*/
function analyzeText(INSTANCE_ID, text, promptId){
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "idToken": "FYDP",
    "text": text
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch(BACKEND_URL + "/checkPlagarism", requestOptions).then((res) => {
    res.json().then((resData => {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id,{
          type: 'analyzedText:result',
          INSTANCE_ID: INSTANCE_ID,
          result: {plagarismScore: resData.plagarismScore, paraphrasingScore: resData.paraphrasingScore, uniquenessScore: 90},
          text: text,
          promptId: promptId
        });  
      }); 
    }))
  }).catch(e => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id,{
        type: 'analyzedText:result',
        INSTANCE_ID: INSTANCE_ID,
        result: {plagarismScore: 0, paraphrasingScore: 0, uniquenessScore: 100},
        text: text,
        promptId: promptId
      });  
    }); 
  })
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  chrome.storage.local.get(['ACCESS_TOKEN'], function(result) {
    ACCESS_TOKEN = result.ACCESS_TOKEN
    if (request.type == "docs:authenticate"){
      getAccessToken(request.INSTANCE_ID)
    }
    if (request.type == "docs:generate"){
      //generateData(request.INSTANCE_ID, request.generateData)
      generateData(request.INSTANCE_ID, request.generateData)
    }
    if (request.type == "docs:idlecheck"){
      docsIdleCheck(request.INSTANCE_ID, request.prevWordCount, request.differenceAmount)
    }
    if (request.type == "analyzeText"){
      analyzeText(request.INSTANCE_ID, request.text, request.promptId)
    }
  });
})


/*
Google Authentication for Docs READ/WRITE access
FUNCTIONS | LISTENERS | VARIABLES
*/