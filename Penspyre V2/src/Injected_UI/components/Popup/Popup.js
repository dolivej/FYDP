//Component Export Functions
function popupCreate (ui_id , location, INSTANCE_ID){
    //creating basic hidden html element with unique identifier
    const popup = document.createElement('div')
    popup.setAttribute("from","penspyre")
    popup.setAttribute("type","launchButton")
    popup.setAttribute("ui_id", ui_id)
    popup.innerHTML = popupStyles.basic
    popup.style.position = "fixed"
    popup.style.bottom = location.y + "px"
    popup.style.right = location.x + "px"
    popup.style.display = "none"

    document.body.appendChild(popup)
    initializePopup(ui_id, INSTANCE_ID)
}

function showPopup (ui_id){
    const popup = document.querySelector('[ui_id="'+ui_id+'"]')
    popup.style.display = "block"
}

function hidePopup (ui_id){
    const popup = document.querySelector('[ui_id="'+ui_id+'"]')
    popup.style.display = "none"
}

function isPopupVisible (ui_id){
    const popup = document.querySelector('[ui_id="'+ui_id+'"]')
    return(popup.style.display == "block")
}

function popupRemove (ui_id){

}

var Popup = {
    create: popupCreate,
    show: showPopup,
    hide: hidePopup,
    remove: popupRemove,
    isVisible: isPopupVisible
}

//Component Helper Functions
function initializePopup(ui_id, INSTANCE_ID){
    const openPromptButton = document.getElementById("openPromptButton")

    openPromptButton.addEventListener('mouseover', function(event){
    openPromptButton.style.boxShadow = "0px 6px 9px -2px rgba(0,0,0,0.21)"
    });

    openPromptButton.addEventListener('mouseleave', function(event){
    openPromptButton.style.boxShadow = "0px 6px 9px -2px rgba(0,0,0,0)"
    });

    openPromptButton.addEventListener('mousedown', function(event){
    openPromptButton.style.boxShadow = "0px 6px 9px -2px rgba(0,0,0,0)"
    });

    openPromptButton.addEventListener('click', function(event){
    openPromptButton.style.boxShadow = "0px 6px 9px -2px rgba(0,0,0,0)"
        hidePopup(ui_id)
        Sidebar.show("sidebar-1")
    });


    const closePromptButton = document.getElementById("closePromptButton")

    closePromptButton.addEventListener('mouseover', function(event){
    closePromptButton.style.boxShadow = "0px 6px 9px -2px rgba(0,0,0,0.21)"
    });

    closePromptButton.addEventListener('mouseleave', function(event){
    closePromptButton.style.boxShadow = "0px 6px 9px -2px rgba(0,0,0,0)"
    });

    closePromptButton.addEventListener('mousedown', function(event){
    closePromptButton.style.boxShadow = "0px 6px 9px -2px rgba(0,0,0,0)"
    });

    closePromptButton.addEventListener('click', function(event){
    closePromptButton.style.boxShadow = "0px 6px 9px -2px rgba(0,0,0,0)"
        Settings.setIgnoreInterval(INSTANCE_ID)
        hidePopup(ui_id)
    });
}