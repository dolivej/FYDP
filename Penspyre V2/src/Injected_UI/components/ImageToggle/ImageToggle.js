//Component Export Functions
function imageToggleCreate (ui_id, parent_ui_id){
  //creating basic hidden html element with unique identifier
  const imageToggle = document.createElement('div')
  imageToggle.setAttribute("from","penspyre")
  imageToggle.setAttribute("type","menu")
  imageToggle.setAttribute("ui_id", ui_id)
  imageToggle.innerHTML = imageToggleStyles.basic

  const sidebar = document.querySelector('[ui_id="'+parent_ui_id+'"]').children[0]
  sidebar.appendChild(imageToggle)

  initializeImageToggle()
}

function checkGenerationStyleFunction (ui_id){
  const imageToggleSetting = document.getElementById("imageToggleSetting")
  return imageToggleSetting.checked
}

function imageToggleRemove (ui_id){}

var ImageToggle = {
  create: imageToggleCreate,
  remove: imageToggleRemove,
  checkGenerationStyleFunction: checkGenerationStyleFunction
}

//helper functions
function initializeImageToggle(){
  const imageToggleSetting = document.getElementById("imageToggleSetting")
  const imageText = document.getElementById("imageText")

  imageText.style.color = "#76798D"
  imageText.style.fontWeight = "normal"
  
  const textOnlyText = document.getElementById("textOnlyText")
  textOnlyText.style.color = "#9747FF"
  textOnlyText.style.fontWeight = "bold"
  
  imageToggleSetting.addEventListener('change',function(e){
    if(!imageToggleSetting.checked){
      imageText.style.color = "#76798D"
      imageText.style.fontWeight = "normal"
      textOnlyText.style.color = "#9747FF"
      textOnlyText.style.fontWeight = "bold"
    }else{
      imageText.style.color = "#9747FF"
      imageText.style.fontWeight = "bold"
      textOnlyText.style.color = "#76798D"
      textOnlyText.style.fontWeight = "normal"
    }
  })
}