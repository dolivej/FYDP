//Component Export Functions
function messageCreate (ui_id, parent_ui_id){
    //creating basic hidden html element with unique identifier
    const message = document.createElement('div')
    message.setAttribute("from","penspyre")
    message.setAttribute("type","message")
    message.setAttribute("ui_id", ui_id)
    message.innerHTML = messageStyles.basic
    message.style.paddingTop = "20px"
    message.style.marginLeft = "16px"
    message.style.display = "none"

    const sidebar = document.querySelector('[ui_id="'+parent_ui_id+'"]').children[0]
    sidebar.appendChild(message)
}

function messageRemove (ui_id){
}

function messageUpdateHeight(){
    const messageText = document.getElementById("messageText")
    messageText.style.height = 0;
    messageText.style.height = (messageText.scrollHeight) + "px";

    const messageText2 = document.getElementById("messageText2")
    messageText2.style.height = 0;
    messageText2.style.height = (messageText2.scrollHeight) + "px";
}

function messageSetMessage (content){
    const messageText = document.getElementById("messageText")
    messageText.addEventListener("input", function (e) {
      messageText.style.height = 0;
      messageText.style.height = (messageText.scrollHeight) + "px";
    });
    
    messageText.value = content.title
    messageText.style.height = 0;
    messageText.style.height = (messageText.scrollHeight) + "px";
    
    
    const messageText2 = document.getElementById("messageText2")
    messageText2.addEventListener("input", function (e) {
      messageText2.style.height = 0;
      messageText2.style.height = (messageText2.scrollHeight) + "px";
    });
    
    messageText2.value = content.body
    messageText2.style.height = 0;
    messageText2.style.height = (messageText2.scrollHeight) + "px";
}

function messageSetOnclick(onClick){
    const editButton = document.getElementById("understandButton")

    editButton.addEventListener('click',function(e){
        onClick()                 
    })
}

function messageShow(ui_id, onClick, content){
    const message = document.querySelector('[ui_id="'+ui_id+'"]')
    message.style.display = "block"
    messageSetMessage(content)
    messageSetOnclick(onClick)
}

function messageHide(ui_id){
    const message = document.querySelector('[ui_id="'+ui_id+'"]')
    message.style.display = "none"
}


var Message = {
    create: messageCreate,
    remove: messageRemove,
    show: messageShow,
    hide: messageHide,
    updateHeight: messageUpdateHeight,
}

//Component Helper Functions


