var isFirstLogin = false;

const date = new Date();
const timestampInMs = date.getTime();
const sessionID = Math.floor(date.getTime() / 1000);

const sessionObject = {
  "integrations": {
    "Amplitude": {
      "session_id": sessionID
    }
  }
}


//Analytics
!(function () {
  var analytics = (window.analytics = window.analytics || []);
  if (!analytics.initialize)
      if (analytics.invoked) window.console && console.error && console.error("Segment snippet included twice.");
      else {
          analytics.invoked = !0;
          analytics.methods = [
              "trackSubmit",
              "trackClick",
              "trackLink",
              "trackForm",
              "pageview",
              "identify",
              "reset",
              "group",
              "track",
              "ready",
              "alias",
              "debug",
              "page",
              "once",
              "off",
              "on",
              "addSourceMiddleware",
              "addIntegrationMiddleware",
              "setAnonymousId",
              "addDestinationMiddleware",
          ];
          analytics.factory = function (e) {
              return function () {
                  var t = Array.prototype.slice.call(arguments);
                  t.unshift(e);
                  analytics.push(t);
                  return analytics;
              };
          };
          for (var e = 0; e < analytics.methods.length; e++) {
              var key = analytics.methods[e];
              analytics[key] = analytics.factory(key);
          }
          // analytics.load = function (key, e) {
          //     var t = document.createElement("script");
          //     t.type = "text/javascript";
          //     t.async = !0;
          //     t.src = "https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";
          //     var n = document.getElementsByTagName("script")[0];
          //     n.parentNode.insertBefore(t, n);
          //     analytics._loadOptions = e;
          // };
          analytics._writeKey = "jqjqda9FSnujaKVmMeDO7ORJ47Ctrcpb";
          analytics.SNIPPET_VERSION = "4.15.3";
          // analytics.load("jqjqda9FSnujaKVmMeDO7ORJ47Ctrcpb");
          analytics.page();
      }
})();


// setting instance ID for this instance
const InstanceURL = window.location.href;
const regex = /d\/(.*?)\//g;
var INSTANCE_ID = InstanceURL.match(regex)[0];
INSTANCE_ID = INSTANCE_ID.replace("d/","")
INSTANCE_ID = INSTANCE_ID.replace("/","")

// function to set google chrome storage
function setChromeStorageValues(keys, values, action){
  action = action || function() {};
  chrome.storage.local.get(["instances"], function(result) {
    var tempInstanceData = result.instances;
    for (var i = 0; i < keys.length; i++) {
      tempInstanceData[INSTANCE_ID][keys[i]] = values[i];
      // console.log(keys[i] + " SET TO " + values[i])
    }
    chrome.storage.local.set({instances:tempInstanceData}, function() {
      action();
    });
  });
}

// function to get google chrome storage
function getChromeStorageValues(keys,action){
  chrome.storage.local.get(["instances"], function(result) {
    var tempInstanceData = result.instances;
    var result = {}
    for (var i = 0; i < keys.length; i++) {
      result[keys[i]] = tempInstanceData[INSTANCE_ID][keys[i]]
    }
    action(result);
  });
}

// function to see if change in storage is in this instance and find the change
function noChangeInInstance(oldInstances,newInstnaces){
  const obj1Length = Object.keys(oldInstances).length;
  const obj2Length = Object.keys(newInstnaces).length;
  
  if (obj1Length === obj2Length) {
    return Object.keys(oldInstances).every(
      key => newInstnaces.hasOwnProperty(key)
      && newInstnaces[key] === oldInstances[key]
    );
  }

  return false;
}

// function to see if change in storage is in this instance and find the change
function getInstanceChange(oldInstances,newInstnaces){
  var changedKeys = []
  var valueMap = {}
  for (var key in oldInstances) {
    if (oldInstances.hasOwnProperty(key)) {
        if(oldInstances[key] !== newInstnaces[key]){
          changedKeys.push(key)
          valueMap[key] = {
            oldValue: oldInstances[key],
            newValue: newInstnaces[key]
          }
        }
    }
  }
  return {
    changedKeys: changedKeys,
    valueMap: valueMap
  }
}

const autoPromptTimeOptionsKey = ["15 seconds","30 seconds","1 minute","2 minutes"];
const autoPromptTimeOptionsValue = [15,30,60,120];
const disableOptionsKey = ["Not Disabled","15m Disabled", "30m Disabled", "Disabled"];
const disableOptionsValue = [0,15,30,1440];
var idleCheckServiceId;

chrome.runtime.sendMessage({
  type: 'link:google',
  INSTANCE_ID: INSTANCE_ID,
})

const editingCanvas = document.querySelector("#kix-appview")
const googleBody = document.querySelector("body")

// MODAL ELEMENTS
const modalBackground = document.createElement('div');
modalBackground.style.display = "none";
modalBackground.style.position = "fixed";
modalBackground.style.zIndex = "9999";
modalBackground.style.paddingTop = "10%";
modalBackground.style.left = "0";
modalBackground.style.top = "0";
modalBackground.style.width = "100%";
modalBackground.style.height = "100%";
modalBackground.style.overflowY = "scroll";
modalBackground.style.backgroundColor = "rgba(0,0,0,0.4)"
googleBody.appendChild(modalBackground);

const modalContent = document.createElement('div');
modalContent.style.backgroundColor = "white";
modalContent.style.margin = "auto";
modalContent.style.padding = "20px";
modalContent.style.border = "2px solid #58DE37";
modalContent.style.borderRadius = "4px";
modalContent.style.boxShadow = "10px 10px 33px 0px rgba(1,1,1,0.75)";
modalContent.style.position = "relative";
modalContent.style.textAlign = "center";
modalContent.style.overflowY = "scroll"
modalBackground.appendChild(modalContent)

function spawnModal(width,height){
  setChromeStorageValues(["modalOpen"],[true]);
  width = width || "400px"
  height = height || "450px"
  modalContent.style.width = width;
  modalContent.style.height = height;
  modalBackground.style.display="block"
}

function hideModal(){
  setChromeStorageValues(["modalOpen"],[false]);
  modalBackground.style.display="none"
  modalContent.innerHTML = ""
}

function clearModal(){
  modalContent.innerHTML = ""
}

function addModalTitle(title,hasLogo){
  const modalTitleContainer = document.createElement('div');
  modalTitleContainer.style.display = "flex";
  modalTitleContainer.style.alignItems = "center";
  modalTitleContainer.style.justifyContent = "center";

  const svgLogo = document.createElement('div');
  svgLogo.innerHTML=`
  <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_306_1981)">
        <circle cx="30" cy="26" r="26" fill="#58DE37"/>
        </g>
        <path d="M27.2908 25.8712L39.2355 17.5614L41.0538 19.5593L31.6589 30.6708L27.2908 25.8712ZM23.6986 26.5052L30.6906 34.1877C30.8353 34.3311 31.0088 34.4421 31.1997 34.5135C31.3905 34.5848 31.5943 34.6149 31.7976 34.6016C32.001 34.5884 32.1991 34.5321 32.3791 34.4366C32.5591 34.3411 32.7167 34.2085 32.8417 34.0476L44.3292 20.4609C44.5581 20.2094 44.6876 19.8833 44.6937 19.5433C44.6997 19.2034 44.5818 18.8728 44.3621 18.6134L40.4879 14.3566C40.2502 14.1134 39.9322 13.965 39.5932 13.9391C39.2541 13.9132 38.9173 14.0116 38.6454 14.2158L24.0402 24.3766C23.8682 24.4859 23.7214 24.6304 23.6094 24.8006C23.4974 24.9708 23.4227 25.1629 23.3905 25.364C23.3582 25.5652 23.3689 25.771 23.4221 25.9677C23.4752 26.1644 23.5694 26.3476 23.6986 26.5052ZM16.3086 35.5636L24.9687 37.0625L27.249 34.9871L22.5795 29.8565L16.3086 35.5636Z" fill="#F2F2F2"/>
        <defs>
        <filter id="filter0_d_306_1981" x="0" y="0" width="60" height="60" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
        <feOffset dy="4"/>
        <feGaussianBlur stdDeviation="2"/>
        <feComposite in2="hardAlpha" operator="out"/>
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_306_1981"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_306_1981" result="shape"/>
        </filter>
        </defs>
        </svg>
  `;

  const titleText = document.createElement('p');
  titleText.style.fontFamily="Roboto";
  titleText.style.fontSize="30px";
  titleText.style.color="#58DE37";
  titleText.style.paddingLeft="5px";
  titleText.style.paddingBottom="5px";
  titleText.style.fontWeight="bold";
  titleText.innerText=title;

  if(hasLogo){
    modalTitleContainer.appendChild(svgLogo)
  }
  modalTitleContainer.appendChild(titleText)
  modalContent.appendChild(modalTitleContainer)
}

function addModalText(subtitle,body){
  body = body || ""
  const modalTextContainer = document.createElement('div');
  modalTextContainer.style.fontFamily = "Roboto";
  modalTextContainer.style.marginLeft = "30px";
  modalTextContainer.style.marginRight = "30px";
  modalTextContainer.style.textAlign = "center";
  modalTextContainer.style.borderTop = "1px solid #A8A8A8";
  modalTextContainer.style.borderBottom = "1px solid #A8A8A8";
  modalTextContainer.style.marginBottom = "10px";

  const modalSubText = document.createElement('p');
  modalSubText.style.fontSize="14px";
  modalSubText.style.fontWeight="bold";
  modalSubText.innerHTML=subtitle

  const modalBodyText = document.createElement('p');
  modalBodyText.style.fontSize="12px";
  modalBodyText.innerHTML=body

  modalTextContainer.appendChild(modalSubText)
  if(body !== ""){
    modalTextContainer.appendChild(modalBodyText)
  }
  modalContent.appendChild(modalTextContainer)
}

