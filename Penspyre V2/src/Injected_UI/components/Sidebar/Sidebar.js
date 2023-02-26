//Component Export Functions
function sidebarCreate (ui_id, location){
    //creating basic hidden html element with unique identifier
    const sidebar = document.createElement('div')
    sidebar.setAttribute("from","penspyre")
    sidebar.setAttribute("type","sidebar")
    sidebar.setAttribute("ui_id", ui_id)
    sidebar.style.position = "absolute"
    sidebar.style.bottom = location.y + "px"
    sidebar.style.right = location.x + "px"
    sidebar.style.height = "100%"
    sidebar.style.width = "375px"
    sidebar.style.display = "none"
    sidebar.innerHTML = sidebarStyles.basic

    document.body.appendChild(sidebar)

    //setting state for this element
    sidebar.setAttribute("open", "false")
}

function showSidebar (ui_id){
    const sidebar = document.querySelector('[ui_id="'+ui_id+'"]')
    sidebar.style.display = "block"
    sidebarStylesForDocs("show",sidebar)

    //updating state
    sidebar.setAttribute("open", "true")

    //updating prompt heights
    const promptTextArea = document.getElementById("promptTextArea")
    promptTextArea.style.height = 0;
    promptTextArea.style.height = (promptTextArea.scrollHeight) + "px";
    Prompt.updateHeight("prompt-1")
    Message.updateHeight()
}

function hideSidebar (ui_id){
    const sidebar = document.querySelector('[ui_id="'+ui_id+'"]')
    sidebar.style.display = "none"
    sidebarStylesForDocs("hide",sidebar)

    //updating state
    sidebar.setAttribute("open", "false")
}

function isSidebarVisible (ui_id){
    const sidebar = document.querySelector('[ui_id="'+ui_id+'"]')
    return(sidebar.style.display == "block")
}

function sidebarRemove (ui_id){}

var Sidebar = {
    create: sidebarCreate,
    show: showSidebar,
    hide: hideSidebar,
    remove: sidebarRemove,
    isVisible: isSidebarVisible
}

//helper functions

function sidebarStylesForDocs(type,sidebar){
    if(type == "show"){
        sidebar.classList.add('docs-companion-sidebar')
        sidebar.style.width = "375px"
    }else{
        sidebar.classList.remove('docs-companion-sidebar')
        sidebar.style.width = "375px" 
    }
}