//Component Export Functions
function ideaSettingsCreate (ui_id, parent_ui_id, TYPE, INSTANCE_ID, checkGenerationStyleFunction, image_toggle_ui_id){
    //creating basic hidden html element with unique identifier
    const ideaSettings = document.createElement('div')
    ideaSettings.setAttribute("from","penspyre")
    ideaSettings.setAttribute("type","ideaSettings")
    ideaSettings.setAttribute("ui_id", ui_id)
    ideaSettings.innerHTML = ideaSettingsStyles.basicUi
    ideaSettings.style.paddingTop = "20px"
    ideaSettings.style.marginLeft = "15px"

    const sidebar = document.querySelector('[ui_id="'+parent_ui_id+'"]').children[0]
    sidebar.appendChild(ideaSettings)

    //setting additional required function
    document.getElementById("options").onclick = function(e){
        document.getElementById("options-view-button").checked = false;

        var selectedValue = document.querySelector('input[name="promptType"]:checked').value
        showSection(selectedValue)
    }
   
    document.getElementById("options2").onclick = function(e){
        document.getElementById("options-view-button2").checked = false;
    }
   
    document.getElementById("options3").onclick = function(e){
        document.getElementById("options-view-button3").checked = false;
    }
   
    document.getElementById("options4").onclick = function(e){
        document.getElementById("options-view-button4").checked = false;
    }

    document.getElementById("generatePromptButton").onmouseover = function(e){
        var button = document.getElementById("generatePromptButton");
        button.style.boxShadow = "0px 0px 4px 2px rgba(0,0,0,0.32)";
    }

    document.getElementById("generatePromptButton").onmouseleave = function(e){
        var button = document.getElementById("generatePromptButton");
        button.style.boxShadow = "0px 0px 4px 2px rgba(0,0,0,0)";
    }

    document.getElementById("generatePromptButton").onmousedown = function(e){
        var button = document.getElementById("generatePromptButton");
        button.style.boxShadow = "0px 0px 4px 2px rgba(0,0,0,0)";
    }

    document.getElementById("generatePromptButton").onclick = function(e){
        var button = document.getElementById("generatePromptButton");
        button.style.boxShadow = "0px 0px 4px 2px rgba(0,0,0,0.32)";

        const promptImageContainer = document.getElementById("promptImageContainer")
        const promptTextContainer = document.getElementById("promptTextContainer")

        if(promptImageContainer.style.height == 0 || promptTextContainer.style.height == 0) {
            promptTextContainer.style.height = 'auto';
            promptImageContainer.style.height = 'auto';
        }

        setTimeout(function(){
            console.log("Executed after 1 second");
        }, 3000);
        
        if(document.querySelector('input[name="promptType"]:checked') == null){
            alert("Please select Prompt Type")
        }else{
            var selectedValue = document.querySelector('input[name="promptType"]:checked').value
            generate(selectedValue, TYPE, INSTANCE_ID, checkGenerationStyleFunction, parent_ui_id, image_toggle_ui_id)
        }
    }
}

function hideIdeaSettings (ui_id){
    const ideaSettings = document.querySelector('[ui_id="'+ui_id+'"]')
    ideaSettings.style.display = "none"
}

function showIdeaSettings (ui_id){
    const ideaSettings = document.querySelector('[ui_id="'+ui_id+'"]')
    ideaSettings.style.display = "block"
}

function ideaSettingsCreateRemove (ui_id){
}

var IdeaSettings = {
    create: ideaSettingsCreate,
    remove: ideaSettingsCreateRemove,
    hide: hideIdeaSettings,
    show: showIdeaSettings,
    incrementCopyAmount: incrementCopyAmount
}

//Component Helper Functions
function showSection(section){
    if(section == "continue"){
        document.getElementById("LinkContent").style.display = "none";
        document.getElementById("ListContent").style.display = "none";
        document.getElementById("DescribeContent").style.display = "none";
        document.getElementById("ContinueContent").style.display = "block"; 
    }else if(section == "link"){
        document.getElementById("ListContent").style.display = "none";
        document.getElementById("DescribeContent").style.display = "none";
        document.getElementById("ContinueContent").style.display = "none";
        document.getElementById("LinkContent").style.display = "block"; 
    }else if(section == "list"){
        document.getElementById("LinkContent").style.display = "none";
        document.getElementById("DescribeContent").style.display = "none";
        document.getElementById("ContinueContent").style.display = "none"; 
        document.getElementById("ListContent").style.display = "block";
    }else if(section == "describe"){
        document.getElementById("LinkContent").style.display = "none";
        document.getElementById("ListContent").style.display = "none";
        document.getElementById("ContinueContent").style.display = "none"; 
        document.getElementById("DescribeContent").style.display = "block";
    }
}

function generate(section, TYPE, INSTANCE_ID, checkGenerationStyleFunction, parent_ui_id, image_toggle_ui_id){
    if(section == "continue"){
        generateContinue(TYPE, INSTANCE_ID, checkGenerationStyleFunction, parent_ui_id, image_toggle_ui_id); 
    }else if(section == "link"){
        generateLink(TYPE, INSTANCE_ID, checkGenerationStyleFunction, parent_ui_id, image_toggle_ui_id);
    }else if(section == "list"){
        generateList(TYPE, INSTANCE_ID, checkGenerationStyleFunction, parent_ui_id, image_toggle_ui_id);
    }else if(section == "describe"){
        generateDescription(TYPE, INSTANCE_ID, checkGenerationStyleFunction, parent_ui_id, image_toggle_ui_id);
    }
}

