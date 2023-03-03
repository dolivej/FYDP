var promptBasic = `
<div id="promptImageContainer" style="overflow: hidden; width: 300px; height:300px; background-color:white; box-shadow: 0px 6px 9px -2px rgba(0,0,0,0.21); margin-left:auto; margin-right:auto; font-family: Roboto, Arial; margin-bottom: 10px; border-radius:10px;">
<span id="promptImageClose" style="float:right; text-shadow:
-1px -1px 5px #FFFFFF,  
 1px -1px 5px #FFFFFF,
 -1px 1px 5px #FFFFFF,
  1px 1px 5px #FFFFFF; font-size:30px; height: 0px; position: relative; z-index: 999;" aria-hidden="true">&times;</span>
<img id="promptImageFull" style="position: relative; z-index: 0; width:300px; height: 300px; border-radius: 10px; object-fit: cover" src="https://www.asc-csa.gc.ca/images/blogue/2018/2018-06-29-13-superbes-sites-facebook.jpg"/>
</div>

<div id="promptTextContainer" style="overflow: hidden; width: 300px; background-color:white; box-shadow: 0px 6px 9px -2px rgba(0,0,0,0.21); margin-left:auto; margin-right:auto; font-family: Roboto, Arial; margin-bottom: 10px; border-radius:10px">
  <span id="promptTextClose" style="float:right; font-size:30px; height: 0px;" aria-hidden="true">&times;</span>
  <textarea id="promptTextArea" style="margin:20px; margin-bottom:0px; width:84%; border-radius:10px; padding:2px; resize: none; border-width:0px; font-family: Roboto, Arial; font-size:16px; height: auto; outline: none; border-color: #B4B4B4" readonly> </textarea>
  
  <div style="display:flex; padding:20px; padding-top:10px">
    <div id="copyButton"style="background-color: #9747FF; padding:10px; border-radius: 10px; color: white; font-weight:bold; cursor:pointer; user-select:none;">Copy</div>
      <div id="editButton"style="background-color: #9747FF; padding:10px; border-radius: 10px; color: white; font-weight:bold; margin-left:10px; cursor:pointer; user-select:none;">Edit</div>
    

      <div id="plagarismBox" class="tooltip" style="background-color: white; border-radius: 10px; color: #9747FF; margin-left:auto; user-select:none; text-align:center; border: 2px solid; padding:6px; padding-top:1px; padding-bottom: 1px;">
      <span id="plagarismToolTip" class="tooltiptext"></span>
      <div style="display:flex">
         <p style="margin:0px; font-size: 14px; font-weight:bold;">Uniqueness</p>
        <svg style="height:15px; margin-left: 5px; margin-bottom: -5px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path id="plagarismIcon"/></svg>
      </div>
       <p id="plagarismMessage" style="margin:0px; font-size: 14px;"></p>
    </div>
  </div>

  <div id="plagarismDetails" style="padding:20px">
    <p style="margin:0px; font-weight: bold">Plagaraism & Paraphrasing: <b id="plagarismAction">text</b></p>
    <p>Detected <b id="plagarismPercent">0%</b> word for word plagarism and detected <b id="paraphrasingPercent">0%</b> paraphrasing.</p>
    <p style="margin:0px; font-weight: bold">Voice Uniqueness:  <b id="uniquenessAction">text</b></p>
    <p>Uniqueness score of <b id="uniqnessScore">90/100</b> (comparison to other AI generated texts)</p>
  </div>
  </div>
</div>
`

var promptStyles = {
    basic:promptBasic
}