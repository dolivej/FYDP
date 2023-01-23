try{
self.importScripts('../modules/firebase/firebase-app-compat.js','../modules/firebase/firebase-firestore-compat.js','../modules/firebase/firebase-auth-compat.js');


const GOOGLE_DOCS_APP_ID  = 'AIzaSyATNqxPaw3hkaL4v2VTVy0oQPxgZT1PfCo';
const autocomplete_URL = "https://hospitable-decisive-leo.glitch.me";

var accessToken = "";
var limitExceeded = false;

// function to set google chrome storage
async function setChromeStorageValues(keys, values, INSTANCE_ID, action){
  action = action || function() {};
  chrome.storage.local.get(["instances"], function(result) {
    var tempInstanceData = result.instances;
    for (var i = 0; i < keys.length; i++) {
      tempInstanceData[INSTANCE_ID][keys[i]] = values[i];
    }
    chrome.storage.local.set({instances:tempInstanceData}, function() {
      action();
    });
  });
}

// function to get google chrome storage
async function getChromeStorageValues(keys, INSTANCE_ID, action){
  chrome.storage.local.get(["instances"], function(result) {
    var tempInstanceData = result.instances;
    var result = {}
    for (var i = 0; i < keys.length; i++) {
      result[keys[i]] = tempInstanceData[INSTANCE_ID][keys[i]]
    }
    action(result);
  });
}

const REDIRECT_URL = chrome.identity.getRedirectURL();
console.log(REDIRECT_URL)
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

function getAccessTokenNotGoogleChrome(id){
  chrome.identity.launchWebAuthFlow(
    {
      url:AUTH_URL,
      interactive: true
    },
    function(responseUrl){
      if(responseUrl.includes('access_token')){
        accessToken = extractAccessToken(responseUrl)
      }
    }
  )
}

function getAccessToken(id){
  try{
    chrome.identity.getAuthToken({interactive: true}, function(token) {
      // console.log("HERE")
      accessToken = token

      if(accessToken == undefined){
        getAccessTokenNotGoogleChrome(id);
      }
    })
  }catch(e){
    console.log(e)
  }
}

async function getDoc(DocID,request) {
  if(accessToken == undefined || accessToken.length < 5){
    getAccessToken(DocID)
    return(null);
  }

  let fetch_url = `https://docs.googleapis.com/v1/documents/${DocID}?key=${GOOGLE_DOCS_APP_ID}`;

  let fetch_options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  };
  
  const response = await fetch(fetch_url, fetch_options)
  const payload = await response.json()
  return(payload.body)
}

async function getMultipleIdeas(DocID, request) {
  const doc = await getDoc(DocID)
  // const injectIndex = doc.content[doc.content.length - 1].endIndex - 1
  // chrome.storage.local.set({previousStart: injectIndex}, function() {});
  if(doc == null){
    return
  }

  let prevWords = ""
  for (let i = doc.content.length - 1; i > 0; i--) {
    if(doc.content[i].paragraph !== undefined && doc.content[i].paragraph !== null){
      let text = doc.content[i].paragraph.elements;
      if (prevWords.length > 3750){break;}
      for (let j = text.length - 1; j >= 0; j--) {
        if(text[j].textRun !== undefined && text[j].textRun !== null){
          prevWords = text[j].textRun.content + prevWords;
          if (prevWords.length > 3750){break;}
        }
      }
    }
  }
  prevWords = prevWords.replace(/[\r\n]/gm, '')
  // console.log(prevWords)
  // console.log(prevWords.length)
  
  
  getResponseMultiple(prevWords,request,DocID)
}

async function printIntoDoc(DocID) {
  setChromeStorageValues(["promptExists"], [true], DocID);

  const doc = await getDoc(DocID)
  const injectIndex = doc.content[doc.content.length - 1].endIndex - 1
  setChromeStorageValues(["previousStart"], [injectIndex], DocID);

  let prevWords = ""
  for (let i = doc.content.length - 1; i > 0; i--) {
    if(doc.content[i].paragraph !== undefined && doc.content[i].paragraph !== null){
      let text = doc.content[i].paragraph.elements;
      if (prevWords.length > 3750){break;}
      for (let j = text.length - 1; j >= 0; j--) {
        if(text[j].textRun !== undefined && text[j].textRun !== null){
          prevWords = text[j].textRun.content + prevWords;
          if (prevWords.length > 3750){break;}
        }
      }
    }
  }
  prevWords = prevWords.replace(/[\r\n]/gm, '')

  getResponse(prevWords,injectIndex,DocID)
  getResponse2(prevWords,injectIndex,DocID)
}

