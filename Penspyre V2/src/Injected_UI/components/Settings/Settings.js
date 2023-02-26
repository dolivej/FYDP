//Component Export Functions
function settingsCreate (ui_id, parent_ui_id, INSTANCE_ID){
    //creating basic hidden html element with unique identifier
    const settings = document.createElement('div')
    settings.setAttribute("from","penspyre")
    settings.setAttribute("type","settingsTab")
    settings.setAttribute("ui_id", ui_id)
    settings.style.position = "absolute"
    settings.style.top = "100px"
    settings.style.right = "0px"
    settings.style.height = "4000px"
    settings.style.width = "375px"
    settings.style.display = "none"
    settings.innerHTML = settingsBasic.basic

    const sidebar = document.querySelector('[ui_id="'+parent_ui_id+'"]').children[0]
    sidebar.appendChild(settings)

    initializeSettingsFunction(INSTANCE_ID)

    //setting state for this element
    settings.setAttribute("open", "false")
}

function showSettings (ui_id){
    const settings = document.querySelector('[ui_id="'+ui_id+'"]')
    settings.style.display = "block"
    IdeaSettings.hide("ideasettings-1")

    //updating state
    settings.setAttribute("open", "true")
}

function hideSettings (ui_id){
    const settings = document.querySelector('[ui_id="'+ui_id+'"]')
    settings.style.display = "none"
    IdeaSettings.show("ideasettings-1")

    //updating state
    settings.setAttribute("open", "false")
}

function settingsRemove (ui_id){}

var Settings = {
    create: settingsCreate,
    show: showSettings,
    hide: hideSettings,
    remove: settingsRemove,
    setIgnoreInterval: setIgnoreInterval
}

//helper functions and one variable
var prevWordCount = 0;
var intervalId

function initializeSettingsFunction(INSTANCE_ID){
    const disableButton = document.getElementById("disableButton")
    const promptSettingContext = document.getElementById("promptSettingContext")
    const promptSettingStatus = document.getElementById("promptSettingStatus")
    const idleDuration = document.getElementById("idleDuration")

    chrome.storage.local.get(['isDisabled','idleSetting'], function(result) {
      if(result.idleSetting == undefined){
        idleDuration.value = 1
        clearInterval(intervalId) 
        intervalId = window.setInterval(function(){
          checkIdle(INSTANCE_ID, 1*180)
        }, 60000);
      }else{
        idleDuration.value = result.idleSetting
        clearInterval(intervalId) 
        intervalId = window.setInterval(function(){
          checkIdle(INSTANCE_ID, result.idleSetting*180)
        }, result.idleSetting * 60000);
      }

      if(result.isDisabled){
        disableButton.innerHTML = "Enable"
        disableButton.setAttribute("isEnabled","True")
        disableButton.style.width = "50px"
        promptSettingContext.style.display = "none"
        promptSettingStatus.innerHTML = "DISABLED"
        clearInterval(intervalId) 
      }
    });

    disableButton.addEventListener('click',function(e){
      var isEnabled = disableButton.getAttribute("isEnabled")
    
      if(isEnabled == "True"){
        disableButton.innerHTML = "Disable"
        disableButton.removeAttribute("isEnabled")
        disableButton.style.width = "50px"
        promptSettingContext.style.display = "flex"
        promptSettingStatus.innerHTML = "ENABLED"
        chrome.storage.local.set({isDisabled: false, idleSetting: idleDuration.value}, function() {});
        clearInterval(intervalId) 
        intervalId = window.setInterval(function(){
          checkIdle(INSTANCE_ID, idleDuration.value*180)
        }, idleDuration.value * 60000);
      }else{
        disableButton.innerHTML = "Enable"
        disableButton.setAttribute("isEnabled","True")
        disableButton.style.width = "50px"
        promptSettingContext.style.display = "none"
        promptSettingStatus.innerHTML = "DISABLED"
        chrome.storage.local.set({isDisabled: true, idleSetting: idleDuration.value}, function() {});
        clearInterval(intervalId) 
      }                       
    }) 

    idleDuration.addEventListener('change', (event) => {
      chrome.storage.local.set({isDisabled: false, idleSetting: idleDuration.value}, function() {});
      clearInterval(intervalId) 
        intervalId = window.setInterval(function(){
          checkIdle(INSTANCE_ID, idleDuration.value*180)
        }, idleDuration.value * 60000);
    });

    // LISTENERS
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.INSTANCE_ID == INSTANCE_ID && request.type == "idlecheck"){
          chrome.storage.local.get(['isDisabled'], function(result) {
            if(result.isDisabled == false){
              Popup.show("popup-1")
            }
            prevWordCount = request.prevWordCount
          });
        }
    })
}

function setIgnoreInterval(INSTANCE_ID){
  const idleDuration = document.getElementById("idleDuration")
  clearInterval(intervalId) 
  intervalId = window.setInterval(function(){
    checkIdle(INSTANCE_ID, (idleDuration.value+10)*180)
  }, (idleDuration.value+10) * 60000);
}

function checkIdle(INSTANCE_ID, differenceAmount){
  if(!Sidebar.isVisible("sidebar-1") && !Popup.isVisible("popup-1")){
    chrome.runtime.sendMessage({
        type: 'docs:idlecheck',
        INSTANCE_ID: INSTANCE_ID,
        prevWordCount: prevWordCount,
        differenceAmount: differenceAmount,
    })
  }
}