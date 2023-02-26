var imageToggleBasic = `
<div style="position:absolute; bottom:0px; width: 375px; height:60px; background-color:white; box-shadow: 0px -6px 9px -2px rgba(0,0,0,0.21); margin-left:auto; margin-right:auto; font-family: Roboto, Arial; margin-top:auto">
  <div style="display:flex;padding:15px; ">
  <div style="margin-right: auto; margin-left:auto; text-align: center;">
    <p id="textOnlyText" style="margin:0px; margin-left:auto; margin-right:auto;">Text Only</p>
    <p style="margin:0px; margin-left:auto; margin-right:auto; color: #76798D;">FASTER</p>
  </div>
    
    <label class="switch" style="margin-top:0px">
      <input id="imageToggleSetting" type="checkbox">
      <span class="slider round"></span>
    </label>
    
    <div style="margin-right: auto; margin-left:auto; text-align: center; margin-bottom: 5px">
    <p id="imageText" style="margin:0px; margin-left:auto; margin-right:auto;">Text & Images</p>
    <p style="margin:0px; margin-left:auto; margin-right:auto; color: #76798D">SLOWER</p>
  </div>

  </div>
</div>
`

var imageToggleStyles = {
    basic:imageToggleBasic
}