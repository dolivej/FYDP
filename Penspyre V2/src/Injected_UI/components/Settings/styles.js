var settingsBasic = `
<div id="settingstab-inner-contiainer" style="width:100%; height:100%; background-color: white; z-index: 999999;">
    <div style="border: 2px solid #9747FF; width:315px; border-radius:10px; box-shadow: 2px 4px 4px 0px rgba(0,0,0,0.68); padding:20px; margin-top:20px; font-family:Roboto, Arial; margin-left:auto; margin-right:auto">
    <div style="display: flex;">
        <p style="font-family:Roboto, Arial; font-weight:bold; font-size:18px">Auto-Prompt Popup:</p>
        <p id="promptSettingStatus" style="font-family:Roboto, Arial; font-weight:bold; font-size:18px; color: #9747FF; margin-left:10px">ENABLED</p>
    </div>
    <div id="promptSettingContext" style="display: flex;">
        <p style="margin-top: 0px; margin-bottom:0px">Prompt if idle for:</p>
        <input style="margin-left:10px; width:35px" type="number" id="idleDuration" name="idleDuration"
            min="1" max="25" value="1"/>
        <span style="margin-left:10px;">minutes</span>
    </div>
        <div id="disableButton" style="margin-top:10px; background-color: #9747FF; padding:10px; color:white; border-radius:10px; cursor: pointer; width: 50px; user-select:none;">Disable</div>
    </div>
</div>
`

var settingsBasic = {
    basic:settingsBasic
}