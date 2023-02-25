//Component Export Functions
function loadingScreenCreate (ui_id, parent_ui_id){
    //creating basic hidden html element with unique identifier
    const loadingScreen = document.createElement('div')
    loadingScreen.setAttribute("from","penspyre")
    loadingScreen.setAttribute("type","loadingScreen")
    loadingScreen.setAttribute("ui_id", ui_id)
    loadingScreen.innerHTML = loadingScreenStyles.basic
    loadingScreen.style.display = "none"

    const sidebar = document.querySelector('[ui_id="'+parent_ui_id+'"]').children[0]
    sidebar.appendChild(loadingScreen)
}

function loadingScreenRemove (ui_id){}

function loadingScreenShow (ui_id){
    const loadingScreen = document.querySelector('[ui_id="'+ui_id+'"]')
    loadingScreen.style.display = "block"
}

function loadingScreenHide (ui_id){
    const loadingScreen = document.querySelector('[ui_id="'+ui_id+'"]')
    loadingScreen.style.display = "none"
}


var LoadingScreen = {
    create: loadingScreenCreate,
    remove: loadingScreenRemove,
    show: loadingScreenShow,
    hide: loadingScreenHide
}
