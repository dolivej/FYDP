//Component Export Functions
function launchButtonCreate (ui_id , location){
    //creating basic hidden html element with unique identifier
    const launchButton = document.createElement('div')
    launchButton.setAttribute("from","penspyre")
    launchButton.setAttribute("type","launchButton")
    launchButton.setAttribute("ui_id", ui_id)
    launchButton.innerHTML = launchButtonStyles.basic
    launchButton.style.position = "fixed"
    launchButton.style.bottom = location.y + "px"
    launchButton.style.right = location.x + "px"
    launchButton.style.cursor = "pointer"

    launchButton.addEventListener('mouseover', function(){launchButtonOnHover(launchButton)});
    launchButton.addEventListener('mouseleave', function(){launchButtonOnMouseLeave(launchButton)});
    launchButton.addEventListener('mousedown', function(){launchButtonOnMouseDown(launchButton)});
    launchButton.addEventListener('mouseup', function(){launchButtonOnMouseUp(launchButton)});

    document.body.appendChild(launchButton)

    //setting state for this element
    launchButton.setAttribute("mouse", "static")
}

function launchButtonSetOnClick (ui_id, TYPE, INSTANCE_ID, sidebar_ui_id){
    const launchButton = document.querySelector('[ui_id="'+ui_id+'"]')

    if(TYPE == "docs"){
        launchButton.addEventListener('mouseup', function(){
            launchButtonOnMouseUp(launchButton)
            launchButtonOnClickDocs(launchButton,INSTANCE_ID)
        });
    }

    // LISTENERS
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.INSTANCE_ID == INSTANCE_ID && request.type == "docs:authenticate:success"){
            Sidebar.show(sidebar_ui_id)
            Menu.show("menu-1")
            launchButtonOnMouseLeave(launchButton)
        }
    })
  
}

function launchButtonRemove (ui_id){

}

var LaunchButton = {
    create: launchButtonCreate,
    setOnClick: launchButtonSetOnClick,
    remove: launchButtonRemove
}

//Component Helper Functions
function launchButtonOnHover (target){
    if(target != undefined && target.getAttribute("mouse") !== "hovered" && target.getAttribute("mouse") !== "clicked"){
        target.innerHTML = launchButtonStyles.hover
        target.setAttribute("mouse", "hovered")
    }
}

function launchButtonOnMouseLeave (target){
    if(target != undefined){
        target.innerHTML = launchButtonStyles.basic
        target.setAttribute("mouse", "static")
    }
}

function launchButtonOnMouseDown (target){
    if(target != undefined && target.getAttribute("mouse") !== "clicked"){
        target.innerHTML = launchButtonStyles.basic
        target.setAttribute("mouse", "clicked")
    }
}

function launchButtonOnMouseUp (target){
    if(target != undefined){
        target.innerHTML = launchButtonStyles.basic
        target.setAttribute("mouse", "static")
    }
}

function launchButtonOnClickDocs(target){ 
    if(target != undefined){
        chrome.runtime.sendMessage({
            type: 'docs:authenticate',
            INSTANCE_ID: INSTANCE_ID
        })
    }
}