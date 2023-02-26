var menuBasic = `
<div style="width: 375px; height:95px; background-color:white; box-shadow: 0px 6px 9px -2px rgba(0,0,0,0.21); margin-left:auto; margin-right:auto; font-family: Roboto, Arial; margin-bottom: 10px; user-select: none;">
  <div style="display:flex; padding:20px;">
 <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="8" cy="8" r="8" fill="#8777D9"/>
<path d="M7.09527 8.10503L10.4639 5.76147L10.9767 6.32491L8.32716 9.4586L7.09527 8.10503ZM6.08218 8.2838L8.05406 10.4504C8.09489 10.4909 8.14382 10.5222 8.19765 10.5423C8.25147 10.5624 8.30895 10.5709 8.36628 10.5672C8.42362 10.5634 8.47952 10.5476 8.53027 10.5206C8.58103 10.4937 8.62549 10.4563 8.66072 10.4109L11.9005 6.57919C11.965 6.50827 12.0015 6.41629 12.0032 6.32042C12.0049 6.22454 11.9717 6.13132 11.9097 6.05815L10.8171 4.85764C10.7501 4.78907 10.6604 4.74722 10.5648 4.73992C10.4692 4.73261 10.3742 4.76034 10.2975 4.81794L6.17853 7.68352C6.13002 7.71433 6.08861 7.75508 6.05702 7.80308C6.02543 7.85109 6.00439 7.90524 5.99528 7.96198C5.98618 8.01872 5.98921 8.07674 6.00419 8.13222C6.01917 8.18769 6.04575 8.23936 6.08218 8.2838V8.2838ZM3.99805 10.8385L6.44038 11.2612L7.08348 10.6759L5.76657 9.22894L3.99805 10.8385Z" fill="#F2F2F2"/>
</svg>
    <p style="margin-top: auto; margin-bottom:auto; margin-left: 5px; color: #76798D">INSPOGEN</p>
    
    
 </div>
  
  <div style="display:flex; padding:20px; padding-top:0px">
    <p id="menuTitle" style="margin-top:0px; font-size:21px; font-weight:bold">Writing Prompts</p>
    <div style="display:flex; margin-left:auto">
      <svg id="writingPromptMenuButton" style="margin-left:10px; cursor:pointer" width="22" height="22" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_263_189)">
<path d="M17.6297 9.92598L18.1152 9.44043L16.6586 7.98379L13.9902 5.31543L12.5336 3.85879L12.0481 4.34434L11.077 5.31543L2.51759 13.8748C2.07071 14.3217 1.74415 14.876 1.56368 15.4818L0.0425894 20.6553C-0.0648325 21.0162 0.0339957 21.4072 0.304699 21.6736C0.575402 21.94 0.962121 22.0389 1.32306 21.9357L6.4922 20.4146C7.09806 20.2342 7.65236 19.9076 8.09923 19.4607L16.6586 10.9014L17.6297 9.92598ZM6.87462 17.1619L6.48361 18.1373C6.31173 18.2705 6.11837 18.3693 5.91212 18.4338L2.55196 19.4221L3.54025 16.0662C3.6004 15.8557 3.70353 15.6623 3.83673 15.4947L4.81212 15.1037V16.4787C4.81212 16.8568 5.1215 17.1662 5.49962 17.1662H6.87462V17.1619ZM15.5844 0.803711L14.9656 1.42676L13.9945 2.39785L13.5047 2.8834L14.9613 4.34004L17.6297 7.0084L19.0863 8.46504L19.5719 7.97949L20.543 7.0084L21.166 6.38535C22.2402 5.31113 22.2402 3.5709 21.166 2.49668L19.4774 0.803711C18.4031 -0.270508 16.6629 -0.270508 15.5887 0.803711H15.5844ZM13.5477 8.02246L7.36017 14.21C7.09376 14.4764 6.65548 14.4764 6.38907 14.21C6.12267 13.9436 6.12267 13.5053 6.38907 13.2389L12.5766 7.05137C12.843 6.78496 13.2813 6.78496 13.5477 7.05137C13.8141 7.31777 13.8141 7.75605 13.5477 8.02246Z"/>
</g>
<defs>
<clipPath id="clip0_263_189">
<rect width="22" height="22" fill="white"/>
</clipPath>
</defs>
</svg>
      
      <svg id="settingsMenuButton" style="margin-left:10px; cursor:pointer" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
<mask id="mask0_136_635" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
<rect width="24" height="24"/>
</mask>
<g mask="url(#mask0_136_635)">
<path d="M9.24922 22L8.84922 18.8C8.63255 18.7167 8.42855 18.6167 8.23722 18.5C8.04522 18.3833 7.85755 18.2583 7.67422 18.125L4.69922 19.375L1.94922 14.625L4.52422 12.675C4.50755 12.5583 4.49922 12.4457 4.49922 12.337V11.662C4.49922 11.554 4.50755 11.4417 4.52422 11.325L1.94922 9.375L4.69922 4.625L7.67422 5.875C7.85755 5.74167 8.04922 5.61667 8.24922 5.5C8.44922 5.38333 8.64922 5.28333 8.84922 5.2L9.24922 2H14.7492L15.1492 5.2C15.3659 5.28333 15.5702 5.38333 15.7622 5.5C15.9536 5.61667 16.1409 5.74167 16.3242 5.875L19.2992 4.625L22.0492 9.375L19.4742 11.325C19.4909 11.4417 19.4992 11.554 19.4992 11.662V12.337C19.4992 12.4457 19.4826 12.5583 19.4492 12.675L22.0242 14.625L19.2742 19.375L16.3242 18.125C16.1409 18.2583 15.9492 18.3833 15.7492 18.5C15.5492 18.6167 15.3492 18.7167 15.1492 18.8L14.7492 22H9.24922ZM12.0492 15.5C13.0159 15.5 13.8409 15.1583 14.5242 14.475C15.2076 13.7917 15.5492 12.9667 15.5492 12C15.5492 11.0333 15.2076 10.2083 14.5242 9.525C13.8409 8.84167 13.0159 8.5 12.0492 8.5C11.0659 8.5 10.2366 8.84167 9.56122 9.525C8.88655 10.2083 8.54922 11.0333 8.54922 12C8.54922 12.9667 8.88655 13.7917 9.56122 14.475C10.2366 15.1583 11.0659 15.5 12.0492 15.5ZM12.0492 13.5C11.6326 13.5 11.2786 13.354 10.9872 13.062C10.6952 12.7707 10.5492 12.4167 10.5492 12C10.5492 11.5833 10.6952 11.2293 10.9872 10.938C11.2786 10.646 11.6326 10.5 12.0492 10.5C12.4659 10.5 12.8202 10.646 13.1122 10.938C13.4036 11.2293 13.5492 11.5833 13.5492 12C13.5492 12.4167 13.4036 12.7707 13.1122 13.062C12.8202 13.354 12.4659 13.5 12.0492 13.5ZM10.9992 20H12.9742L13.3242 17.35C13.8409 17.2167 14.3202 17.0207 14.7622 16.762C15.2036 16.504 15.6076 16.1917 15.9742 15.825L18.4492 16.85L19.4242 15.15L17.2742 13.525C17.3576 13.2917 17.4159 13.0457 17.4492 12.787C17.4826 12.529 17.4992 12.2667 17.4992 12C17.4992 11.7333 17.4826 11.4707 17.4492 11.212C17.4159 10.954 17.3576 10.7083 17.2742 10.475L19.4242 8.85L18.4492 7.15L15.9742 8.2C15.6076 7.81667 15.2036 7.49567 14.7622 7.237C14.3202 6.979 13.8409 6.78333 13.3242 6.65L12.9992 4H11.0242L10.6742 6.65C10.1576 6.78333 9.67855 6.979 9.23722 7.237C8.79522 7.49567 8.39089 7.80833 8.02422 8.175L5.54922 7.15L4.57422 8.85L6.72422 10.45C6.64088 10.7 6.58255 10.95 6.54922 11.2C6.51589 11.45 6.49922 11.7167 6.49922 12C6.49922 12.2667 6.51589 12.525 6.54922 12.775C6.58255 13.025 6.64088 13.275 6.72422 13.525L4.57422 15.15L5.54922 16.85L8.02422 15.8C8.39089 16.1833 8.79522 16.504 9.23722 16.762C9.67855 17.0207 10.1576 17.2167 10.6742 17.35L10.9992 20Z" />
</g>
</svg>
      
     <svg style="margin-left:10px;" width="2" height="22" viewBox="0 0 2 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<line x1="1" x2="1" y2="22" stroke="#AEB4CE" stroke-width="2"/>
</svg>

<svg id="closeSidebarMenuButton" style="margin-left:10px; cursor:pointer" width="17" height="23" viewBox="0 0 17 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_263_191)">
<path d="M16.6732 3.79574C17.1735 3.18481 17.0938 2.27738 16.4917 1.76977C15.8896 1.26215 14.9953 1.34301 14.4951 1.95395L8.50081 9.25375L2.50654 1.95395C2.00628 1.34301 1.11201 1.26215 0.509924 1.76977C-0.0921589 2.27738 -0.171846 3.18481 0.328414 3.79574L6.65472 11.4998L0.328414 19.2039C-0.171846 19.8149 -0.0921589 20.7223 0.509924 21.2299C1.11201 21.7375 2.00628 21.6567 2.50654 21.0457L8.50081 13.7459L14.4951 21.0457C14.9953 21.6567 15.8896 21.7375 16.4917 21.2299C17.0938 20.7223 17.1735 19.8149 16.6732 19.2039L10.3469 11.4998L16.6732 3.79574Z" fill="#AEB4CE"/>
</g>
<defs>
<clipPath id="clip0_263_191">
<rect width="17" height="23" fill="white"/>
</clipPath>
</defs>
</svg>

      
    </div>
  </div>
</div>
`

var menuStyles = {
    basic:menuBasic
}