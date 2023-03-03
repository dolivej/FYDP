//Component Export Functions
function menuCreate (ui_id, parent_ui_id, location){
    //creating basic hidden html element with unique identifier
    const menu = document.createElement('div')
    menu.setAttribute("from","penspyre")
    menu.setAttribute("type","menu")
    menu.setAttribute("ui_id", ui_id)
    menu.style.position = "absolute"
    menu.style.top = location.y + "px"
    menu.style.right = location.x + "px"
    menu.style.height = "95px"
    menu.style.zIndex = "9999"
    menu.style.width = "375px"
    menu.style.display = "none"

    menu.innerHTML = menuStyles.basic

    document.body.appendChild(menu)

    initializeMenuButtons(parent_ui_id)
}

function menuRemove (ui_id){}

function menuHide(ui_id){
    const menu = document.querySelector('[ui_id="'+ui_id+'"]')
    menu.style.display = "none"
}

function menuShow (ui_id){
    const menu = document.querySelector('[ui_id="'+ui_id+'"]')
    menu.style.display = "block"
}

var Menu = {
    create: menuCreate,
    remove: menuRemove,
    hide: menuHide,
    show: menuShow
}

//helper functions
function initializeMenuButtons(parent_ui_id){
    const menuTitle = document.getElementById("menuTitle")

    const writingPromptMenuButton = document.getElementById("writingPromptMenuButton")
    writingPromptMenuButton.style.fill = "#9747FF"  

    const settingsMenuButton = document.getElementById("settingsMenuButton")
    settingsMenuButton.style.fill = "#AEB4CE"

    writingPromptMenuButton.addEventListener('click',function(e){
        writingPromptMenuButton.style.fill = "#9747FF"
        settingsMenuButton.style.fill = "#AEB4CE"
        menuTitle.innerHTML = "Writing Prompts"
        Settings.hide("settings-1")
    })

    settingsMenuButton.addEventListener('click',function(e){
        writingPromptMenuButton.style.fill = "#AEB4CE"
        settingsMenuButton.style.fill = "#9747FF"
        menuTitle.innerHTML = "Settings"
        LoadingScreen.hide("loadingScreen-1")
        Settings.show("settings-1")
    })

    const closeSidebarMenuButton = document.getElementById("closeSidebarMenuButton")
    closeSidebarMenuButton.addEventListener('click',function(e){
        Sidebar.hide(parent_ui_id)
        Menu.hide("menu-1")
    })
}