async function getResponse(prompt,injectIndex,DocID) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      "idToken": "test",
      "todaysDate": new Date(),
      "prompt":prompt
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(autocomplete_URL + "/getImages", requestOptions).then((res) => {
      console.log(res)
      res.json().then((resData => {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
          chrome.tabs.sendMessage(tabs[0].id,{
            type: 'image1',
            data: resData
          });  
        });
      }))
    }).catch(e => {
      console.log(e)
    })
}

async function getResponse2(prompt,injectIndex,DocID) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var raw = JSON.stringify({
    "idToken": "test",
    "todaysDate": new Date(),
    "prompt":prompt
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch(autocomplete_URL + "/getImages2", requestOptions).then((res) => {
    console.log(res)
    res.json().then((resData => {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id,{
          type: 'image2',
          data: resData
        });  
      });
    }))
  }).catch(e => {
    console.log(e)
  })
}

async function updateTextStyle(DocID, startRange, type) {
  const endRange = await getEndOfDoc(DocID)
  
  var updateRequest = [{
    updateTextStyle: {
      range: {
        segmentId: '',
        startIndex: startRange,
        endIndex: endRange,
      },
      textStyle: {
        bold: true,
        italic: false,
        foregroundColor: {
          "color": {
            "rgbColor": {
              "red": 135/255,
              "green": 119/255,
              "blue": 217/255
            }
          }
        }
      },
      fields: 'bold,foregroundColor,italic',
    },
  }];

  if (type == "normal"){
    updateRequest = [{
      updateTextStyle: {
        range: {
          segmentId: '',
          startIndex: startRange,
          endIndex: endRange,
        },
        textStyle: {
          bold: false,
          italic: false,
          foregroundColor: {
            "color": {
              "rgbColor": {
                "red": 0/255,
                "green": 0/255,
                "blue": 0/255
              }
            }
          }
        },
        fields: 'bold,foregroundColor,italic',
      },
    }]
  }
  
  const fetch_url = `https://docs.googleapis.com/v1/documents/${DocID}:batchUpdate?key=${GOOGLE_DOCS_APP_ID}`;

  fetch_options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requests: updateRequest
  }),
  };
  
  const response = await fetch(fetch_url, fetch_options)
  const payload = await response.json()

  if (type != "normal"){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id,'prompt:created');  
    });
  }else{
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
      chrome.tabs.sendMessage(tabs[0].id,'prompt:actioned');  
    });
  }
}

async function deleteFromDoc(DocID, type) {
  getChromeStorageValues(['previousStart'], DocID, async function(result) {
    const doc = await getDoc(DocID)
    const endValue = doc.content[doc.content.length - 1].endIndex - 1

    var updateRequest = [{
      deleteContentRange:{
        range: {
          segmentId: '',
          startIndex: result.previousStart,
          endIndex: endValue
        }
      }
    }];

    const fetch_url = `https://docs.googleapis.com/v1/documents/${DocID}:batchUpdate?key=${GOOGLE_DOCS_APP_ID}`;

    fetch_options = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: updateRequest
    }),
    };
    
    const response = await fetch(fetch_url, fetch_options)
    const payload = await response.json()

    if(type == "new"){
      printIntoDoc(DocID)
    }else{
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id,'prompt:actioned');  
      });
    }
  })
}

async function getEndOfDoc(DocID) {
  const doc = await getDoc(DocID)
  const endOfDoc = doc.content[doc.content.length - 1].endIndex - 1

  return(endOfDoc)
}

async function idleCheck(DocID){
  getChromeStorageValues(['promptExists'], DocID, async function(result){
    if(result.promptExists == true){
      return;
    }

    const doc = await getDoc(DocID)
    if(doc == null){
      return
    }

    setChromeStorageValues(["charcountCurrent"],[doc.content[doc.content.length - 1].endIndex - 1],DocID,function() {
      getChromeStorageValues(["charcountCurrent", "charcountPrev"], DocID, function(result2) {
        if(result2.charcountPrev == -1){
          setChromeStorageValues(["charcountPrev"],[result2.charcountCurrent],DocID)
          return;
        }
    
        if(Math.abs(result2.charcountCurrent - result2.charcountPrev) <= 15){

          // chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
          //   chrome.tabs.sendMessage(tabs[0].id,{
          //     type: 'autoprompt:generated'
          //   });    
          // });
          printIntoDoc(DocID)
          setChromeStorageValues(["charcountPrev","loadingNewPrompt", "promptExists"],[-1,false,true],DocID);
        }else{
          setChromeStorageValues(["charcountPrev"],[result2.charcountCurrent],DocID)
          return;
        }
      })
    })
  });
}

