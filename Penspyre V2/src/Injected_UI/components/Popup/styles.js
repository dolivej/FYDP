var popupBasic = `
<div style="width: 220px; height: 270px; border-radius: 10px; border: 2px solid #9747FF; background-color:white; box-shadow: 0px 6px 9px -2px rgba(0,0,0,0.21); margin-left:auto; margin-right:auto; font-family:Roboto,Arial;">
  <p style="margin-left:15%; margin-right:auto; padding-top:10px; font-weight:bold; font-size:24px; color: #9747FF">Are You Stuck?</p>
  <div id="openPromptButton" style="background-color: #9747FF; padding: 10px; width: 125px; font-weight:bold; color: white; border-radius: 10px; margin-left: 18%; font-size: 18px; margin-top: 10px; cursor:pointer">
    <p style="margin: 0px; margin-bottom: 5px">Yes!</p>
    <p style="margin: 0px;">Open InspoGen</p>
  </div>
  
  <div id="closePromptButton" style="background-color: #515151; padding: 10px; width: 125px; font-weight:bold; color: white; border-radius: 10px; margin-left: 18%; font-size: 18px; margin-top: 10px; cursor:pointer">
    <p style="margin: 0px; margin-bottom: 5px">Nope.</p>
    <p style="margin: 0px;">Just Thinking</p>
  </div>
</div>
`

var popupStyles = {
    basic:popupBasic,
}