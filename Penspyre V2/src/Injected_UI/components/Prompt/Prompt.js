//Component Export Functions
function promptCreate (ui_id, parent_ui_id){
    //creating basic hidden html element with unique identifier
    const prompt = document.createElement('div')
    prompt.setAttribute("from","penspyre")
    prompt.setAttribute("type","ideaSettings")
    prompt.setAttribute("ui_id", ui_id)
    prompt.innerHTML = promptStyles.basic
    prompt.style.paddingTop = "20px"
    prompt.style.marginLeft = "16px"
    prompt.style.display = "none"

    if(ui_id == "prompt-3"){
        prompt.style.marginBottom = "60px" 
    }

    const sidebar = document.querySelector('[ui_id="'+parent_ui_id+'"]').children[0]
    sidebar.appendChild(prompt)
    initializePrompt(ui_id)
}

function promptRemove (ui_id){
}

function promptSetValue (ui_id, promptContext){
    const prompt = document.querySelector('[ui_id="'+ui_id+'"]')
    if(promptContext.text !== ""){
        const imageContainer = GetElementInsideContainer(ui_id,"promptImageContainer")
        const textContainer = GetElementInsideContainer(ui_id,"promptTextContainer")
        const imageFull = GetElementInsideContainer(ui_id,"promptImageFull")
        const promptTextArea = GetElementInsideContainer(ui_id,"promptTextArea")
        const editButton = GetElementInsideContainer(ui_id,"editButton")
        const copyButton = GetElementInsideContainer(ui_id,"copyButton")
        
        textContainer.style.height = 'auto';
        imageContainer.style.height = 'auto';
        
        if(promptContext.image !== ""){
            imageFull.setAttribute("src", promptContext.image)
            imageContainer.style.display = "block"
        }else{
            imageContainer.style.display = "none" 
        }

        prompt.style.display = "block"
        setText(promptTextArea, promptContext.text)
        resetEdit(ui_id)
        analyzePromptText(ui_id)
    }else{
        prompt.style.display = "none"
    }
}

var Prompt = {
    create: promptCreate,
    remove: promptRemove,
    updateHeight: calculateHeight,
    setValue: promptSetValue
}

//Component Helper Functions
function initializePrompt(ui_id){
    const promptTextArea = GetElementInsideContainer(ui_id,"promptTextArea")
    const promptImageContainer = GetElementInsideContainer(ui_id,"promptImageContainer")
    const promptTextContainer = GetElementInsideContainer(ui_id,"promptTextContainer")
    const editButton = GetElementInsideContainer(ui_id,"editButton")
    const copyButton = GetElementInsideContainer(ui_id,"copyButton")
    const textCloseButton = GetElementInsideContainer(ui_id,"promptTextClose")
    const imageCloseButton = GetElementInsideContainer(ui_id,"promptImageClose")
    promptTextArea.addEventListener("input", function (e) {
        promptTextArea.style.height = 0;
        promptTextArea.style.height = (promptTextArea.scrollHeight) + "px";
    });
    textCloseButton.addEventListener("click", function (e) {
        promptTextContainer.style.height = 0;
    });
    imageCloseButton.addEventListener("click", function (e) {
        promptImageContainer.style.height = 0;
    });
    editButton.addEventListener('click',function(e){
        var isEditing = editButton.getAttribute("isEditing")

        if(isEditing == "True"){
            editButton.innerHTML = "Edit"
            editButton.removeAttribute("isEditing")
            promptTextArea.setAttribute("readonly","")
            promptTextArea.style.borderWidth= "0px"
            analyzePromptText(ui_id)
        }else{
            editButton.innerHTML = "Finish"
            editButton.setAttribute("isEditing","True")
            promptTextArea.removeAttribute("readonly")
            promptTextArea.style.borderWidth= "2px"
        }                       
    })

    copyButton.addEventListener('click',function(e){
    navigator.clipboard.writeText(promptTextArea.value); 
    IdeaSettings.incrementCopyAmount(promptTextArea.value.length)
    copyButton.innerHTML = "Copied!"
    
    setTimeout(() => {
        copyButton.innerHTML = "Copy"
    }, "4000")
    })

    const plagarismBox = GetElementInsideContainer(ui_id,"plagarismBox")
    const plagarismToolTip = GetElementInsideContainer(ui_id,"plagarismToolTip")
    const plagarismMessage = GetElementInsideContainer(ui_id,"plagarismMessage")
    const plagarismIcon = GetElementInsideContainer(ui_id,"plagarismIcon")
    const plagarismDetails = GetElementInsideContainer(ui_id,"plagarismDetails")

    //analyzing
    plagarismToolTip.innerHTML = "Analysis in process..."
    plagarismMessage.innerHTML = "analyzing..."

    plagarismBox.style.color = "#DBDBDB"
    plagarismBox.style.cursor = "help"
    plagarismBox.style.borderColor = "#DBDBDB"
    plagarismIcon.style.fill = "#DBDBDB"

    plagarismIcon.setAttribute("d","M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z")
    plagarismDetails.style.display = "none"


    const plagarismAction = GetElementInsideContainer(ui_id,"plagarismAction")
    const plagarismPercent = GetElementInsideContainer(ui_id,"plagarismPercent")
    const paraphrasingPercent = GetElementInsideContainer(ui_id,"paraphrasingPercent")
    const uniquenessAction = GetElementInsideContainer(ui_id,"uniquenessAction")
    const uniqnessScore = GetElementInsideContainer(ui_id,"uniqnessScore")

    // LISTENERS
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.INSTANCE_ID == INSTANCE_ID && request.type == "analyzedText:result"){

            if((Math.max(request.result.plagarismScore,request.result.paraphrasingScore) + (100-request.result.uniquenessScore))/2 < 50){
                plagarismToolTip.innerHTML = "No issues detected. Click for details."
                plagarismMessage.innerHTML = "No Issues!"
        
                plagarismBox.style.color = "#79D977"
                plagarismBox.style.cursor = "pointer"
                plagarismBox.style.borderColor = "#79D977"
                plagarismIcon.style.fill = "#79D977"
        
                plagarismIcon.setAttribute("d","M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z")
            }else if((Math.max(request.result.plagarismScore,request.result.paraphrasingScore) + (100-request.result.uniquenessScore))/2 < 80){
                plagarismToolTip.innerHTML = "This prompt can be improved. Click for details."
                plagarismMessage.innerHTML = "Weak!"

                plagarismBox.style.color = "#FCB814"
                plagarismBox.style.cursor = "pointer"
                plagarismBox.style.borderColor = "#FCB814"
                plagarismIcon.style.fill = "#FCB814"

                plagarismIcon.setAttribute("d","M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z")
            }else{
                plagarismToolTip.innerHTML = "This prompt can be improved. Click for details."
                plagarismMessage.innerHTML = "Low!"

                plagarismBox.style.color = "#FF0000"
                plagarismBox.style.cursor = "pointer"
                plagarismBox.style.borderColor = "#FF0000"
                plagarismIcon.style.fill = "#FF0000"

                plagarismIcon.setAttribute("d","M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z")
            }
           
            plagarismDetails.style.display = "none"
            plagarismBox.onclick = function(e){
                if(plagarismDetails.style.display == "none"){
                  plagarismDetails.style.display = "block"
                }else{
                  plagarismDetails.style.display = "none"
                }
            }

            plagarismAction.innerHTML = Math.max(request.result.plagarismScore,request.result.paraphrasingScore) > 50 ? "Edits Required" : "No Issues."
            plagarismPercent.innerHTML = "" + request.result.plagarismScore + "%"
            paraphrasingPercent.innerHTML = "" + request.result.paraphrasingScore + "%"
            uniquenessAction.innerHTML = (100-request.result.uniquenessScore) > 25 ? "Edits Required" : "No Issues."
            uniqnessScore.innerHTML = "" + request.result.uniquenessScore + "/100"
        }
    })
}