async function getResponseMultiple(prompt,request, DocID) {
  if(limitExceeded){
    getFeedbackScore();
  }
  firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      "idToken": idToken,
      "todaysDate": new Date(),
      "prompt":prompt,
      "desire":request
    });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(autocomplete_URL + "/multiplePrompts", requestOptions).then((res) => {
      res.json().then((resData => {
        // console.log(resData.cleanChoicesArray)
        setChromeStorageValues(["ideaBounceIdeas"],[resData.cleanChoicesArray], DocID, function() {
          // console.log(Response.choices)
        })
        checkUsageLimit();
      }))
    }).catch(e => {
      console.log(e)
    })
  }).catch(function(error) {
      console.log(error)
  });
}

async function printIntoDocText(DocID,text) {
  const doc = await getDoc(DocID)
  const injectIndex = doc.content[doc.content.length - 1].endIndex - 1
 
  fetch_url = `https://docs.googleapis.com/v1/documents/${DocID}:batchUpdate?key=${GOOGLE_DOCS_APP_ID}`;

  fetch_options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      requests: [
        {
          insertText: {
            text: '\n' + text,
            location: {
              index: injectIndex,
            },
          },
        },
      ],
    }),
  };
  
  const response2 = await fetch(fetch_url, fetch_options)
}

// LISTENERS
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type == "icon:clicked"){
    printIntoDoc(request.INSTANCE_ID)
  }
  if (request.type == "prompt:ignore"){
    deleteFromDoc(request.INSTANCE_ID,"basic")
    setChromeStorageValues(["promptExists","delayCount"],[false,6],request.INSTANCE_ID)
  }
  if (request.type == "prompt:accepted"){
    getChromeStorageValues(['previousStart'],request.INSTANCE_ID, function(result){
      updateTextStyle(request.INSTANCE_ID, result.previousStart, "normal")
      setChromeStorageValues(["promptExists","delayCount"],[false,2],request.INSTANCE_ID)
    })
  }
  if (request.type == "prompt:next"){
    deleteFromDoc(request.INSTANCE_ID,"new")
  }
  if (request.type == "idle:check"){
    idleCheck(request.INSTANCE_ID)
  }
  if (request.type == "ideaBounce:clicked"){
    getMultipleIdeas(request.INSTANCE_ID,request.text)
  }
  if (request.type == "autocomplete:initiated"){
    initiateNewautocomplete(request.INSTANCE_ID)
  }
  if (request.type == "ideaBounce:selected"){
    printIntoDocText(request.INSTANCE_ID, request.text)
  }
  if (request.type == "link:google"){
    getAccessToken(request.INSTANCE_ID)
  }
})



// INITIALIZING A NEW INSTANCE
async function initiateNewautocomplete(INSTANCE_ID) {
  let queryOptions = { active: true, lastFocusedWindow: true };
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions);

  chrome.storage.local.get(['instances'], function(result) {
    if (result.instances == undefined){
      var tempInstances = {}
      var initialValues = {
        previousStart: 0,
        promptExists: false,
        delayCount:0,
        charcountPrev:-1,
        charcountCurrent:0,
        sidebarOpen: false,
        loadingNewPrompt: false,
        menuItemSelected: "ideaBounce", 
        ideaBounceIdeas: [],
        docID: INSTANCE_ID,
        tabId: tab.id,
        type: 'google-doc'
      };
      tempInstances[INSTANCE_ID] = initialValues
      chrome.storage.local.set({instances: tempInstances}, function() {});
      // console.log(tempInstances)
    }else{
      var tempInstances = result.instances;
      var initialValues = {
        previousStart: 0,
        promptExists: false,
        delayCount:0,
        charcountPrev:-1,
        charcountCurrent:0,
        sidebarOpen: false,
        loadingNewPrompt: false,
        menuItemSelected: "ideaBounce", 
        ideaBounceIdeas: [],
        docID: INSTANCE_ID,
        tabId: tab.id,
        type: 'google-doc'
      };
      tempInstances[INSTANCE_ID] = initialValues
      chrome.storage.local.set({instances: tempInstances}, function() {});
      // console.log(tempInstances)
    }
  });
  
  checkAuth();

  chrome.storage.local.get(['isFirstLaunch'], function(result) {
    if (result.isFirstLaunch == undefined){
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id,{
          type: 'onboarding:true'
        });  
      });
      chrome.storage.local.set({isFirstLaunch: false}, function() {});
    }
  });
}

// DELETING AN INSTANCE
chrome.tabs.onRemoved.addListener(function (tabId, removeInfo){
  chrome.storage.local.get(['instances'], function(result) {
    if (result.instances == undefined){
      return
    }else{
      Object.keys(result.instances).forEach(function(key,index) {
          if(result.instances[key].tabId == tabId){
            var tempInstances = result.instances;
            delete tempInstances[key];
            chrome.storage.local.set({instances: tempInstances}, function() {console.log()});
            // console.log(tempInstances)
          }
      });
    }
  });
})
}catch(e){
  console.log(e)
}