function addModalButton(button1Text, type, width, button1Func, special){
  const modalButton1 = document.createElement('div');
  modalButton1.style.marginTop = "5px";
  modalButton1.style.marginLeft = "auto";
  modalButton1.style.marginRight = "auto";
  modalButton1.style.textAlign = "center";
  modalButton1.style.border = "2px solid #58DE37";
  modalButton1.style.borderRadius = "5px";
  modalButton1.style.padding = '10px';
  modalButton1.style.paddingTop = '13px';
  modalButton1.style.paddingBottom = '13px';
  modalButton1.style.fontWeight = "bold";
  modalButton1.style.fontFamily = "Roboto";
  modalButton1.style.color = "#58DE37"
  modalButton1.style.width = width;

  if(type == "textButton"){
    modalButton1.innerText=button1Text;

    modalButton1.onmouseover = function() {
      modalButton1.style.cursor='pointer'
      modalButton1.style.boxShadow = "10px 10px 24px -16px rgba(0,0,0,0.75)"
    }
    modalButton1.onmouseleave = function() {
      modalButton1.style.cursor='auto'
      modalButton1.style.boxShadow = "10px 10px 24px -19px rgba(0,0,0,0.75)"
    }

    modalButton1.onclick = function() {
      button1Func();
    }

    modalContent.appendChild(modalButton1)
  }

  if(type == "backButton"){
    const modalButtonLink = document.createElement('p');
    modalButtonLink.style.position="absolute";
    modalButtonLink.style.left="0";
    modalButtonLink.style.right="0";
    modalButtonLink.style.margin="auto";
    modalButtonLink.style.width=width;
    modalButtonLink.style.fontFamily="Roboto";
    modalButtonLink.style.color="#58DE37";
    modalButtonLink.style.fontSize="14px";
    modalButtonLink.style.bottom="0";
    modalButtonLink.style.marginBottom="20px";

    if(special === "special"){
      modalButtonLink.style.marginBottom="50px";
    }

    const modalButtonLinkInner = document.createElement('u');
    modalButtonLinkInner.innerText=button1Text;

    modalButtonLink.appendChild(modalButtonLinkInner)

    modalButtonLink.onmouseover = function() {
      modalButtonLink.style.cursor='pointer'
    }

    modalButtonLink.onmouseleave = function() {
      modalButtonLink.style.cursor='auto'
    }

    modalButtonLink.onclick = function() {
      button1Func();
    }

    modalContent.appendChild(modalButtonLink)
  }

  if(type == "googleButton"){
    modalButton1.style.display="flex";
    modalButton1.style.alignItems="center";
    modalButton1.style.justifyContent="center";
    modalButton1.style.paddingTop="0px";
    modalButton1.style.paddingBottom="0px"
    
    const svgLogo = document.createElement('div');
    svgLogo.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.2845 7.35591H8.95748V10.8069H13.7495C13.3035 12.9999 11.4365 14.2599 8.95748 14.2599C8.26381 14.2611 7.57674 14.1253 6.93566 13.8604C6.29458 13.5955 5.71211 13.2066 5.22166 12.716C4.73121 12.2255 4.34243 11.6429 4.07762 11.0018C3.8128 10.3607 3.67716 9.67358 3.67848 8.97991C3.67729 8.28633 3.81303 7.59934 4.0779 6.95833C4.34278 6.31731 4.73158 5.73489 5.22202 5.24445C5.71245 4.75402 6.29488 4.36521 6.93589 4.10034C7.5769 3.83546 8.2639 3.69973 8.95748 3.70091C10.2165 3.70091 11.3545 4.14791 12.2475 4.87891L14.8475 2.27991C13.2635 0.898913 11.2325 0.0469131 8.95748 0.0469131C7.78329 0.0434809 6.62 0.272223 5.53453 0.719983C4.44906 1.16774 3.46282 1.82569 2.63253 2.65597C1.80225 3.48625 1.14431 4.47249 0.696548 5.55796C0.248788 6.64343 0.0200464 7.80672 0.0234786 8.98091C0.0199137 10.1551 0.248565 11.3185 0.696278 12.404C1.14399 13.4896 1.80193 14.4758 2.63224 15.3062C3.46255 16.1365 4.44884 16.7944 5.53437 17.2421C6.6199 17.6898 7.78325 17.9185 8.95748 17.9149C13.4245 17.9149 17.4865 14.6659 17.4865 8.98091C17.4865 8.45291 17.4055 7.88391 17.2845 7.35591Z" fill="#58DE37"/>
</svg>
    `;

    const text = document.createElement('p');
    text.style.paddingLeft = "5px"
    text.innerText=button1Text;

    modalButton1.appendChild(svgLogo)
    modalButton1.appendChild(text)

    modalButton1.onmouseover = function() {
      modalButton1.style.cursor='pointer'
      modalButton1.style.boxShadow = "10px 10px 24px -16px rgba(0,0,0,0.75)"
    }
    modalButton1.onmouseleave = function() {
      modalButton1.style.cursor='auto'
      modalButton1.style.boxShadow = "10px 10px 24px -19px rgba(0,0,0,0.75)"
    }

    modalButton1.onclick = function() {
      button1Func();
    }

    modalContent.appendChild(modalButton1)
  }
}

const inputErrorMessage = document.createElement('div');
inputErrorMessage.style.fontFamily="Roboto";
inputErrorMessage.style.fontSize="14px";
inputErrorMessage.style.fontWeight="bold";
inputErrorMessage.style.color="#D9779A";
inputErrorMessage.style.margin="auto";
inputErrorMessage.style.marginTop="5px"
inputErrorMessage.style.display="none";

function addInputErrorMessage(){
  modalContent.appendChild(inputErrorMessage)
}

function setInputErrorMessageVisible(errorMessage){
  inputErrorMessage.innerText = errorMessage;
  inputErrorMessage.style.display="block"
}

function hideInputErrorMessage(){
  inputErrorMessage.style.display="none"
}

function addModalInputField(inputPlaceholderText, inputType, width, inputMarginTop, inputId){
  const inputWrapper = document.createElement('div');
  inputWrapper.style.width = "61%";
  inputWrapper.style.margin="auto"

  const modalInput = document.createElement('input');
  modalInput.style.fontFamily = "Roboto";
  modalInput.style.fontSize = "14px";
  modalInput.style.backgroundColor = "#fdfdfd";
  modalInput.style.border = "2px solid #DFE1E6";
  modalInput.style.fontWeight = "bold";
  modalInput.style.padding = "10px";
  modalInput.style.borderRadius = "4px";
  modalInput.style.marginTop = inputMarginTop;
  modalInput.style.width = width;

  modalInput.setAttribute("type",inputType);
  modalInput.setAttribute("placeholder",inputPlaceholderText);
  modalInput.setAttribute("id",inputId)

  inputWrapper.appendChild(modalInput)
  modalContent.appendChild(inputWrapper);
}


function addLikertScaleInput(){
  const likertWrapper = document.createElement('div');
  likertWrapper.style.display = "flex";
  likertWrapper.style.alignItems = "center";
  likertWrapper.style.fontFamily = "Roboto";
  likertWrapper.style.fontSize = "16px";
  likertWrapper.style.fontWeight = "bold";
  likertWrapper.style.color = "#58DE37"
  likertWrapper.style.padding = "5px";
  // likertWrapper.style.marginLeft = "10px"
  likertWrapper.innerHTML = `
  <p>Strongly Disagree</p>
       <input style="width:18px;height:18px;" id="likert-1"  type="radio" name="likert" value="1" />
       <input style="width:18px;height:18px" id="likert-2"  type="radio" name="likert" value="2" />
       <input style="width:18px;height:18px" id="likert-3"  type="radio" name="likert" value="3" />
       <input style="width:18px;height:18px" id="likert-4"  type="radio" name="likert" value="4" />
       <input style="width:18px;height:18px" id="likert-5"  type="radio" name="likert" value="5" />
       <p>Strongly Agree</p>
  `
  modalContent.appendChild(likertWrapper)
}



//SIGN UP FORM LOGIC
function isValidEmail(inputId){
  const inputEmail = document.querySelector("#" + inputId);
  var email = inputEmail.value;
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

function isStrongPassword(inputId){
  const inputPassword = document.querySelector("#" + inputId);
  var password = inputPassword.value;
  if(password.length >= 6){
    return true
  }else{
    return false
  }
}

function isInvalidPassword(inputId){
  const inputPassword = document.querySelector("#" + inputId);
  var password = inputPassword.value;
  if(password.includes(" ")){
    return false
  }else{
    return true
  }
}

function isMatchingPassword(inputId1, inputId2){
  const inputPassword1 = document.querySelector("#" + inputId1);
  var password1 = inputPassword1.value;

  const inputPassword2 = document.querySelector("#" + inputId2);
  var password2 = inputPassword2.value;
  
  if(password1 == password2){
    return true
  }else{
    return false
  }
}



//MODAL SCREENS
function createSignUpPage() {
  clearModal();
  hideInputErrorMessage();
  spawnModal();
  addModalTitle("autocomplete",true)
  addModalText("Welcome!","We can't wait to see how autocomplete helps you write! \n To continue please sign up or login.")
  addModalInputField("Email","text","220px","10px","autocomplete-singup-email");
  addModalInputField("Password","password","220px","10px","autocomplete-singup-password");
  addModalInputField("Confirm Password","password","220px","5px","autocomplete-singup-password-confirm");
  // addModalInputField("Invite Code (Optional)","text","220px","20px","autocomplete-signup-invitedFrom");
  addInputErrorMessage();
  addModalButton("Sign up","textButton","120px",function(){
    if(!isValidEmail("autocomplete-singup-email")){
      setInputErrorMessageVisible("*Invalid email address*")
      return
    }

    if(!isInvalidPassword("autocomplete-singup-password")){
      setInputErrorMessageVisible("*Password cannot contain spaces*")
      return
    }

    if(!isStrongPassword("autocomplete-singup-password")){
      setInputErrorMessageVisible("*Password must be longer than 6 characters*")
      return
    }

    if(!isMatchingPassword("autocomplete-singup-password","autocomplete-singup-password-confirm")){
      setInputErrorMessageVisible("*Passwords do not match*")
      return
    }

    hideInputErrorMessage();

    var email = document.querySelector("#autocomplete-singup-email").value;
    var password = document.querySelector("#autocomplete-singup-password").value;
    // var invitedFrom = document.querySelector("#autocomplete-signup-invitedFrom").value;

    chrome.runtime.sendMessage({
      type: 'auth:accountCreated',
      email: email,
      password: password,
      invitedFrom: ""
    })
  })
  addModalButton("I have an account","backButton","110px",function(){createLoginPage()})
}

function createLoginPage() {
  clearModal();
  hideInputErrorMessage();
  spawnModal();
  addModalTitle("autocomplete Log In",true)
  addModalText("What will you write today?","Log in and find out!")
  addModalInputField("Email","text","220px","10px","autocomplete-singup-email");
  addModalInputField("Password","password","220px","10px","autocomplete-singup-password");
  addInputErrorMessage();
  addModalButton("Log In","textButton","80px",function(){
    if(!isValidEmail("autocomplete-singup-email")){
      setInputErrorMessageVisible("*Invalid email address*")
      return
    }

    var email = document.querySelector("#autocomplete-singup-email").value;
    var password = document.querySelector("#autocomplete-singup-password").value;

    if(password.length == 0){
      setInputErrorMessageVisible("*Please enter your password*")
      return
    }

    chrome.runtime.sendMessage({
      type: 'auth:logIn',
      email: email,
      password: password
    })
  })
  addModalButton("Forgot Password","backButton","110px",function(){
    var email = document.querySelector("#autocomplete-singup-email").value;

    chrome.runtime.sendMessage({
      type: 'auth:forgotPassword',
      email: email
    })
  },"special")
  addModalButton("Sign up Instead","backButton","110px",function(){createSignUpPage()})
}

function createReportBugModal() {
  clearModal();
  hideInputErrorMessage();
  spawnModal("400px","320px");
  addModalTitle("Report a Bug",false)
  addModalText("autocomplete@gmail.com","We are so sorry you experienced an issue with autocomplete! Please let us know about it at the email above so we can fix it, if you have issues with your account or plans you can let us know there too!")
  addModalButton("Close","textButton","120px",function(){
    hideModal()
  })
}

function createBetaTesterPage() {
  clearModal();
  hideInputErrorMessage();
  spawnModal("400px","320px");
  addModalTitle("Become a Beta Tester",false)
  addModalText("We want to learn from you!","Want to test out future improvements or ideas of autocomplete? Willing to be invited to chats so we can learn more about writers? If so we would greatly appreciate it!")
  addInputErrorMessage();
  addModalButton("Become a Beta Tester","textButton","160px",function(){
    setInputErrorMessageVisible("*Account added to beta tester list, keep an eye out for future testing/research opportunity emails!*")
    chrome.runtime.sendMessage({
      type: 'add:betaTester',
    })
  })
  addModalButton("Close","backButton","120px",function(){
    hideModal()
  })
}


function createAutoFeedbackPrompt(type) {
  clearModal();
  hideInputErrorMessage();
  spawnModal("400px","420px");
  addModalTitle("⚡ 10 more free prompts! ⚡",false)
  addModalText(type,"Please rate your agreement with this statement for 10 more free prompts today!")
  addLikertScaleInput();
  // addModalInputField("Additional comments (OPTIONAL)","text","220px","0px","autocomplete-additional-comments");
  addInputErrorMessage();
  addModalButton("Submit","textButton","80px",function(){
    var value;
    for(var i = 1; i < 6; i++){
      var selected = document.querySelector("#likert-"+i)
      // console.log("#likert-"+i)
      if(selected.checked){
        value = i;
        break
      }
    }

    if(value == undefined){
      setInputErrorMessageVisible("*Please rate your agreement*")
      return
    }
    // var comments = document.querySelector("#autocomplete-additional-comments")

    setInputErrorMessageVisible("*Thank You!*")
    chrome.runtime.sendMessage({
      type: 'auto:feedback',
      score: value,
      ratingType: type,
      comments: ""
    })
    hideModal()
  })
  addModalButton("Close","backButton","90px",function(){hideModal()})
}

function createUpgradeInitialScreen(){
  clearModal();
  hideInputErrorMessage();
  spawnModal();
  addModalTitle("Upgrade ⚡",true);
  addModalText("Never get stuck again!","Upgrade to the Premium plan of autocomplete to increase the daily prompt limit. All prices in $USD. Perfect for those who write alot every day (that's you!)");
  const plans = document.createElement('div');
  plans.style.display = "flex";
  plans.style.fontFamily = "Roboto";
  plans.style.width = "280px";
  plans.style.marginLeft = "auto";
  plans.style.marginRight = "auto";
  plans.innerHTML = `
  <div style="text-align:center; padding:15px; padding-right:20px; padding-top:0px; color:#484848">
	<p style="font-size:22px;font-weight:bold">Basic</p>
    <p style="margin-top:-5px; color: #9E9E9E">20 daily prompts</p>
    <p style="color:#9E9E9E">Free</p>
  </div>

  <div style="text-align:center; padding:15px; padding-left:20px; padding-top:0px; color:#58DE37">
    <p style="font-size:22px;font-weight:bold">Premium</p>
      <p style="margin-top:-5px">100 daily prompts</p>
      <p>$8.99/month</p>
  </div>
  `;
  modalContent.appendChild(plans)
  addModalButton("Upgrade!","textButton","80px",function(){
    hideModal()
  })
  addModalButton("Cancel","backButton","90px",function(){
    hideModal()
  })
}

function createOnboardingPageOne() {
  clearModal();
  hideInputErrorMessage();
  spawnModal("700px","600px");
  addModalTitle("*Important* autocomplete Guide",false)

  const onboardingImg = document.createElement('iframe');
  onboardingImg.style.borderRadius = "5px";
  // onboardingImg.style.boxShadow = "10px 10px 36px -7px rgba(135,119,217,1)";
  onboardingImg.setAttribute("width","100%")
  onboardingImg.setAttribute("height","70%")
  onboardingImg.setAttribute("alt","autocomplete Auto-Prompt Gif")
  onboardingImg.setAttribute("src","https://www.youtube.com/embed/Ybiletl3y6g")

  modalContent.appendChild(onboardingImg)
  addModalButton("Start Writing!","textButton","200px",function(){
    hideModal();
    isFirstLogin = false;
  })
}


//MODAL SCREENS
function createLinkGoogleModal() {
  clearModal();
  hideInputErrorMessage();
  spawnModal();
  addModalTitle("Link Google Account",false)
  addModalText("To use autocomplete with Google Docs you must link your Google Acount.","")
  
  const googleButton = document.createElement('button');
  googleButton.setAttribute("type","button")
  googleButton.style.marginTop = "70px"
  googleButton.style.padding = "12px 16px 12px 42px"
  googleButton.style.border = "none"
  googleButton.style.borderRadius = "3px"
  googleButton.style.boxShadow = "0px 2px 5px 1px rgba(0,0,0,0.38)"
  googleButton.style.color = "#757575"
  googleButton.style.fontSize = "14px"
  googleButton.style.fontWeight = "500"
  googleButton.style.fontFamily = "Roboto"
  googleButton.style.backgroundImage = "url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4=)"
  googleButton.style.backgroundColor = "white"
  googleButton.style.backgroundRepeat = "no-repeat"
  googleButton.style.backgroundPosition = "12px 11px"
  googleButton.innerText = "Link Google Account"

  googleButton.onmouseover = function() {
    googleButton.style.cursor='pointer'
    googleButton.style.boxShadow = "0px 2px 5px 1px rgba(0,0,0,0.68)"
  }
  googleButton.onmouseleave = function() {
    googleButton.style.cursor='auto'
    googleButton.style.boxShadow = "0px 2px 5px 1px rgba(0,0,0,0.38)"
  }
  googleButton.onclick = function() {
    setInputErrorMessageVisible("*Linking...*")
    chrome.runtime.sendMessage({
      type: 'link:google',
      INSTANCE_ID: INSTANCE_ID,
    })
    setTimeout(function(){
      createOnboardingPageOne()
    },8000)
  }

  modalContent.appendChild(googleButton)
  addInputErrorMessage();
}


// CREATING autocomplete SIDEBAR
const autocompleteSidebar = document.createElement('div');
autocompleteSidebar.setAttribute("id","autocomplete-sidebar")
autocompleteSidebar.setAttribute("class","docs-companion-sidebar")
autocompleteSidebar.setAttribute("role","complementary")
autocompleteSidebar.setAttribute("roledescription","sidebar")
autocompleteSidebar.style.top='0px';
autocompleteSidebar.style.height='100%';
autocompleteSidebar.style.overflowY='scroll';
autocompleteSidebar.style.right='0px';
autocompleteSidebar.style.backgroundColor='white';

const autocompleteSidebarTitle = document.createElement('div');
autocompleteSidebarTitle.setAttribute("id","autocomplete-sidebar-title")
autocompleteSidebarTitle.style.display="flex";
autocompleteSidebarTitle.style.alignItems="center"
autocompleteSidebarTitle.style.padding='20px';
autocompleteSidebarTitle.style.paddingBottom='0px';
autocompleteSidebarTitle.innerHTML= `
<svg width="28" height="28" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M16.943 20.9112L30.179 11.703L32.1938 13.9168L21.7832 26.2296L16.943 20.9112ZM12.9624 21.6136L20.7102 30.1267C20.8706 30.2856 21.0629 30.4086 21.2744 30.4877C21.4858 30.5667 21.7117 30.6 21.937 30.5854C22.1623 30.5707 22.3819 30.5084 22.5813 30.4025C22.7807 30.2967 22.9554 30.1497 23.0939 29.9714L35.8233 14.9159C36.0769 14.6372 36.2205 14.2758 36.2272 13.8991C36.2339 13.5224 36.1033 13.1561 35.8597 12.8686L31.5667 8.15165C31.3033 7.88221 30.9509 7.71779 30.5753 7.68908C30.1996 7.66038 29.8263 7.76934 29.5251 7.99565L13.3409 19.255C13.1503 19.376 12.9876 19.5362 12.8635 19.7248C12.7394 19.9134 12.6567 20.1262 12.6209 20.3491C12.5851 20.572 12.5971 20.8 12.6559 21.018C12.7148 21.236 12.8192 21.439 12.9624 21.6136V21.6136ZM4.77344 31.6513L14.3698 33.3123L16.8966 31.0125L11.7223 25.3272L4.77344 31.6513Z" fill="#58DE37"/>
</svg>
<p style="display: flex; font-size: 22px; font-family: Roboto; color: #58DE37;">InspoGen</p>
`;

autocompleteSidebar.appendChild(autocompleteSidebarTitle);

const autocompleteSidebarCloseButton = document.createElement('div');
autocompleteSidebarCloseButton.style.marginLeft='auto'
autocompleteSidebarCloseButton.innerHTML=`
<svg style="margin-top: 10px; margin-right: 5px;" width="13" height="13" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6.10086 8.5002L0.158247 14.8138C-0.0527363 15.038 -0.0527363 15.4009 0.158247 15.625L1.29397 16.8321C1.39512 16.9395 1.53238 17 1.67566 17C1.81896 17 1.95623 16.9395 2.05738 16.8321L7.99999 10.518L13.9426 16.8321C14.0438 16.9395 14.181 17 14.3243 17C14.4676 17 14.6049 16.9395 14.706 16.8321L15.8417 15.625C16.0528 15.4009 16.0528 15.038 15.8417 14.8138L9.89912 8.50016L15.8411 2.18728C16.0521 1.96307 16.0521 1.60026 15.8411 1.37612L14.7054 0.168976C14.6043 0.0615768 14.467 0.00110626 14.3237 0.00110626C14.1804 0.00110626 14.0431 0.0615768 13.9419 0.168976L8.00003 6.48234L2.05811 0.168976C1.95695 0.0615768 1.81969 0.00110626 1.67638 0.00110626C1.53304 0.00110626 1.39578 0.0615768 1.2947 0.168976L0.158906 1.37612C-0.0520077 1.60026 -0.0520077 1.96307 0.158906 2.18728L6.10086 8.5002Z" fill="#58DE37"/>
</svg>
`
autocompleteSidebarCloseButton.onmouseover = function() {
  autocompleteSidebarCloseButton.style.cursor='pointer'
}
autocompleteSidebarCloseButton.onmouseleave = function() {
  autocompleteSidebarCloseButton.style.cursor='auto'
}
autocompleteSidebarCloseButton.onclick = function() {
  setChromeStorageValues(["promptExists"],[false]);
}

autocompleteSidebarTitle.appendChild(autocompleteSidebarCloseButton);





// CREATING autocomplete SIDEBAR MENUE
const autocompleteSidebarMenueNavigation = document.createElement('div');
autocompleteSidebarMenueNavigation.setAttribute("id","autocomplete-sidebar-menue")
autocompleteSidebarMenueNavigation.style.display="flex";
autocompleteSidebarMenueNavigation.style.alignItems="center"
autocompleteSidebarMenueNavigation.style.margin='20px';
autocompleteSidebarMenueNavigation.style.marginTop='0px';
autocompleteSidebarMenueNavigation.style.borderBottom = "1px solid #D2D0DC"
autocompleteSidebarMenueNavigation.style.display = "none"

const autocompleteSidebarMenueNavigationIdeaBounce = document.createElement('div');
autocompleteSidebarMenueNavigationIdeaBounce.setAttribute("id","autocomplete-sidebar-menue-ideabounce")
autocompleteSidebarMenueNavigationIdeaBounce.style.borderBottom = "2px solid #58DE37"
autocompleteSidebarMenueNavigationIdeaBounce.style.marginRight = "10px"
autocompleteSidebarMenueNavigationIdeaBounce.innerHTML=`
<p style="font-family: Roboto; color: #58DE37;"> <b>Idea Bounce</b></p>
`

autocompleteSidebarMenueNavigationIdeaBounce.onmouseover = function() {
  autocompleteSidebarMenueNavigationIdeaBounce.style.cursor='pointer'
}
autocompleteSidebarMenueNavigationIdeaBounce.onmouseleave = function() {
  autocompleteSidebarMenueNavigationIdeaBounce.style.cursor='auto'
}

const autocompleteSidebarMenueNavigationOptions = document.createElement('div');
autocompleteSidebarMenueNavigationOptions.setAttribute("id","autocomplete-sidebar-menue-options")
autocompleteSidebarMenueNavigationOptions.style.marginLeft = 'auto'
autocompleteSidebarMenueNavigationOptions.style.marginTop = 'auto'
autocompleteSidebarMenueNavigationOptions.style.paddingBottom = '8px'
autocompleteSidebarMenueNavigationOptions.innerHTML=`
<svg style="margin-top: 5px;" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.3915 17.8807H7.58587C7.01941 17.8807 6.55846 17.4197 6.55846 16.8533V16.4356C6.55846 16.3706 6.52072 16.3103 6.46876 16.2923C6.17595 16.1914 5.88492 16.0706 5.60436 15.9335C5.55575 15.9102 5.49055 15.9244 5.4459 15.9691L5.14637 16.2686C4.95255 16.4626 4.69431 16.5695 4.41988 16.5695C4.14544 16.5695 3.8874 16.4626 3.69338 16.2684L1.70989 14.2845C1.3094 13.8841 1.3094 13.2322 1.70989 12.8316L2.00942 12.532C2.05348 12.488 2.0685 12.4214 2.04518 12.374C1.90787 12.0928 1.78695 11.802 1.68599 11.5092C1.66781 11.4574 1.60775 11.4199 1.54274 11.4199H1.12506C0.558606 11.4199 0.0976562 10.9589 0.0976562 10.3925V7.58684C0.0976562 7.02039 0.558606 6.55944 1.12506 6.55944H1.54294C1.60794 6.55944 1.66801 6.5219 1.68599 6.46974C1.78734 6.17673 1.90806 5.8857 2.04499 5.60553C2.0687 5.55693 2.05407 5.49172 2.00922 5.44707L1.70989 5.14774C1.3094 4.74705 1.3094 4.09524 1.70989 3.69475L3.69378 1.71067C3.8878 1.51665 4.14583 1.40996 4.42027 1.40996C4.69471 1.40996 4.95274 1.51685 5.14677 1.71067L5.44629 2.0104C5.49055 2.05446 5.55674 2.06967 5.60455 2.04596C5.88472 1.90904 6.17575 1.78812 6.46896 1.68677C6.52092 1.66879 6.55846 1.60872 6.55846 1.54372V1.12604C6.55846 0.559583 7.01941 0.0986328 7.58587 0.0986328H10.3915C10.9579 0.0986328 11.4189 0.559583 11.4189 1.12604V1.54392C11.4189 1.60892 11.4564 1.66898 11.5084 1.68696C11.8012 1.78812 12.092 1.90904 12.3728 2.04616C12.4216 2.06947 12.4864 2.05505 12.5312 2.0104L12.8308 1.71087C13.2313 1.31038 13.8831 1.31038 14.2838 1.71087L16.2674 3.69455C16.6679 4.09524 16.6679 4.74705 16.2674 5.14754L15.9679 5.44707C15.9231 5.49192 15.9084 5.55693 15.9322 5.60553C16.0695 5.88609 16.1904 6.17712 16.2914 6.47013C16.3091 6.5219 16.3694 6.55944 16.4344 6.55944H16.8523C17.4187 6.55944 17.8797 7.02039 17.8797 7.58684V10.3925C17.8797 10.9589 17.4187 11.4199 16.8523 11.4199H16.4346C16.3696 11.4199 16.3093 11.4574 16.2914 11.5096C16.1906 11.8016 16.0699 12.0924 15.9328 12.3736C15.9092 12.4218 15.9241 12.4882 15.9681 12.5322L16.2676 12.8318C16.6681 13.2322 16.6681 13.8841 16.2676 14.2847L14.2836 16.2684C14.0895 16.4624 13.8315 16.5693 13.5571 16.5693C13.2824 16.5693 13.0244 16.4622 12.8304 16.268L12.5312 15.9691C12.4862 15.9244 12.4212 15.9094 12.3726 15.9331C12.092 16.0705 11.801 16.1914 11.508 16.2923C11.4562 16.3101 11.4187 16.3704 11.4187 16.4354V16.8533C11.4189 17.4197 10.9579 17.8807 10.3915 17.8807ZM7.94151 16.4976H10.0358V16.4356C10.0358 15.7792 10.446 15.1964 11.0567 14.9854C11.297 14.9024 11.5353 14.8034 11.7656 14.6908C12.3457 14.4074 13.0461 14.5284 13.5091 14.9913L13.5571 15.0391L15.0379 13.5582L14.9901 13.5102C14.5268 13.0471 14.4063 12.3463 14.69 11.7666C14.8024 11.5362 14.9014 11.2978 14.984 11.0583C15.195 10.4472 15.778 10.037 16.4344 10.037H16.4966V7.94248H16.4346C15.7782 7.94248 15.1954 7.53231 14.9844 6.9216C14.9014 6.68134 14.8024 6.44306 14.6898 6.21269C14.4065 5.6326 14.5272 4.93199 14.9903 4.46906L15.0381 4.42105L13.5573 2.9402L13.5093 2.98821C13.0461 3.45134 12.3455 3.57166 11.7658 3.28853C11.5355 3.17591 11.297 3.07693 11.0571 2.99394C10.4464 2.78313 10.036 2.20027 10.036 1.54372V1.48168H7.94151V1.54372C7.94151 2.20027 7.53114 2.78293 6.92042 2.99394C6.67997 3.07693 6.44149 3.17611 6.21171 3.28853C5.63162 3.57186 4.93121 3.45114 4.46808 2.98821L4.42007 2.9402L2.93922 4.42105L2.98724 4.46906C3.45016 4.93218 3.57088 5.6328 3.28755 6.21269C3.17533 6.44247 3.07615 6.68095 2.99316 6.9214C2.78215 7.53231 2.19929 7.94248 1.54294 7.94248H1.4807V10.0368H1.54274C2.19929 10.0368 2.78195 10.4472 2.99297 11.0579C3.07575 11.2978 3.17494 11.5362 3.28755 11.7668C3.57108 12.3463 3.45036 13.0469 2.98724 13.51L2.93922 13.558L4.42027 15.0389L4.46808 14.9911C4.93121 14.5276 5.63202 14.4074 6.21191 14.6908C6.44189 14.803 6.68017 14.9022 6.92023 14.985C7.53114 15.196 7.94131 15.779 7.94131 16.4354V16.4976H7.94151ZM8.9942 14.0085C7.66292 14.0085 6.38538 13.4846 5.43958 12.5387C4.39933 11.4985 3.86942 10.057 3.9856 8.58402C4.17725 6.1546 6.15382 4.17803 8.58324 3.98638C10.0566 3.8702 11.4977 4.4003 12.538 5.44035C13.5782 6.4808 14.1081 7.92213 13.9921 9.39528C13.8003 11.8249 11.8237 13.8013 9.3943 13.9929C9.26054 14.0034 9.12717 14.0085 8.9942 14.0085ZM8.98255 5.35382C8.88593 5.35382 8.78912 5.35777 8.69191 5.36527C6.93366 5.50397 5.503 6.93464 5.3643 8.69308C5.27993 9.76198 5.66383 10.8072 6.41759 11.5609C7.17135 12.3147 8.21555 12.6992 9.28563 12.6142C11.0439 12.4757 12.4747 11.0453 12.6134 9.28661C12.6978 8.21771 12.3137 7.17232 11.5602 6.41856C10.8748 5.73336 9.94831 5.35382 8.98255 5.35382Z" fill="#D2D0DC"/>
</svg>
`
autocompleteSidebarMenueNavigationOptions.onmouseover = function() {
  autocompleteSidebarMenueNavigationOptions.style.cursor='pointer'
}
autocompleteSidebarMenueNavigationOptions.onmouseleave = function() {
  autocompleteSidebarMenueNavigationOptions.style.cursor='auto'
}

// GOALS FEATURE MENUE START
const autocompleteSidebarMenueNavigationGoals = document.createElement('div');
autocompleteSidebarMenueNavigationGoals.setAttribute("id","autocomplete-sidebar-menue-goals")
autocompleteSidebarMenueNavigationGoals.style.borderBottom = ""
autocompleteSidebarMenueNavigationGoals.style.marginRight = "10px"
autocompleteSidebarMenueNavigationGoals.innerHTML=`
<p style="font-family: Roboto; color: #D2D0DC;"> <b>Goals</b></p>
`

autocompleteSidebarMenueNavigationGoals.onmouseover = function() {
  autocompleteSidebarMenueNavigationGoals.style.cursor='pointer'
}
autocompleteSidebarMenueNavigationGoals.onmouseleave = function() {
  autocompleteSidebarMenueNavigationGoals.style.cursor='auto'
}

autocompleteSidebarMenueNavigationIdeaBounce.onclick = function() {
  getChromeStorageValues(['menuItemSelected'], function(result) {
    if(result.menuItemSelected == "ideaBounce"){
      return
    }
    autocompleteSidebarMenueNavigationIdeaBounce.style.borderBottom = "2px solid #58DE37"
    autocompleteSidebarMenueNavigationIdeaBounce.innerHTML=`
    <p style="font-family: Roboto; color: #58DE37;"> <b>Idea Bounce</b></p>
    `

    autocompleteSidebarMenueNavigationOptions.innerHTML=`
    <svg style="margin-top: 5px;" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.3915 17.8807H7.58587C7.01941 17.8807 6.55846 17.4197 6.55846 16.8533V16.4356C6.55846 16.3706 6.52072 16.3103 6.46876 16.2923C6.17595 16.1914 5.88492 16.0706 5.60436 15.9335C5.55575 15.9102 5.49055 15.9244 5.4459 15.9691L5.14637 16.2686C4.95255 16.4626 4.69431 16.5695 4.41988 16.5695C4.14544 16.5695 3.8874 16.4626 3.69338 16.2684L1.70989 14.2845C1.3094 13.8841 1.3094 13.2322 1.70989 12.8316L2.00942 12.532C2.05348 12.488 2.0685 12.4214 2.04518 12.374C1.90787 12.0928 1.78695 11.802 1.68599 11.5092C1.66781 11.4574 1.60775 11.4199 1.54274 11.4199H1.12506C0.558606 11.4199 0.0976562 10.9589 0.0976562 10.3925V7.58684C0.0976562 7.02039 0.558606 6.55944 1.12506 6.55944H1.54294C1.60794 6.55944 1.66801 6.5219 1.68599 6.46974C1.78734 6.17673 1.90806 5.8857 2.04499 5.60553C2.0687 5.55693 2.05407 5.49172 2.00922 5.44707L1.70989 5.14774C1.3094 4.74705 1.3094 4.09524 1.70989 3.69475L3.69378 1.71067C3.8878 1.51665 4.14583 1.40996 4.42027 1.40996C4.69471 1.40996 4.95274 1.51685 5.14677 1.71067L5.44629 2.0104C5.49055 2.05446 5.55674 2.06967 5.60455 2.04596C5.88472 1.90904 6.17575 1.78812 6.46896 1.68677C6.52092 1.66879 6.55846 1.60872 6.55846 1.54372V1.12604C6.55846 0.559583 7.01941 0.0986328 7.58587 0.0986328H10.3915C10.9579 0.0986328 11.4189 0.559583 11.4189 1.12604V1.54392C11.4189 1.60892 11.4564 1.66898 11.5084 1.68696C11.8012 1.78812 12.092 1.90904 12.3728 2.04616C12.4216 2.06947 12.4864 2.05505 12.5312 2.0104L12.8308 1.71087C13.2313 1.31038 13.8831 1.31038 14.2838 1.71087L16.2674 3.69455C16.6679 4.09524 16.6679 4.74705 16.2674 5.14754L15.9679 5.44707C15.9231 5.49192 15.9084 5.55693 15.9322 5.60553C16.0695 5.88609 16.1904 6.17712 16.2914 6.47013C16.3091 6.5219 16.3694 6.55944 16.4344 6.55944H16.8523C17.4187 6.55944 17.8797 7.02039 17.8797 7.58684V10.3925C17.8797 10.9589 17.4187 11.4199 16.8523 11.4199H16.4346C16.3696 11.4199 16.3093 11.4574 16.2914 11.5096C16.1906 11.8016 16.0699 12.0924 15.9328 12.3736C15.9092 12.4218 15.9241 12.4882 15.9681 12.5322L16.2676 12.8318C16.6681 13.2322 16.6681 13.8841 16.2676 14.2847L14.2836 16.2684C14.0895 16.4624 13.8315 16.5693 13.5571 16.5693C13.2824 16.5693 13.0244 16.4622 12.8304 16.268L12.5312 15.9691C12.4862 15.9244 12.4212 15.9094 12.3726 15.9331C12.092 16.0705 11.801 16.1914 11.508 16.2923C11.4562 16.3101 11.4187 16.3704 11.4187 16.4354V16.8533C11.4189 17.4197 10.9579 17.8807 10.3915 17.8807ZM7.94151 16.4976H10.0358V16.4356C10.0358 15.7792 10.446 15.1964 11.0567 14.9854C11.297 14.9024 11.5353 14.8034 11.7656 14.6908C12.3457 14.4074 13.0461 14.5284 13.5091 14.9913L13.5571 15.0391L15.0379 13.5582L14.9901 13.5102C14.5268 13.0471 14.4063 12.3463 14.69 11.7666C14.8024 11.5362 14.9014 11.2978 14.984 11.0583C15.195 10.4472 15.778 10.037 16.4344 10.037H16.4966V7.94248H16.4346C15.7782 7.94248 15.1954 7.53231 14.9844 6.9216C14.9014 6.68134 14.8024 6.44306 14.6898 6.21269C14.4065 5.6326 14.5272 4.93199 14.9903 4.46906L15.0381 4.42105L13.5573 2.9402L13.5093 2.98821C13.0461 3.45134 12.3455 3.57166 11.7658 3.28853C11.5355 3.17591 11.297 3.07693 11.0571 2.99394C10.4464 2.78313 10.036 2.20027 10.036 1.54372V1.48168H7.94151V1.54372C7.94151 2.20027 7.53114 2.78293 6.92042 2.99394C6.67997 3.07693 6.44149 3.17611 6.21171 3.28853C5.63162 3.57186 4.93121 3.45114 4.46808 2.98821L4.42007 2.9402L2.93922 4.42105L2.98724 4.46906C3.45016 4.93218 3.57088 5.6328 3.28755 6.21269C3.17533 6.44247 3.07615 6.68095 2.99316 6.9214C2.78215 7.53231 2.19929 7.94248 1.54294 7.94248H1.4807V10.0368H1.54274C2.19929 10.0368 2.78195 10.4472 2.99297 11.0579C3.07575 11.2978 3.17494 11.5362 3.28755 11.7668C3.57108 12.3463 3.45036 13.0469 2.98724 13.51L2.93922 13.558L4.42027 15.0389L4.46808 14.9911C4.93121 14.5276 5.63202 14.4074 6.21191 14.6908C6.44189 14.803 6.68017 14.9022 6.92023 14.985C7.53114 15.196 7.94131 15.779 7.94131 16.4354V16.4976H7.94151ZM8.9942 14.0085C7.66292 14.0085 6.38538 13.4846 5.43958 12.5387C4.39933 11.4985 3.86942 10.057 3.9856 8.58402C4.17725 6.1546 6.15382 4.17803 8.58324 3.98638C10.0566 3.8702 11.4977 4.4003 12.538 5.44035C13.5782 6.4808 14.1081 7.92213 13.9921 9.39528C13.8003 11.8249 11.8237 13.8013 9.3943 13.9929C9.26054 14.0034 9.12717 14.0085 8.9942 14.0085ZM8.98255 5.35382C8.88593 5.35382 8.78912 5.35777 8.69191 5.36527C6.93366 5.50397 5.503 6.93464 5.3643 8.69308C5.27993 9.76198 5.66383 10.8072 6.41759 11.5609C7.17135 12.3147 8.21555 12.6992 9.28563 12.6142C11.0439 12.4757 12.4747 11.0453 12.6134 9.28661C12.6978 8.21771 12.3137 7.17232 11.5602 6.41856C10.8748 5.73336 9.94831 5.35382 8.98255 5.35382Z" fill="#D2D0DC"/>
    </svg>
    `
    autocompleteSidebarMenueNavigationOptions.style.borderBottom = ""

    autocompleteSidebarMenueNavigationGoals.style.borderBottom = ""
    autocompleteSidebarMenueNavigationGoals.innerHTML=`
    <p style="font-family: Roboto; color: #D2D0DC;"> <b>Goals</b></p>
    `
    setChromeStorageValues(['menuItemSelected'],['ideaBounce']);
  })
}

autocompleteSidebarMenueNavigationOptions.onclick = function() {
  getChromeStorageValues(['menuItemSelected'], function(result) {
    if(result.menuItemSelected == "options"){
      return
    }
    autocompleteSidebarMenueNavigationIdeaBounce.style.borderBottom = ""
    autocompleteSidebarMenueNavigationIdeaBounce.innerHTML=`
    <p style="font-family: Roboto; color: #D2D0DC;"> Idea Bounce</p>
    `

    autocompleteSidebarMenueNavigationOptions.innerHTML=`
    <svg style="margin-top: 5px;" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.3915 17.8807H7.58587C7.01941 17.8807 6.55846 17.4197 6.55846 16.8533V16.4356C6.55846 16.3706 6.52072 16.3103 6.46876 16.2923C6.17595 16.1914 5.88492 16.0706 5.60436 15.9335C5.55575 15.9102 5.49055 15.9244 5.4459 15.9691L5.14637 16.2686C4.95255 16.4626 4.69431 16.5695 4.41988 16.5695C4.14544 16.5695 3.8874 16.4626 3.69338 16.2684L1.70989 14.2845C1.3094 13.8841 1.3094 13.2322 1.70989 12.8316L2.00942 12.532C2.05348 12.488 2.0685 12.4214 2.04518 12.374C1.90787 12.0928 1.78695 11.802 1.68599 11.5092C1.66781 11.4574 1.60775 11.4199 1.54274 11.4199H1.12506C0.558606 11.4199 0.0976562 10.9589 0.0976562 10.3925V7.58684C0.0976562 7.02039 0.558606 6.55944 1.12506 6.55944H1.54294C1.60794 6.55944 1.66801 6.5219 1.68599 6.46974C1.78734 6.17673 1.90806 5.8857 2.04499 5.60553C2.0687 5.55693 2.05407 5.49172 2.00922 5.44707L1.70989 5.14774C1.3094 4.74705 1.3094 4.09524 1.70989 3.69475L3.69378 1.71067C3.8878 1.51665 4.14583 1.40996 4.42027 1.40996C4.69471 1.40996 4.95274 1.51685 5.14677 1.71067L5.44629 2.0104C5.49055 2.05446 5.55674 2.06967 5.60455 2.04596C5.88472 1.90904 6.17575 1.78812 6.46896 1.68677C6.52092 1.66879 6.55846 1.60872 6.55846 1.54372V1.12604C6.55846 0.559583 7.01941 0.0986328 7.58587 0.0986328H10.3915C10.9579 0.0986328 11.4189 0.559583 11.4189 1.12604V1.54392C11.4189 1.60892 11.4564 1.66898 11.5084 1.68696C11.8012 1.78812 12.092 1.90904 12.3728 2.04616C12.4216 2.06947 12.4864 2.05505 12.5312 2.0104L12.8308 1.71087C13.2313 1.31038 13.8831 1.31038 14.2838 1.71087L16.2674 3.69455C16.6679 4.09524 16.6679 4.74705 16.2674 5.14754L15.9679 5.44707C15.9231 5.49192 15.9084 5.55693 15.9322 5.60553C16.0695 5.88609 16.1904 6.17712 16.2914 6.47013C16.3091 6.5219 16.3694 6.55944 16.4344 6.55944H16.8523C17.4187 6.55944 17.8797 7.02039 17.8797 7.58684V10.3925C17.8797 10.9589 17.4187 11.4199 16.8523 11.4199H16.4346C16.3696 11.4199 16.3093 11.4574 16.2914 11.5096C16.1906 11.8016 16.0699 12.0924 15.9328 12.3736C15.9092 12.4218 15.9241 12.4882 15.9681 12.5322L16.2676 12.8318C16.6681 13.2322 16.6681 13.8841 16.2676 14.2847L14.2836 16.2684C14.0895 16.4624 13.8315 16.5693 13.5571 16.5693C13.2824 16.5693 13.0244 16.4622 12.8304 16.268L12.5312 15.9691C12.4862 15.9244 12.4212 15.9094 12.3726 15.9331C12.092 16.0705 11.801 16.1914 11.508 16.2923C11.4562 16.3101 11.4187 16.3704 11.4187 16.4354V16.8533C11.4189 17.4197 10.9579 17.8807 10.3915 17.8807ZM7.94151 16.4976H10.0358V16.4356C10.0358 15.7792 10.446 15.1964 11.0567 14.9854C11.297 14.9024 11.5353 14.8034 11.7656 14.6908C12.3457 14.4074 13.0461 14.5284 13.5091 14.9913L13.5571 15.0391L15.0379 13.5582L14.9901 13.5102C14.5268 13.0471 14.4063 12.3463 14.69 11.7666C14.8024 11.5362 14.9014 11.2978 14.984 11.0583C15.195 10.4472 15.778 10.037 16.4344 10.037H16.4966V7.94248H16.4346C15.7782 7.94248 15.1954 7.53231 14.9844 6.9216C14.9014 6.68134 14.8024 6.44306 14.6898 6.21269C14.4065 5.6326 14.5272 4.93199 14.9903 4.46906L15.0381 4.42105L13.5573 2.9402L13.5093 2.98821C13.0461 3.45134 12.3455 3.57166 11.7658 3.28853C11.5355 3.17591 11.297 3.07693 11.0571 2.99394C10.4464 2.78313 10.036 2.20027 10.036 1.54372V1.48168H7.94151V1.54372C7.94151 2.20027 7.53114 2.78293 6.92042 2.99394C6.67997 3.07693 6.44149 3.17611 6.21171 3.28853C5.63162 3.57186 4.93121 3.45114 4.46808 2.98821L4.42007 2.9402L2.93922 4.42105L2.98724 4.46906C3.45016 4.93218 3.57088 5.6328 3.28755 6.21269C3.17533 6.44247 3.07615 6.68095 2.99316 6.9214C2.78215 7.53231 2.19929 7.94248 1.54294 7.94248H1.4807V10.0368H1.54274C2.19929 10.0368 2.78195 10.4472 2.99297 11.0579C3.07575 11.2978 3.17494 11.5362 3.28755 11.7668C3.57108 12.3463 3.45036 13.0469 2.98724 13.51L2.93922 13.558L4.42027 15.0389L4.46808 14.9911C4.93121 14.5276 5.63202 14.4074 6.21191 14.6908C6.44189 14.803 6.68017 14.9022 6.92023 14.985C7.53114 15.196 7.94131 15.779 7.94131 16.4354V16.4976H7.94151ZM8.9942 14.0085C7.66292 14.0085 6.38538 13.4846 5.43958 12.5387C4.39933 11.4985 3.86942 10.057 3.9856 8.58402C4.17725 6.1546 6.15382 4.17803 8.58324 3.98638C10.0566 3.8702 11.4977 4.4003 12.538 5.44035C13.5782 6.4808 14.1081 7.92213 13.9921 9.39528C13.8003 11.8249 11.8237 13.8013 9.3943 13.9929C9.26054 14.0034 9.12717 14.0085 8.9942 14.0085ZM8.98255 5.35382C8.88593 5.35382 8.78912 5.35777 8.69191 5.36527C6.93366 5.50397 5.503 6.93464 5.3643 8.69308C5.27993 9.76198 5.66383 10.8072 6.41759 11.5609C7.17135 12.3147 8.21555 12.6992 9.28563 12.6142C11.0439 12.4757 12.4747 11.0453 12.6134 9.28661C12.6978 8.21771 12.3137 7.17232 11.5602 6.41856C10.8748 5.73336 9.94831 5.35382 8.98255 5.35382Z" fill="#58DE37"/>
    </svg>
    `
    autocompleteSidebarMenueNavigationOptions.style.borderBottom = "2px solid #58DE37"

    autocompleteSidebarMenueNavigationGoals.style.borderBottom = ""
    autocompleteSidebarMenueNavigationGoals.innerHTML=`
    <p style="font-family: Roboto; color: #D2D0DC;"> <b>Goals</b></p>
    `
    setChromeStorageValues(['menuItemSelected'],['options']);
  });
}

autocompleteSidebarMenueNavigationGoals.onclick = function() {
  getChromeStorageValues(['menuItemSelected'], function(result) {
    if(result.menuItemSelected == "goals"){
      return
    }
    autocompleteSidebarMenueNavigationIdeaBounce.style.borderBottom = ""
    autocompleteSidebarMenueNavigationIdeaBounce.innerHTML=`
    <p style="font-family: Roboto; color: #D2D0DC;"> Idea Bounce</p>
    `

    autocompleteSidebarMenueNavigationOptions.innerHTML=`
    <svg style="margin-top: 5px;" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.3915 17.8807H7.58587C7.01941 17.8807 6.55846 17.4197 6.55846 16.8533V16.4356C6.55846 16.3706 6.52072 16.3103 6.46876 16.2923C6.17595 16.1914 5.88492 16.0706 5.60436 15.9335C5.55575 15.9102 5.49055 15.9244 5.4459 15.9691L5.14637 16.2686C4.95255 16.4626 4.69431 16.5695 4.41988 16.5695C4.14544 16.5695 3.8874 16.4626 3.69338 16.2684L1.70989 14.2845C1.3094 13.8841 1.3094 13.2322 1.70989 12.8316L2.00942 12.532C2.05348 12.488 2.0685 12.4214 2.04518 12.374C1.90787 12.0928 1.78695 11.802 1.68599 11.5092C1.66781 11.4574 1.60775 11.4199 1.54274 11.4199H1.12506C0.558606 11.4199 0.0976562 10.9589 0.0976562 10.3925V7.58684C0.0976562 7.02039 0.558606 6.55944 1.12506 6.55944H1.54294C1.60794 6.55944 1.66801 6.5219 1.68599 6.46974C1.78734 6.17673 1.90806 5.8857 2.04499 5.60553C2.0687 5.55693 2.05407 5.49172 2.00922 5.44707L1.70989 5.14774C1.3094 4.74705 1.3094 4.09524 1.70989 3.69475L3.69378 1.71067C3.8878 1.51665 4.14583 1.40996 4.42027 1.40996C4.69471 1.40996 4.95274 1.51685 5.14677 1.71067L5.44629 2.0104C5.49055 2.05446 5.55674 2.06967 5.60455 2.04596C5.88472 1.90904 6.17575 1.78812 6.46896 1.68677C6.52092 1.66879 6.55846 1.60872 6.55846 1.54372V1.12604C6.55846 0.559583 7.01941 0.0986328 7.58587 0.0986328H10.3915C10.9579 0.0986328 11.4189 0.559583 11.4189 1.12604V1.54392C11.4189 1.60892 11.4564 1.66898 11.5084 1.68696C11.8012 1.78812 12.092 1.90904 12.3728 2.04616C12.4216 2.06947 12.4864 2.05505 12.5312 2.0104L12.8308 1.71087C13.2313 1.31038 13.8831 1.31038 14.2838 1.71087L16.2674 3.69455C16.6679 4.09524 16.6679 4.74705 16.2674 5.14754L15.9679 5.44707C15.9231 5.49192 15.9084 5.55693 15.9322 5.60553C16.0695 5.88609 16.1904 6.17712 16.2914 6.47013C16.3091 6.5219 16.3694 6.55944 16.4344 6.55944H16.8523C17.4187 6.55944 17.8797 7.02039 17.8797 7.58684V10.3925C17.8797 10.9589 17.4187 11.4199 16.8523 11.4199H16.4346C16.3696 11.4199 16.3093 11.4574 16.2914 11.5096C16.1906 11.8016 16.0699 12.0924 15.9328 12.3736C15.9092 12.4218 15.9241 12.4882 15.9681 12.5322L16.2676 12.8318C16.6681 13.2322 16.6681 13.8841 16.2676 14.2847L14.2836 16.2684C14.0895 16.4624 13.8315 16.5693 13.5571 16.5693C13.2824 16.5693 13.0244 16.4622 12.8304 16.268L12.5312 15.9691C12.4862 15.9244 12.4212 15.9094 12.3726 15.9331C12.092 16.0705 11.801 16.1914 11.508 16.2923C11.4562 16.3101 11.4187 16.3704 11.4187 16.4354V16.8533C11.4189 17.4197 10.9579 17.8807 10.3915 17.8807ZM7.94151 16.4976H10.0358V16.4356C10.0358 15.7792 10.446 15.1964 11.0567 14.9854C11.297 14.9024 11.5353 14.8034 11.7656 14.6908C12.3457 14.4074 13.0461 14.5284 13.5091 14.9913L13.5571 15.0391L15.0379 13.5582L14.9901 13.5102C14.5268 13.0471 14.4063 12.3463 14.69 11.7666C14.8024 11.5362 14.9014 11.2978 14.984 11.0583C15.195 10.4472 15.778 10.037 16.4344 10.037H16.4966V7.94248H16.4346C15.7782 7.94248 15.1954 7.53231 14.9844 6.9216C14.9014 6.68134 14.8024 6.44306 14.6898 6.21269C14.4065 5.6326 14.5272 4.93199 14.9903 4.46906L15.0381 4.42105L13.5573 2.9402L13.5093 2.98821C13.0461 3.45134 12.3455 3.57166 11.7658 3.28853C11.5355 3.17591 11.297 3.07693 11.0571 2.99394C10.4464 2.78313 10.036 2.20027 10.036 1.54372V1.48168H7.94151V1.54372C7.94151 2.20027 7.53114 2.78293 6.92042 2.99394C6.67997 3.07693 6.44149 3.17611 6.21171 3.28853C5.63162 3.57186 4.93121 3.45114 4.46808 2.98821L4.42007 2.9402L2.93922 4.42105L2.98724 4.46906C3.45016 4.93218 3.57088 5.6328 3.28755 6.21269C3.17533 6.44247 3.07615 6.68095 2.99316 6.9214C2.78215 7.53231 2.19929 7.94248 1.54294 7.94248H1.4807V10.0368H1.54274C2.19929 10.0368 2.78195 10.4472 2.99297 11.0579C3.07575 11.2978 3.17494 11.5362 3.28755 11.7668C3.57108 12.3463 3.45036 13.0469 2.98724 13.51L2.93922 13.558L4.42027 15.0389L4.46808 14.9911C4.93121 14.5276 5.63202 14.4074 6.21191 14.6908C6.44189 14.803 6.68017 14.9022 6.92023 14.985C7.53114 15.196 7.94131 15.779 7.94131 16.4354V16.4976H7.94151ZM8.9942 14.0085C7.66292 14.0085 6.38538 13.4846 5.43958 12.5387C4.39933 11.4985 3.86942 10.057 3.9856 8.58402C4.17725 6.1546 6.15382 4.17803 8.58324 3.98638C10.0566 3.8702 11.4977 4.4003 12.538 5.44035C13.5782 6.4808 14.1081 7.92213 13.9921 9.39528C13.8003 11.8249 11.8237 13.8013 9.3943 13.9929C9.26054 14.0034 9.12717 14.0085 8.9942 14.0085ZM8.98255 5.35382C8.88593 5.35382 8.78912 5.35777 8.69191 5.36527C6.93366 5.50397 5.503 6.93464 5.3643 8.69308C5.27993 9.76198 5.66383 10.8072 6.41759 11.5609C7.17135 12.3147 8.21555 12.6992 9.28563 12.6142C11.0439 12.4757 12.4747 11.0453 12.6134 9.28661C12.6978 8.21771 12.3137 7.17232 11.5602 6.41856C10.8748 5.73336 9.94831 5.35382 8.98255 5.35382Z" fill="#D2D0DC"/>
    </svg>
    `
    autocompleteSidebarMenueNavigationOptions.style.borderBottom = ""

    autocompleteSidebarMenueNavigationGoals.style.borderBottom = "2px solid #58DE37"
    autocompleteSidebarMenueNavigationGoals.innerHTML=`
    <p style="font-family: Roboto; color: #58DE37;"> <b>Goals</b></p>
    `

    setChromeStorageValues(['menuItemSelected'],['goals']);
  });
}

autocompleteSidebarMenueNavigation.appendChild(autocompleteSidebarMenueNavigationIdeaBounce)
// autocompleteSidebarMenueNavigation.appendChild(autocompleteSidebarMenueNavigationGoals)
// GOALS FEATURE MENUE END 

autocompleteSidebarMenueNavigation.appendChild(autocompleteSidebarMenueNavigationOptions)
autocompleteSidebar.appendChild(autocompleteSidebarMenueNavigation);



// GOALS FEATURE UI START
const autocompleteSidebarGoals = document.createElement('div');
autocompleteSidebarGoals.setAttribute("id","autocomplete-sidebar-goals-content")
autocompleteSidebarGoals.style.marginLeft='20px';
autocompleteSidebarGoals.style.marginTop='0px';
autocompleteSidebarGoals.style.height='80%';
autocompleteSidebarGoals.style.overflowY='scroll';

const autocompleteSidebarGoalsTodayTitle = document.createElement('p');
autocompleteSidebarGoalsTodayTitle.style.width = '180px';
autocompleteSidebarGoalsTodayTitle.style.paddingBottom = '5px';
autocompleteSidebarGoalsTodayTitle.style.marginBottom = '5px';
autocompleteSidebarGoalsTodayTitle.style.fontFamily = 'Roboto';
autocompleteSidebarGoalsTodayTitle.style.fontSize = '18px';
autocompleteSidebarGoalsTodayTitle.style.color = '#58DE37';
autocompleteSidebarGoalsTodayTitle.style.marginTop = '0px';
autocompleteSidebarGoalsTodayTitle.style.borderBottom = '1px solid #D3D3D3';
autocompleteSidebarGoalsTodayTitle.innerHTML = `
<b>Today's Stats<b/>
`
autocompleteSidebarGoals.appendChild(autocompleteSidebarGoalsTodayTitle);

const autocompleteTodayBox = document.createElement('div');
autocompleteTodayBox.style.borderStyle = 'solid';
autocompleteTodayBox.style.borderWidth = '2px';
autocompleteTodayBox.style.borderColor = '#58DE37';
autocompleteTodayBox.style.marginTop = '10px';
autocompleteTodayBox.style.marginBottom = '30px';
autocompleteTodayBox.style.paddingTop = '10px';
autocompleteTodayBox.style.paddingBottom = '10px';
autocompleteTodayBox.style.borderRadius = '2px';
autocompleteTodayBox.style.fontWeight = 'bold';
autocompleteTodayBox.style.color = '#58DE37';
autocompleteTodayBox.style.fontFamily = 'Roboto';
autocompleteTodayBox.style.fontSize = '14px';
autocompleteTodayBox.style.textAlign = 'center';
autocompleteTodayBox.style.boxShadow = '6px 10px 18px -22px rgba(0,0,0,0.75)';
autocompleteTodayBox.style.width = '95%';
autocompleteTodayBox.innerText = '520 words / 35m';

autocompleteSidebarGoals.appendChild(autocompleteTodayBox);


const autocompleteSidebarGoalsProgressTitle = document.createElement('p');
autocompleteSidebarGoalsProgressTitle.style.width = '180px';
autocompleteSidebarGoalsProgressTitle.style.paddingBottom = '5px';
autocompleteSidebarGoalsProgressTitle.style.marginBottom = '5px';
autocompleteSidebarGoalsProgressTitle.style.fontFamily = 'Roboto';
autocompleteSidebarGoalsProgressTitle.style.fontSize = '18px';
autocompleteSidebarGoalsProgressTitle.style.color = '#58DE37';
autocompleteSidebarGoalsProgressTitle.style.marginTop = '0px';
autocompleteSidebarGoalsProgressTitle.style.borderBottom = '1px solid #D3D3D3';
autocompleteSidebarGoalsProgressTitle.innerHTML = `
<b>Session Stats<b/>
`
autocompleteSidebarGoals.appendChild(autocompleteSidebarGoalsProgressTitle);

const autocompleteSessionChartBox = document.createElement('div');
autocompleteSessionChartBox.style.borderStyle = 'solid';
autocompleteSessionChartBox.style.borderWidth = '2px';
autocompleteSessionChartBox.style.borderColor = '#58DE37';
autocompleteSessionChartBox.style.marginTop = '10px';
autocompleteSessionChartBox.style.marginBottom = '5px';
autocompleteSessionChartBox.style.paddingTop = '10px';
autocompleteSessionChartBox.style.paddingBottom = '10px';
autocompleteSessionChartBox.style.borderRadius = '2px';
autocompleteSessionChartBox.style.color = '#58DE37';
autocompleteSessionChartBox.style.fontFamily = 'Roboto';
autocompleteSessionChartBox.style.fontSize = '12px';
autocompleteSessionChartBox.style.textAlign = 'center';
autocompleteSessionChartBox.style.boxShadow = '6px 10px 18px -22px rgba(0,0,0,0.75)';
autocompleteSessionChartBox.style.width = '95%';
autocompleteSessionChartBox.style.height = '190px';

autocompleteSidebarGoals.appendChild(autocompleteSessionChartBox);

const autocompleteSessionBox = document.createElement('div');
autocompleteSessionBox.style.borderStyle = 'solid';
autocompleteSessionBox.style.borderWidth = '2px';
autocompleteSessionBox.style.borderColor = '#58DE37';
autocompleteSessionBox.style.marginTop = '5px';
autocompleteSessionBox.style.marginBottom = '30px';
autocompleteSessionBox.style.paddingTop = '10px';
autocompleteSessionBox.style.paddingBottom = '10px';
autocompleteSessionBox.style.borderRadius = '2px';
autocompleteSessionBox.style.color = '#58DE37';
autocompleteSessionBox.style.fontFamily = 'Roboto';
autocompleteSessionBox.style.fontSize = '12px';
autocompleteSessionBox.style.textAlign = 'center';
autocompleteSessionBox.style.boxShadow = '6px 10px 18px -22px rgba(0,0,0,0.75)';
autocompleteSessionBox.style.width = '95%';
autocompleteSessionBox.innerText = 'Average Session: 720 words / 40m';

autocompleteSidebarGoals.appendChild(autocompleteSessionBox);



const autocompleteSidebarGoalsWordCountTitle = document.createElement('p');
autocompleteSidebarGoalsWordCountTitle.style.width = '180px';
autocompleteSidebarGoalsWordCountTitle.style.paddingBottom = '5px';
autocompleteSidebarGoalsWordCountTitle.style.marginBottom = '5px';
autocompleteSidebarGoalsWordCountTitle.style.fontFamily = 'Roboto';
autocompleteSidebarGoalsWordCountTitle.style.fontSize = '18px';
autocompleteSidebarGoalsWordCountTitle.style.color = '#58DE37';
autocompleteSidebarGoalsWordCountTitle.style.marginTop = '0px';
autocompleteSidebarGoalsWordCountTitle.style.borderBottom = '1px solid #D3D3D3';
autocompleteSidebarGoalsWordCountTitle.innerHTML = `
<b>Word Count Stats<b/>
`
autocompleteSidebarGoals.appendChild(autocompleteSidebarGoalsWordCountTitle);

const autocompleteWordCountChartBox = document.createElement('div');
autocompleteWordCountChartBox.style.borderStyle = 'solid';
autocompleteWordCountChartBox.style.borderWidth = '2px';
autocompleteWordCountChartBox.style.borderColor = '#58DE37';
autocompleteWordCountChartBox.style.marginTop = '10px';
autocompleteWordCountChartBox.style.marginBottom = '5px';
autocompleteWordCountChartBox.style.paddingTop = '5px';
autocompleteWordCountChartBox.style.paddingBottom = '5px';
autocompleteWordCountChartBox.style.borderRadius = '2px';
autocompleteWordCountChartBox.style.color = '#58DE37';
autocompleteWordCountChartBox.style.fontFamily = 'Roboto';
autocompleteWordCountChartBox.style.fontSize = '12px';
autocompleteWordCountChartBox.style.textAlign = 'center';
autocompleteWordCountChartBox.style.boxShadow = '6px 10px 18px -22px rgba(0,0,0,0.75)';
autocompleteWordCountChartBox.style.width = '95%';
autocompleteWordCountChartBox.style.height = '190px';

autocompleteSidebarGoals.appendChild(autocompleteWordCountChartBox);

const autocompleteWordCountChartCanvas = document.createElement('canvas');
autocompleteWordCountChartCanvas.setAttribute('id','word-count-chart');
autocompleteWordCountChartCanvas.style.height = "160px";
autocompleteWordCountChartCanvas.style.width = "100%";
autocompleteWordCountChartCanvas.style.maxWidth = "100%";
autocompleteWordCountChartBox.appendChild(autocompleteWordCountChartCanvas)

var xValues = [1,2,3,4,5,6];
var yValues = [5,10,15,20,25,30];

new Chart(autocompleteWordCountChartCanvas, {
  type: "line",
  data: {
    labels: xValues,
    datasets: [{
      backgroundColor: "rgba(0,0,0,1.0)",
      borderColor: "rgba(0,0,0,0.1)",
      data: yValues,
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  },
  options:{
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
  }
});

const autocompleteWordCountBox = document.createElement('div');
autocompleteWordCountBox.style.borderStyle = 'solid';
autocompleteWordCountBox.style.borderWidth = '2px';
autocompleteWordCountBox.style.borderColor = '#58DE37';
autocompleteWordCountBox.style.marginTop = '5px';
autocompleteWordCountBox.style.marginBottom = '30px';
autocompleteWordCountBox.style.paddingTop = '10px';
autocompleteWordCountBox.style.paddingBottom = '10px';
autocompleteWordCountBox.style.borderRadius = '2px';
autocompleteWordCountBox.style.color = '#58DE37';
autocompleteWordCountBox.style.fontFamily = 'Roboto';
autocompleteWordCountBox.style.fontSize = '12px';
autocompleteWordCountBox.style.textAlign = 'center';
autocompleteWordCountBox.style.boxShadow = '6px 10px 18px -22px rgba(0,0,0,0.75)';
autocompleteWordCountBox.style.width = '95%';
autocompleteWordCountBox.innerText = 'Total to Date: 40,000 words / 10.5h';

autocompleteSidebarGoals.appendChild(autocompleteWordCountBox);

// GOALS FEATURE UI END




// OPTIONS UI
const autocompleteSidebarOptions = document.createElement('div');
autocompleteSidebarOptions.setAttribute("id","autocomplete-sidebar-options-content")
autocompleteSidebarOptions.style.marginLeft='20px';
autocompleteSidebarOptions.style.marginTop='0px';
autocompleteSidebarOptions.style.height='80%';
autocompleteSidebarOptions.style.overflowY='scroll';

const autocompleteSidebarOptionsTitle = document.createElement('p');
autocompleteSidebarOptionsTitle.style.width = '180px';
autocompleteSidebarOptionsTitle.style.paddingBottom = '5px';
autocompleteSidebarOptionsTitle.style.marginBottom = '5px';
autocompleteSidebarOptionsTitle.style.fontFamily = 'Roboto';
autocompleteSidebarOptionsTitle.style.fontSize = '18px';
autocompleteSidebarOptionsTitle.style.color = '#58DE37';
autocompleteSidebarOptionsTitle.style.marginTop = '0px';
autocompleteSidebarOptionsTitle.style.borderBottom = '1px solid #D3D3D3';
autocompleteSidebarOptionsTitle.innerHTML = `
<b>Settings<b/>
`
autocompleteSidebarOptions.appendChild(autocompleteSidebarOptionsTitle);

const autocompleteAutoPromptOption = document.createElement('div');
autocompleteAutoPromptOption.style.display = 'flex';
autocompleteAutoPromptOption.style.alignItems = 'center';
autocompleteAutoPromptOption.innerHTML = `
<p style="font-family: Roboto; color: #58DE37; font-size: 11px; margin-right:10px"><b>Auto-prompt pause time required:<b/></p> 
`;
autocompleteSidebarOptions.appendChild(autocompleteAutoPromptOption);

const autocompleteAutoPromptOptionButton = document.createElement('div');
autocompleteAutoPromptOptionButton.style.borderStyle = 'solid';
autocompleteAutoPromptOptionButton.style.padding = '2px';
autocompleteAutoPromptOptionButton.style.borderWidth = '2px';
autocompleteAutoPromptOptionButton.style.borderRadius = '5px';
autocompleteAutoPromptOptionButton.style.color = '#58DE37';
autocompleteAutoPromptOptionButton.style.fontFamily = 'Roboto';
autocompleteAutoPromptOptionButton.style.fontSize = '10px';
autocompleteAutoPromptOptionButton.style.userSelect = 'none';
autocompleteAutoPromptOptionButton.innerText = '15 seconds';

chrome.storage.local.get(["autoPromptDelaySetting"], function(result){
  if(result.autoPromptDelaySetting == undefined){
    chrome.storage.local.set({autoPromptDelaySetting:15}, function() {});
  }else{
    for (var i = 0; i < autoPromptTimeOptionsValue.length; i++) {
      if(autoPromptTimeOptionsValue[i] == result.autoPromptDelaySetting){
        autocompleteAutoPromptOptionButton.innerText = autoPromptTimeOptionsKey[i];
      }
    }
  }
})

autocompleteAutoPromptOptionButton.onmouseover = function() {
  autocompleteAutoPromptOptionButton.style.cursor='pointer'
  autocompleteAutoPromptOptionButton.style.padding = '3px';
}
autocompleteAutoPromptOptionButton.onmouseleave = function() {
  autocompleteAutoPromptOptionButton.style.cursor='auto'
  autocompleteAutoPromptOptionButton.style.padding = '2px';
}
autocompleteAutoPromptOptionButton.onclick = function() {
  chrome.storage.local.get(["autoPromptDelaySetting"], function(result){
    var nextIndex;
    for (var i = 0; i < autoPromptTimeOptionsValue.length; i++) {
      if(autoPromptTimeOptionsValue[i] == result.autoPromptDelaySetting){
        if((i + 1) == autoPromptTimeOptionsValue.length){
          nextIndex = 0;
        }else{
          nextIndex = i + 1;
        }
      }
    }
    chrome.storage.local.set({autoPromptDelaySetting:autoPromptTimeOptionsValue[nextIndex]}, function() {});
  })
}

autocompleteAutoPromptOption.appendChild(autocompleteAutoPromptOptionButton);


const autocompleteDisableOption = document.createElement('div');
autocompleteDisableOption.style.display = 'flex';
autocompleteDisableOption.style.alignItems = 'center';
autocompleteDisableOption.innerHTML = `
<p style="font-family: Roboto; color: #58DE37; font-size: 11px; margin-right:10px"><b>Disable autocomplete auto-prompt:<b/></p> 
`;
autocompleteSidebarOptions.appendChild(autocompleteDisableOption);

const autocompleteDisableOptionButton = document.createElement('div');
autocompleteDisableOptionButton.style.borderStyle = 'solid';
autocompleteDisableOptionButton.style.padding = '2px';
autocompleteDisableOptionButton.style.borderWidth = '2px';
autocompleteDisableOptionButton.style.borderRadius = '5px';
autocompleteDisableOptionButton.style.color = '#58DE37';
autocompleteDisableOptionButton.style.fontFamily = 'Roboto';
autocompleteDisableOptionButton.style.fontSize = '10px';
autocompleteDisableOptionButton.innerText = 'Not Disabled';
autocompleteDisableOptionButton.style.userSelect = 'none';

chrome.storage.local.get(["disabledSetting"], function(result){
  if(result.disabledSetting == undefined){
    chrome.storage.local.set({disabledSetting:0}, function() {});
    var currentDate = new Date();
    chrome.storage.local.set({disabledWaitDate:currentDate.toJSON()}, function() {});
  }else{
    for (var i = 0; i < disableOptionsValue.length; i++) {
      if(disableOptionsValue[i] == result.disabledSetting){
        autocompleteDisableOptionButton.innerText = disableOptionsKey[i];
      }
    }
  }
})

autocompleteDisableOptionButton.onmouseover = function() {
  autocompleteDisableOptionButton.style.cursor='pointer'
  autocompleteDisableOptionButton.style.padding = '3px';
}
autocompleteDisableOptionButton.onmouseleave = function() {
  autocompleteDisableOptionButton.style.cursor='auto'
  autocompleteDisableOptionButton.style.padding = '2px';
}
autocompleteDisableOptionButton.onclick = function() {
  chrome.storage.local.get(["disabledSetting"], function(result){
    var nextIndex;
    for (var i = 0; i < disableOptionsValue.length; i++) {
      if(disableOptionsValue[i] == result.disabledSetting){
        if((i + 1) == disableOptionsValue.length){
          nextIndex = 0;
        }else{
          nextIndex = i + 1;
        }
      }
    }
    chrome.storage.local.set({disabledSetting:disableOptionsValue[nextIndex]}, function() {});
  })
}


autocompleteDisableOption.appendChild(autocompleteDisableOptionButton);


//ACCOUNT ELEMENTS
const autocompleteSidebarAccountTitle = document.createElement('p');
autocompleteSidebarAccountTitle.style.width = '180px';
autocompleteSidebarAccountTitle.style.paddingBottom = '5px';
autocompleteSidebarAccountTitle.style.marginBottom = '15px';
autocompleteSidebarAccountTitle.style.fontFamily = 'Roboto';
autocompleteSidebarAccountTitle.style.fontSize = '18px';
autocompleteSidebarAccountTitle.style.color = '#58DE37';
autocompleteSidebarAccountTitle.style.borderBottom = '1px solid #D3D3D3';
autocompleteSidebarAccountTitle.style.marginTop = '50px';
autocompleteSidebarAccountTitle.innerHTML = `
<b>Account<b/>
`
autocompleteSidebarOptions.appendChild(autocompleteSidebarAccountTitle);

const autocompleteAccountEmail = document.createElement('div');
autocompleteAccountEmail.style.display = 'flex';
autocompleteAccountEmail.style.alignItems = 'center';
autocompleteAccountEmail.innerHTML = `
<p style="font-family: Roboto; color: #58DE37; font-size: 11px; margin-right:10px"><b>Email:<b/></p> 
`;
autocompleteSidebarOptions.appendChild(autocompleteAccountEmail);

const autocompleteAccountEmailValue = document.createElement('div');
autocompleteAccountEmailValue.style.fontFamily = "Roboto";
autocompleteAccountEmailValue.style.fontSize = "11px";
autocompleteAccountEmailValue.style.color = "#58DE37";
autocompleteAccountEmail.appendChild(autocompleteAccountEmailValue)


const autocompleteAccountPlan = document.createElement('div');
autocompleteAccountPlan.style.display = 'flex';
autocompleteAccountPlan.style.alignItems = 'center';
autocompleteAccountPlan.innerHTML = `
<p style="font-family: Roboto; color: #58DE37; font-size: 11px; margin-right:10px"><b>Plan:<b/></p> 
`;
autocompleteSidebarOptions.appendChild(autocompleteAccountPlan);

const autocompleteAccountPlanValue = document.createElement('div');
autocompleteAccountPlanValue.style.fontFamily = "Roboto";
autocompleteAccountPlanValue.style.fontSize = "11px";
autocompleteAccountPlanValue.style.color = "#58DE37";
autocompleteAccountPlan.appendChild(autocompleteAccountPlanValue)


const autocompleteAccountUsage = document.createElement('div');
autocompleteAccountUsage.style.display = 'flex';
autocompleteAccountUsage.style.alignItems = 'center';
autocompleteAccountUsage.innerHTML = `
<p style="font-family: Roboto; color: #58DE37; font-size: 11px; margin-right:10px"><b>Today's prompt usage:<b/></p> 
`;
autocompleteSidebarOptions.appendChild(autocompleteAccountUsage);

const autocompleteAccountUsageValue = document.createElement('div');
autocompleteAccountUsageValue.style.fontFamily = "Roboto";
autocompleteAccountUsageValue.style.fontSize = "11px";
autocompleteAccountUsageValue.style.color = "#58DE37";
autocompleteAccountUsage.appendChild(autocompleteAccountUsageValue)


const autocompleteAccountUpgrade = document.createElement('div');
autocompleteAccountUpgrade.style.borderStyle = 'solid';
autocompleteAccountUpgrade.style.padding = '4px';
autocompleteAccountUpgrade.style.borderWidth = '2px';
autocompleteAccountUpgrade.style.borderRadius = '5px';
autocompleteAccountUpgrade.style.color = '#58DE37';
autocompleteAccountUpgrade.style.fontFamily = 'Roboto';
autocompleteAccountUpgrade.style.fontSize = '10px';
autocompleteAccountUpgrade.style.userSelect = 'none';
autocompleteAccountUpgrade.style.width = '95px';
autocompleteAccountUpgrade.style.marginBottom = '10px';
autocompleteSidebarOptions.appendChild(autocompleteAccountUpgrade);

autocompleteAccountUpgrade.onmouseover = function() {
  autocompleteAccountUpgrade.style.cursor='pointer'
  autocompleteAccountUpgrade.style.boxShadow='0px 1px 1px 1px #ccc'
}
autocompleteAccountUpgrade.onmouseleave = function() {
  autocompleteAccountUpgrade.style.cursor='auto'
  autocompleteAccountUpgrade.style.boxShadow=''
}

autocompleteAccountUpgrade.innerText = 'Manage Plan';
autocompleteAccountUpgrade.onclick = function() {
  chrome.runtime.sendMessage({
    type: 'manage:subscription',
    docUrl: location.href
  })
}
autocompleteAccountUpgrade.style.width = '60px';


const autocompleteAccountSignOut = document.createElement('div');
autocompleteAccountSignOut.style.borderStyle = 'solid';
autocompleteAccountSignOut.style.padding = '4px';
autocompleteAccountSignOut.style.borderWidth = '2px';
autocompleteAccountSignOut.style.borderRadius = '5px';
autocompleteAccountSignOut.style.color = '#58DE37';
autocompleteAccountSignOut.style.fontFamily = 'Roboto';
autocompleteAccountSignOut.style.fontSize = '10px';
autocompleteAccountSignOut.innerText = 'Sign Out';
autocompleteAccountSignOut.style.userSelect = 'none';
autocompleteAccountSignOut.style.width = '40px';
autocompleteAccountSignOut.style.marginBottom = '10px';
autocompleteSidebarOptions.appendChild(autocompleteAccountSignOut);

autocompleteAccountSignOut.onmouseover = function() {
  autocompleteAccountSignOut.style.cursor='pointer'
  autocompleteAccountSignOut.style.boxShadow='0px 1px 1px 1px #ccc'
}
autocompleteAccountSignOut.onmouseleave = function() {
  autocompleteAccountSignOut.style.cursor='auto'
  autocompleteAccountSignOut.style.boxShadow=''
}

autocompleteAccountSignOut.onclick = function() {
  chrome.runtime.sendMessage({
    type: 'auth:signOut'
  })
}


//FEEDBACK ELEMENTS
const autocompleteSidebarFeedbackTitle = document.createElement('p');
autocompleteSidebarFeedbackTitle.style.width = '180px';
autocompleteSidebarFeedbackTitle.style.paddingBottom = '5px';
autocompleteSidebarFeedbackTitle.style.marginBottom = '15px';
autocompleteSidebarFeedbackTitle.style.fontFamily = 'Roboto';
autocompleteSidebarFeedbackTitle.style.fontSize = '18px';
autocompleteSidebarFeedbackTitle.style.color = '#58DE37';
autocompleteSidebarFeedbackTitle.style.borderBottom = '1px solid #D3D3D3';
autocompleteSidebarFeedbackTitle.style.marginTop = '60px';
autocompleteSidebarFeedbackTitle.innerHTML = `
<b>Give Feedback<b/>
`
autocompleteSidebarOptions.appendChild(autocompleteSidebarFeedbackTitle);

const autocompleteRatingFeedback = document.createElement('div');
autocompleteRatingFeedback.style.borderStyle = 'solid';
autocompleteRatingFeedback.style.padding = '4px';
autocompleteRatingFeedback.style.borderWidth = '2px';
autocompleteRatingFeedback.style.borderRadius = '5px';
autocompleteRatingFeedback.style.color = '#58DE37';
autocompleteRatingFeedback.style.fontFamily = 'Roboto';
autocompleteRatingFeedback.style.fontSize = '10px';
autocompleteRatingFeedback.innerText = '👍 Leave a Rating! 👍';
autocompleteRatingFeedback.style.userSelect = 'none';
autocompleteRatingFeedback.style.width = '100px';
autocompleteRatingFeedback.style.marginBottom = '10px';
autocompleteSidebarOptions.appendChild(autocompleteRatingFeedback);

autocompleteRatingFeedback.onmouseover = function() {
  autocompleteRatingFeedback.style.cursor='pointer'
  autocompleteRatingFeedback.style.boxShadow='0px 1px 1px 1px #ccc'
}
autocompleteRatingFeedback.onmouseleave = function() {
  autocompleteRatingFeedback.style.cursor='auto'
  autocompleteRatingFeedback.style.boxShadow=''
}

autocompleteRatingFeedback.onclick = function() {
  chrome.runtime.sendMessage({
    type: 'open:review',
  })
}


const autocompleteTesterFeedback = document.createElement('div');
autocompleteTesterFeedback.style.borderStyle = 'solid';
autocompleteTesterFeedback.style.padding = '4px';
autocompleteTesterFeedback.style.borderWidth = '2px';
autocompleteTesterFeedback.style.borderRadius = '5px';
autocompleteTesterFeedback.style.color = '#58DE37';
autocompleteTesterFeedback.style.fontFamily = 'Roboto';
autocompleteTesterFeedback.style.fontSize = '10px';
autocompleteTesterFeedback.innerText = 'Become a Beta Tester';
autocompleteTesterFeedback.style.userSelect = 'none';
autocompleteTesterFeedback.style.width = '100px';
autocompleteTesterFeedback.style.marginBottom = '10px';
// autocompleteSidebarOptions.appendChild(autocompleteTesterFeedback);


autocompleteTesterFeedback.onmouseover = function() {
  autocompleteTesterFeedback.style.cursor='pointer'
  autocompleteTesterFeedback.style.boxShadow='0px 1px 1px 1px #ccc'
}
autocompleteTesterFeedback.onmouseleave = function() {
  autocompleteTesterFeedback.style.cursor='auto'
  autocompleteTesterFeedback.style.boxShadow=''
}
autocompleteTesterFeedback.onclick = function() {
  createBetaTesterPage()
}

const autocompleteBugFeedback = document.createElement('div');
autocompleteBugFeedback.style.borderStyle = 'solid';
autocompleteBugFeedback.style.padding = '4px';
autocompleteBugFeedback.style.borderWidth = '2px';
autocompleteBugFeedback.style.borderRadius = '5px';
autocompleteBugFeedback.style.color = '#58DE37';
autocompleteBugFeedback.style.fontFamily = 'Roboto';
autocompleteBugFeedback.style.fontSize = '10px';
autocompleteBugFeedback.innerText = 'Report a Bug';
autocompleteBugFeedback.style.userSelect = 'none';
autocompleteBugFeedback.style.width = '65px';
autocompleteBugFeedback.style.marginBottom = '10px';
autocompleteSidebarOptions.appendChild(autocompleteBugFeedback);

autocompleteBugFeedback.onmouseover = function() {
  autocompleteBugFeedback.style.cursor='pointer'
  autocompleteBugFeedback.style.boxShadow='0px 1px 1px 1px #ccc'
}
autocompleteBugFeedback.onmouseleave = function() {
  autocompleteBugFeedback.style.cursor='auto'
  autocompleteBugFeedback.style.boxShadow=''
}
autocompleteBugFeedback.onclick = function() {
  createReportBugModal()
}


//ABOUT ELEMENTS
const autocompleteSidebarAboutTitle = document.createElement('p');
autocompleteSidebarAboutTitle.style.width = '180px';
autocompleteSidebarAboutTitle.style.paddingBottom = '5px';
autocompleteSidebarAboutTitle.style.marginBottom = '0px';
autocompleteSidebarAboutTitle.style.fontFamily = 'Roboto';
autocompleteSidebarAboutTitle.style.fontSize = '18px';
autocompleteSidebarAboutTitle.style.color = '#58DE37';
autocompleteSidebarAboutTitle.style.borderBottom = '1px solid #D3D3D3';
autocompleteSidebarAboutTitle.style.marginTop = '50px';
autocompleteSidebarAboutTitle.innerHTML = `
<b>About autocomplete<b/>
`
autocompleteSidebarOptions.appendChild(autocompleteSidebarAboutTitle);

const autocompleteAbout = document.createElement('div');
autocompleteAbout.style.display = 'flex';
autocompleteAbout.style.alignItems = 'center';
autocompleteAbout.innerHTML = `
<p style="font-family: Roboto; color: #58DE37; font-size: 11px; margin-right:10px">autocomplete uses AI to help writers never get stuck while writing. Learn about it's AI limitations <a target="_blank" href="https://www.autocomplete.com/ai-limitations"><u>here</u></a>.</p> 
`;
autocompleteSidebarOptions.appendChild(autocompleteAbout);

const autocompleteAboutPrivacy = document.createElement('div');
autocompleteAboutPrivacy.style.display = 'flex';
autocompleteAboutPrivacy.style.alignItems = 'center';
autocompleteAboutPrivacy.innerHTML = `
<p style="font-family: Roboto; color: #58DE37; font-size: 11px; margin-right:10px; margin-top:-5px"><a target="_blank" href="https://www.autocomplete.com/content-policy"><u>Content & Usage Policy</u></a> | <a target="_blank" href="https://www.autocomplete.com/privacy"><u>Privacy Policy</u></a></p> 
`;
autocompleteSidebarOptions.appendChild(autocompleteAboutPrivacy);



// IDEA BOUNCE UI
const autocompleteSidebarIdeaBounce = document.createElement('div');
autocompleteSidebarIdeaBounce.setAttribute("id","autocomplete-sidebar-ideaBounce-container")
autocompleteSidebarIdeaBounce.style.width='100%';


const autocompleteSidebarIdeaBounceSearch = document.createElement('div');
autocompleteSidebarIdeaBounceSearch.setAttribute("id","autocomplete-sidebar-ideaBounce-content")
autocompleteSidebarIdeaBounceSearch.style.width='100%';
autocompleteSidebarIdeaBounceSearch.style.marginTop='0px';
autocompleteSidebarIdeaBounceSearch.style.margin='20px';
autocompleteSidebarIdeaBounceSearch.style.display='flex';
autocompleteSidebarIdeaBounceSearch.style.alignItems='center';

const autocompleteIdeaBounceInputButton = document.createElement('div');
autocompleteIdeaBounceInputButton.style.width='100%';
autocompleteIdeaBounceInputButton.style.userSelect='none';
autocompleteIdeaBounceInputButton.innerHTML=`
<div id="ideaBounce-input-button" style="width: 100%; height: 36px; background-color: #58DE37; border-color: #58DE37; display: flex; align-items: center;"><p style="margin-left:auto; margin-right:auto;  font-family: Roboto; color: white; font-size: 14px; border-radius: 0px 2px 2px 0px;">Shuffle!<p></div>
`
autocompleteSidebarIdeaBounceSearch.appendChild(autocompleteIdeaBounceInputButton)
autocompleteSidebarIdeaBounce.appendChild(autocompleteSidebarIdeaBounceSearch)

autocompleteIdeaBounceInputButton.onmouseover = function() {
  autocompleteIdeaBounceInputButton.style.cursor='pointer'
}
autocompleteIdeaBounceInputButton.onmouseleave = function() {
  autocompleteIdeaBounceInputButton.style.cursor='auto'
}
autocompleteIdeaBounceInputButton.onmousedown = function() {
  autocompleteIdeaBounceInputButton.style.boxShadow='0px 1px 1px 1px #ccc'
}
autocompleteIdeaBounceInputButton.onmouseup = function() {
  autocompleteIdeaBounceInputButton.style.boxShadow=''
}

autocompleteSidebar.appendChild(autocompleteSidebarIdeaBounce); 

//InspoGen boxes
const autocompleteIdeaBounceBox1 = document.createElement('div');
autocompleteIdeaBounceBox1.style.borderStyle = 'solid';
autocompleteIdeaBounceBox1.style.borderWidth = '2px';
autocompleteIdeaBounceBox1.style.borderColor = '#58DE37';
autocompleteIdeaBounceBox1.style.margin = '20px';
autocompleteIdeaBounceBox1.style.marginTop = '0px';
autocompleteIdeaBounceBox1.style.paddingLeft = '10px';
autocompleteIdeaBounceBox1.style.paddingRight = '10px';
autocompleteIdeaBounceBox1.style.paddingTop = '15px';
autocompleteIdeaBounceBox1.style.paddingBottom = '15px';
autocompleteIdeaBounceBox1.style.borderRadius = '2px';
autocompleteIdeaBounceBox1.style.fontWeight = 'bold';
autocompleteIdeaBounceBox1.style.color = '#58DE37';
autocompleteIdeaBounceBox1.style.fontFamily = 'Roboto';
autocompleteIdeaBounceBox1.style.fontSize = '11px';
autocompleteIdeaBounceBox1.style.boxShadow = '6px 10px 18px -22px rgba(0,0,0,0.75)';
autocompleteIdeaBounceBox1.style.userSelect = 'none';
autocompleteIdeaBounceBox1.style.width = '84%';
autocompleteIdeaBounceBox1.style.height = '200px';
autocompleteSidebar.appendChild(autocompleteIdeaBounceBox1); 

//InspoGen boxes
const autocompleteIdeaBounceBoxText1 = document.createElement('p');
autocompleteIdeaBounceBoxText1.innerText = '"Some caption that is a a few words long around one sentence."';
autocompleteIdeaBounceBoxText1.style.font = 'Robto';
autocompleteIdeaBounceBoxText1.style.color = '#58DE37';
autocompleteIdeaBounceBoxText1.style.margin = '20px';
autocompleteIdeaBounceBoxText1.style.textAlign = 'center';
autocompleteIdeaBounceBoxText1.style.fontSize = '11px';
autocompleteSidebar.appendChild(autocompleteIdeaBounceBoxText1); 


const autocompleteIdeaBounceBox2 = document.createElement('div');
autocompleteIdeaBounceBox2.style.borderStyle = 'solid';
autocompleteIdeaBounceBox2.style.borderWidth = '2px';
autocompleteIdeaBounceBox2.style.borderColor = '#58DE37';
autocompleteIdeaBounceBox2.style.margin = '20px';
autocompleteIdeaBounceBox2.style.marginTop = '0px';
autocompleteIdeaBounceBox2.style.paddingLeft = '10px';
autocompleteIdeaBounceBox2.style.paddingRight = '10px';
autocompleteIdeaBounceBox2.style.paddingTop = '15px';
autocompleteIdeaBounceBox2.style.paddingBottom = '15px';
autocompleteIdeaBounceBox2.style.borderRadius = '2px';
autocompleteIdeaBounceBox2.style.fontWeight = 'bold';
autocompleteIdeaBounceBox2.style.color = '#58DE37';
autocompleteIdeaBounceBox2.style.fontFamily = 'Roboto';
autocompleteIdeaBounceBox2.style.fontSize = '11px';
autocompleteIdeaBounceBox2.style.boxShadow = '6px 10px 18px -22px rgba(0,0,0,0.75)';
autocompleteIdeaBounceBox2.style.userSelect = 'none';
autocompleteIdeaBounceBox2.style.width = '84%';
autocompleteIdeaBounceBox2.style.height = '200px';
autocompleteSidebar.appendChild(autocompleteIdeaBounceBox2); 

const autocompleteIdeaBounceBoxText2 = document.createElement('p');
autocompleteIdeaBounceBoxText2.innerText = '"Some caption that is a a few words long around one sentence."';
autocompleteIdeaBounceBoxText2.style.font = 'Robto';
autocompleteIdeaBounceBoxText2.style.color = '#58DE37';
autocompleteIdeaBounceBoxText2.style.margin = '20px';
autocompleteIdeaBounceBoxText2.style.textAlign = 'center';
autocompleteIdeaBounceBoxText2.style.fontSize = '11px';
autocompleteSidebar.appendChild(autocompleteIdeaBounceBoxText2); 


//IdeaBounce Loader
const autocompleteIdeaBounceLoader = document.createElement('div');
autocompleteIdeaBounceLoader.style.border = '4px solid #f3f3f3';
autocompleteIdeaBounceLoader.style.borderRadius = '50%';
autocompleteIdeaBounceLoader.style.borderTop = '4px solid #58DE37';
autocompleteIdeaBounceLoader.style.width = '30px';
autocompleteIdeaBounceLoader.style.height = '30px';
autocompleteIdeaBounceLoader.style.marginTop = '60px';
autocompleteIdeaBounceLoader.style.marginBottom = '60px';
autocompleteIdeaBounceLoader.style.marginLeft = 'auto';
autocompleteIdeaBounceLoader.style.marginRight = 'auto';
autocompleteIdeaBounceLoader.animate([
  { transform: 'rotate(0)' },
  { transform: 'rotate(360deg)' }
],{
  duration: 1000,
  iterations: Infinity,
})

autocompleteIdeaBounceInputButton.onclick = function() {
  chrome.runtime.sendMessage({
    type: 'icon:clicked',
    INSTANCE_ID: INSTANCE_ID
  })
  autocompleteIdeaBounceBox1.appendChild(autocompleteIdeaBounceLoader)
  autocompleteIdeaBounceBox2.appendChild(autocompleteIdeaBounceLoader)
}

//Selectable idea bounce boxes
const autocompleteIdeaBounceBox = document.createElement('div');
autocompleteIdeaBounceBox.style.borderStyle = 'solid';
autocompleteIdeaBounceBox.style.borderWidth = '2px';
autocompleteIdeaBounceBox.style.borderColor = '#58DE37';
autocompleteIdeaBounceBox.style.margin = '20px';
autocompleteIdeaBounceBox.style.marginTop = '0px';
autocompleteIdeaBounceBox.style.paddingLeft = '10px';
autocompleteIdeaBounceBox.style.paddingRight = '10px';
autocompleteIdeaBounceBox.style.paddingTop = '15px';
autocompleteIdeaBounceBox.style.paddingBottom = '15px';
autocompleteIdeaBounceBox.style.borderRadius = '2px';
autocompleteIdeaBounceBox.style.fontWeight = 'bold';
autocompleteIdeaBounceBox.style.color = '#58DE37';
autocompleteIdeaBounceBox.style.fontFamily = 'Roboto';
autocompleteIdeaBounceBox.style.fontSize = '11px';
autocompleteIdeaBounceBox.style.boxShadow = '6px 10px 18px -22px rgba(0,0,0,0.75)';
autocompleteIdeaBounceBox.style.userSelect = 'none';

// Listener for changing displayed menu items
chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if(key == "autoPromptDelaySetting"){
      for (var i = 0; i < autoPromptTimeOptionsValue.length; i++) {
        if(autoPromptTimeOptionsValue[i] == newValue){
          autocompleteAutoPromptOptionButton.innerText = autoPromptTimeOptionsKey[i];
        }
      }
      // CLEARING OLD SETTING
      clearInterval(idleCheckServiceId);

      idleCheckServiceId = setInterval(function(){
        chrome.storage.local.get(["disabledWaitDate"], function(result2){
          chrome.runtime.sendMessage({
            type: 'idle:check',
            INSTANCE_ID: INSTANCE_ID
          })
        })
      }, newValue*1000)
    }

    if(key == "disabledSetting"){
      for (var i = 0; i < disableOptionsValue.length; i++) {
        if(disableOptionsValue[i] == newValue){
          autocompleteDisableOptionButton.innerText = disableOptionsKey[i];
          
          var currentDate = new Date();
          var targetDate = new Date(currentDate.getTime() + newValue*60000);
          chrome.storage.local.set({disabledWaitDate:targetDate.toJSON()}, function() {
            // console.log(targetDate)
          });
        }
      }
    }
    
    if(key == "instances"){
      if(!noChangeInInstance(oldValue,newValue)){
        var instanceChanges = getInstanceChange(oldValue[INSTANCE_ID],newValue[INSTANCE_ID]);

        if(instanceChanges.changedKeys.includes("promptExists")){
          if(instanceChanges.valueMap["promptExists"].newValue == true){
            try {
              document.body.appendChild(autocompleteSidebar)
            } catch (error) {}
          }else{
            try {
              document.body.removeChild(autocompleteSidebar)
            } catch (error) {}
          }
        }

        if(instanceChanges.changedKeys.includes("loadingNewPrompt")){
          if(instanceChanges.valueMap["loadingNewPrompt"].newValue == true){
            option2.innerHTML = `
            <p><b>Loading...</b></p>
            `;
          }else{
            option2.innerHTML = `
            <p><b>Next prompt</b></p>
            `;
          }
        }

        //GOALS FEATURE CHANGE START 
        if(instanceChanges.changedKeys.includes("menuItemSelected")){
          if(instanceChanges.valueMap["menuItemSelected"].newValue == "ideaBounce"){
            try {
              autocompleteSidebar.removeChild(autocompleteSidebarOptions)
            } catch (error) {}
            try {
              autocompleteSidebar.removeChild(autocompleteSidebarGoals)
            } catch (error) {}
            autocompleteSidebar.appendChild(autocompleteSidebarIdeaBounce)
          }else if (instanceChanges.valueMap["menuItemSelected"].newValue == "goals"){
            try {
              autocompleteSidebar.removeChild(autocompleteSidebarIdeaBounce)
            } catch (error) {}
            try {
              autocompleteSidebar.removeChild(autocompleteSidebarOptions)
            } catch (error) {}
            autocompleteSidebar.appendChild(autocompleteSidebarGoals)
          }else{
            try {
              autocompleteSidebar.removeChild(autocompleteSidebarIdeaBounce)
            } catch (error) {}
            try {
              autocompleteSidebar.removeChild(autocompleteSidebarGoals)
            } catch (error) {}
            autocompleteSidebar.appendChild(autocompleteSidebarOptions)
          }
        }
        //GOALS FEATURE CHANGE END 

        if(instanceChanges.changedKeys.includes("ideaBounceIdeas")){
          var tempElement;
          if(instanceChanges.valueMap["ideaBounceIdeas"].newValue.length > 0){
            autocompleteSidebarIdeaBounce.removeChild(autocompleteIdeaBounceLoader); 

            for(var i = 0; i < instanceChanges.valueMap["ideaBounceIdeas"].newValue.length; i++){
              tempElement = autocompleteIdeaBounceBox.cloneNode(false);
              tempElement.setAttribute('id','ideaBounce-'+i)
              tempElement.innerText = instanceChanges.valueMap["ideaBounceIdeas"].newValue[i].text.replace(/[\r\n]/gm, '')
              autocompleteSidebarIdeaBounce.appendChild(tempElement)
            }
            for(var i = 0; i < instanceChanges.valueMap["ideaBounceIdeas"].newValue.length; i++){
              const tempElement = document.querySelector("#ideaBounce-"+i);
              tempElement.onmouseover = function() {
                tempElement.style.cursor='pointer'
                tempElement.style.boxShadow = '6px 10px 18px -14px rgba(0,0,0,0.75)';
              }
              tempElement.onmouseleave = function() {
                tempElement.style.cursor='auto'
                tempElement.style.boxShadow = '6px 10px 18px -22px rgba(0,0,0,0.75)';
              }
              
              tempElement.onclick = function() {
                setChromeStorageValues(["sidebarOpen"],[false]);
                document.body.removeChild(autocompleteSidebar);

                chrome.runtime.sendMessage({
                  type: 'ideaBounce:selected',
                  INSTANCE_ID: INSTANCE_ID,
                  text: tempElement.innerText
                })
              }
            }
          }else{
            for(var i = 0; i < instanceChanges.valueMap["ideaBounceIdeas"].newValue.length; i++){
              tempElement = document.querySelector("#ideaBounce-"+i);
              autocompleteSidebarIdeaBounce.removeChild(tempElement)
            }
          }
        }
      }
    }
  }
});

// CREATING autocomplete BUTTON
const autocompleteButton = document.createElement('div');
autocompleteButton.style.backgroundColor='#58DE37';
autocompleteButton.style.width='40px';
autocompleteButton.style.height='40px';
autocompleteButton.style.borderRadius='100%';
autocompleteButton.style.position='absolute';
autocompleteButton.style.bottom='60px';

autocompleteButton.style.right='16px';
autocompleteButton.style.display='flex';
autocompleteButton.style.justifyContent='center';
autocompleteButton.style.alignItems='center';
autocompleteButton.style.zIndex='1';
autocompleteButton.style.cursor='pointer';
autocompleteButton.innerHTML = `
<svg width="32" height="32" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M16.943 20.9112L30.179 11.703L32.1938 13.9168L21.7832 26.2296L16.943 20.9112ZM12.9624 21.6136L20.7102 30.1267C20.8706 30.2856 21.0629 30.4086 21.2744 30.4877C21.4858 30.5667 21.7117 30.6 21.937 30.5854C22.1623 30.5707 22.3819 30.5084 22.5813 30.4025C22.7807 30.2967 22.9554 30.1497 23.0939 29.9714L35.8233 14.9159C36.0769 14.6372 36.2205 14.2758 36.2272 13.8991C36.2339 13.5224 36.1033 13.1561 35.8597 12.8686L31.5667 8.15165C31.3033 7.88221 30.9509 7.71779 30.5753 7.68908C30.1996 7.66038 29.8263 7.76934 29.5251 7.99565L13.3409 19.255C13.1503 19.376 12.9876 19.5362 12.8635 19.7248C12.7394 19.9134 12.6567 20.1262 12.6209 20.3491C12.5851 20.572 12.5971 20.8 12.6559 21.018C12.7148 21.236 12.8192 21.439 12.9624 21.6136V21.6136ZM4.77344 31.6513L14.3698 33.3123L16.8966 31.0125L11.7223 25.3272L4.77344 31.6513Z" fill="#F2F2F2"/>
</svg>
`;

autocompleteButton.onclick = function() {
  console.log("here")
  setChromeStorageValues(["promptExists"],[true]);
}

editingCanvas.appendChild(autocompleteButton);


// CREATING OPTION1 POPUP BUTTON
const option1 = document.createElement('div');
option1.style.backgroundColor='#FFFFFF';
option1.style.width='110px';
option1.style.height='30px';
option1.style.borderRadius='5px';
option1.style.position='absolute';
option1.style.bottom='185px';
option1.style.right='16px';
option1.style.display='flex';
option1.style.justifyContent='center';
option1.style.alignItems='center';
option1.style.zIndex='1';
option1.style.borderColor='#58DE37';
option1.style.borderWidth='medium';
option1.style.borderStyle='solid';
option1.style.color='#58DE37';
option1.style.fontFamily='Roboto';

option1.innerHTML = `
<p><b>Try this prompt!</b></p>
`;

option1.onmouseover = function() {
  option1.style.cursor='pointer'
  option1.style.boxShadow='2px 2px 2px 1px rgba(0, 0, 0, 0.2)';
}
option1.onmouseleave = function() {
  option1.style.cursor='auto'
  option1.style.boxShadow='0px 0px 0px 0px rgba(0, 0, 0, 0)';
}

option1.onclick = function() {
  chrome.runtime.sendMessage({
    type: 'prompt:accepted',
    INSTANCE_ID: INSTANCE_ID
  })
}

// CREATING OPTION2 POPUP BUTTON
const option2 = document.createElement('div');
option2.style.backgroundColor='#FFFFFF';
option2.style.width='90px';
option2.style.height='30px';
option2.style.borderRadius='5px';
option2.style.position='absolute';
option2.style.bottom='145px';
option2.style.right='16px';
option2.style.display='flex';
option2.style.justifyContent='center';
option2.style.alignItems='center';
option2.style.zIndex='1';
option2.style.borderColor='#58DE37';
option2.style.borderWidth='medium';
option2.style.borderStyle='solid';
option2.style.color='#58DE37';
option2.style.fontFamily='Roboto';

option2.innerHTML = `
<p><b>Next prompt</b></p>
`;

option2.onmouseover = function() {
  option2.style.cursor='pointer'
  option2.style.boxShadow='2px 2px 2px 1px rgba(0, 0, 0, 0.2)';
}
option2.onmouseleave = function() {
  option2.style.cursor='auto'
  option2.style.boxShadow='0px 0px 0px 0px rgba(0, 0, 0, 0)';
}

option2.onclick = function() {
  getChromeStorageValues(["loadingNewPrompt"],function(result){
    if(result.loadingNewPrompt == undefined || result.loadingNewPrompt == null){
      chrome.runtime.sendMessage({
        type: 'prompt:next',
        INSTANCE_ID: INSTANCE_ID
      })
      setChromeStorageValues(["loadingNewPrompt"],[true]);
    }else if(!result.loadingNewPrompt){
      chrome.runtime.sendMessage({
        type: 'prompt:next',
        INSTANCE_ID: INSTANCE_ID
      })
      setChromeStorageValues(["loadingNewPrompt"],[true]);
    }
  })
}

// CREATING OPTION3 POPUP BUTTON
const option3 = document.createElement('div');
option3.style.backgroundColor='#FFFFFF';
option3.style.width='60px';
option3.style.height='30px';
option3.style.borderRadius='5px';
option3.style.position='absolute';
option3.style.bottom='110px';
option3.style.right='16px';
option3.style.display='flex';
option3.style.justifyContent='center';
option3.style.alignItems='center';
option3.style.zIndex='1';
option3.style.borderColor='gray';
option3.style.borderWidth='thin';
option3.style.borderStyle='solid';
option3.style.color='gray';
option3.style.fontFamily='Roboto';

option3.innerHTML = `
<p>Ignore</p>
`;

option3.onmouseover = function() {
  option3.style.cursor='pointer'
  option3.style.boxShadow='1px 1px 1px 1px rgba(0, 0, 0, 0.2)';
}
option3.onmouseleave = function() {
  option3.style.cursor='auto'
  option3.style.boxShadow='0px 0px 0px 0px rgba(0, 0, 0, 0)';
}

option3.onclick = function() {
  chrome.runtime.sendMessage({
    type: 'prompt:ignore',
    INSTANCE_ID: INSTANCE_ID
  })
}

// LISTENERS
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type == "image1"){
    console.log(request.data)
    autocompleteIdeaBounceBox1.innerHTML = ""
    autocompleteIdeaBounceBoxText1.innerText = request.data[0].text
    autocompleteIdeaBounceBox1.style.backgroundImage = "url('"+request.data[0].img+"')"
  }
  if (request.type == "image2"){
    autocompleteIdeaBounceBox2.innerHTML = ""
    autocompleteIdeaBounceBoxText2.innerText = request.data[0].text
    autocompleteIdeaBounceBox2.style.backgroundImage = "url('"+request.data[0].img+"')"
  }

  if (request == "prompt:created"){
    editingCanvas.appendChild(option1);
    editingCanvas.appendChild(option2);
    editingCanvas.appendChild(option3);
  }
  if (request == "prompt:actioned"){
    editingCanvas.removeChild(option1);
    editingCanvas.removeChild(option2);
    editingCanvas.removeChild(option3);
  }
})

chrome.storage.local.get(["autoPromptDelaySetting"], function(result){
  // TRIGGERING CHECK FOR IDLE/STUCK
  idleCheckServiceId = setInterval(function(){
    chrome.storage.local.get(["disabledWaitDate"], function(result2){
      chrome.runtime.sendMessage({
        type: 'idle:check',
        INSTANCE_ID: INSTANCE_ID
      })
    })
  }, result.autoPromptDelaySetting*1000)
})


idleBackgroundJobs = setInterval(function(){
  chrome.runtime.sendMessage({
    type: 'background:jobs',
    INSTANCE_ID: INSTANCE_ID
  })
}, 5000)

function initateautocomplete(){
  chrome.runtime.sendMessage({
    type: 'autocomplete:initiated',
    INSTANCE_ID: INSTANCE_ID
  })
}

initateautocomplete()