function analyzePromptText(ui_id){
    const plagarismBox = GetElementInsideContainer(ui_id,"plagarismBox")
    const plagarismToolTip = GetElementInsideContainer(ui_id,"plagarismToolTip")
    const plagarismMessage = GetElementInsideContainer(ui_id,"plagarismMessage")
    const plagarismIcon = GetElementInsideContainer(ui_id,"plagarismIcon")
    const plagarismDetails = GetElementInsideContainer(ui_id,"plagarismDetails")
    const promptTextArea = GetElementInsideContainer(ui_id,"promptTextArea")

    //analyzing
    plagarismToolTip.innerHTML = "Analysis in process..."
    plagarismMessage.innerHTML = "analyzing..."

    plagarismBox.style.color = "#DBDBDB"
    plagarismBox.style.cursor = "help"
    plagarismBox.style.borderColor = "#DBDBDB"
    plagarismIcon.style.fill = "#DBDBDB"

    plagarismIcon.setAttribute("d","M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z")
    plagarismDetails.style.display = "none"
    plagarismBox.onclick = function(e){}


    chrome.runtime.sendMessage({
        type: 'analyzeText',
        INSTANCE_ID: INSTANCE_ID,
        promptId: ui_id,
        text: promptTextArea.value
    })
}

function resetEdit(ui_id){
    const promptTextArea = GetElementInsideContainer(ui_id,"promptTextArea")
    const editButton = GetElementInsideContainer(ui_id,"editButton")
    const copyButton = GetElementInsideContainer(ui_id,"copyButton")
    editButton.innerHTML = "Edit"
    editButton.removeAttribute("isEditing")
    promptTextArea.setAttribute("readonly","")
    promptTextArea.style.borderWidth= "0px"
    copyButton.innerHTML = "Copy"
}

function setText(promptTextArea,text){
    promptTextArea.value = text
    promptTextArea.style.height = 0;
    promptTextArea.style.height = (promptTextArea.scrollHeight) + "px";
}


//Component Helper Functions
function calculateHeight(ui_id){
    const promptSettings = document.querySelector('[ui_id="ideasettings-1"]')
    const toggleTab = document.querySelector('[ui_id="imageToggle-1"]')

    // const prompt = document.querySelector('[ui_id="'+ui_id+'"]')
    // prompt.style.height = getOffset(promptSettings).top + getOffset(toggleTab).top + 60 + "px"
}

function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY
    };
  }

function GetElementInsideContainer(containerID, childID) {
    var elm = {};
    var elms = document.querySelector('[ui_id="'+containerID+'"]').getElementsByTagName("*");
    for (var i = 0; i < elms.length; i++) {
        if (elms[i].id === childID) {
            elm = elms[i];
            break;
        }
    }

    return elm;
}