function generateContinue(TYPE, INSTANCE_ID, checkGenerationStyleFunction, parent_ui_id, image_toggle_ui_id){
    var generateData = {
        promptType : "continue",
        continueFocus : "any",
        continueTone : "any"
    }

    if(document.querySelector('input[name="continueFocus"]:checked') == null){
        alert("Please select Focus")
        return
    }else{
        generateData.continueFocus = document.querySelector('input[name="continueFocus"]:checked').value
    }

    if(document.querySelector('input[name="continueTone"]:checked') == null){
        alert("Please select Tone")
        return
    }else{
        generateData.continueTone = document.querySelector('input[name="continueTone"]:checked').value
    }

    ideaSettingsSetOnClick(generateData, TYPE, INSTANCE_ID, checkGenerationStyleFunction, parent_ui_id, image_toggle_ui_id)
}

function generateLink(TYPE, INSTANCE_ID, checkGenerationStyleFunction, parent_ui_id, image_toggle_ui_id){
    var generateData = {
        promptType : "link",
        linkText : ""
    }

    if(document.getElementById('linkText') == null || document.getElementById('linkText').value == null || document.getElementById('linkText').value == ""){
        alert("Please enter text to link to")
        return
    }else{
        generateData.linkText = document.getElementById('linkText').value
    }

    ideaSettingsSetOnClick(generateData, TYPE, INSTANCE_ID, checkGenerationStyleFunction, parent_ui_id, image_toggle_ui_id)
}

function generateList(TYPE, INSTANCE_ID, checkGenerationStyleFunction, parent_ui_id, image_toggle_ui_id){
    var generateData = {
        promptType : "list",
        listTopic : "",
        listContext : "",
    }

    if(document.getElementById('listTopic') == null || document.getElementById('listTopic').value == null || document.getElementById('listTopic').value == ""){
        alert("Please enter a list topic")
        return
    }else{
        generateData.listTopic = document.getElementById('listTopic').value
    }

    if(document.getElementById('listContext') == null || document.getElementById('listContext').value == null || document.getElementById('listContext').value == ""){
        alert("Please enter list context")
        return
    }else{
        generateData.listContext = document.getElementById('listContext').value
    }

    ideaSettingsSetOnClick(generateData, TYPE, INSTANCE_ID, checkGenerationStyleFunction, parent_ui_id, image_toggle_ui_id)
}

function generateDescription(TYPE, INSTANCE_ID, checkGenerationStyleFunction, parent_ui_id, image_toggle_ui_id){
    var generateData = {
        promptType : "describe",
        describeTopic : "",
        describeStyle : "",
    }

    if(document.getElementById('describeTopic') == null || document.getElementById('describeTopic').value == null || document.getElementById('describeTopic').value == ""){
        alert("Please enter what to describe")
        return
    }else{
        generateData.describeTopic = document.getElementById('describeTopic').value
    }

    if(document.querySelector('input[name="describeStyle"]:checked') == null){
        alert("Please select the style of description")
        return
    }else{
        generateData.describeStyle = document.querySelector('input[name="describeStyle"]:checked').value
    }

    ideaSettingsSetOnClick(generateData, TYPE, INSTANCE_ID, checkGenerationStyleFunction, parent_ui_id, image_toggle_ui_id)
}

function ideaSettingsSetOnClick (generateData, TYPE, INSTANCE_ID, checkGenerationStyleFunction, parent_ui_id, image_toggle_ui_id){
    generateData["isTextAndImages"] = checkGenerationStyleFunction(image_toggle_ui_id)
    Prompt.setValue("prompt-1",{text: "", image: ""})
    Prompt.setValue("prompt-2",{text: "", image: ""})
    Prompt.setValue("prompt-3",{text: "", image: ""})

    //checking amount of copies words
    var currentDate = new Date()
    var diffMs = (currentDate - previousDate); 
    var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
    if(diffMins!==0 && copyAmount/diffMins > 50){
        previousDate = currentDate;
        copyAmount = 0;
        Message.show("message-1",function(){
            Message.hide("message-1")
            LoadingScreen.show("loadingScreen-1")

            if(TYPE == "docs"){
                chrome.runtime.sendMessage({
                    type: 'docs:generate',
                    INSTANCE_ID: INSTANCE_ID,
                    generateData: generateData
                })
            }
        
            // LISTENERS
            chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
                if (request.INSTANCE_ID == INSTANCE_ID && request.type == "generated:result"){
                    LoadingScreen.hide("loadingScreen-1")
                    Prompt.setValue("prompt-1",{text: request.prompts[0].text, image: request.prompts[0].image})
                    Prompt.setValue("prompt-2",{text: request.prompts[1].text, image: request.prompts[1].image})
                    Prompt.setValue("prompt-3",{text: request.prompts[2].text, image: request.prompts[2].image})
                }
            })
        },{title:"Remember:",body:"Inspogen is a tool that should be used for inspiration not writing entire works. Your story is ultimately in your hands."})
    }else{
        LoadingScreen.show("loadingScreen-1")

        if(TYPE == "docs"){
            chrome.runtime.sendMessage({
                type: 'docs:generate',
                INSTANCE_ID: INSTANCE_ID,
                generateData: generateData
            })
        }
    
        // LISTENERS
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.INSTANCE_ID == INSTANCE_ID && request.type == "generated:result"){
                LoadingScreen.hide("loadingScreen-1")
                Prompt.setValue("prompt-1",{text: request.prompts[0].text, image: request.prompts[0].image})
                Prompt.setValue("prompt-2",{text: request.prompts[1].text, image: request.prompts[1].image})
                Prompt.setValue("prompt-3",{text: request.prompts[2].text, image: request.prompts[2].image})
            }
        })
    }
}



//keeping track of copied amount
var previousDate = new Date();
var copyAmount = 0;


function incrementCopyAmount(amount){
    copyAmount = copyAmount + amount;
}