var ideaSettingsUi = `
<div>
  <div id="collapsed-box" style="display: none;">
  <div style="width: 305px; color: #9747FF; margin-left:auto; margin-right:auto; font-size: 16px; border: 2px solid #9747FF; background-color:white; box-shadow: 2px 4px 4px 0px rgba(0,0,0,0.68); font-weight: bold; padding:10px 5px; height: fit-content; border-radius: 10px; font-weight:bold; cursor:pointer; user-select:none;">
    Click to edit inputs
  </div>
  </div>
  <div id="ideas-contents">
    <div style="width: 315px; height: 240px; border-radius: 10px; border: 2px solid #9747FF; background-color:white; box-shadow: 2px 4px 4px 0px rgba(0,0,0,0.68); margin-left:auto; margin-right:auto;">
      <form id="app-cover">
        <div id="select-box">
    <input type="checkbox" id="options-view-button">
          <div id="select-button" class="brd">
            <div id="selected-value">
              <span>Select Prompt Type</span>
            </div>
            <div id="chevrons">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
            </div>
          </div>
          <div id="options">
            <div class="option">
        <input class="s-c top" type="radio" name="promptType" value="continue">
        <input class="s-c bottom" type="radio" name="promptType" value="continue">
              <i class="fab">
          <svg width="17" height="17" viewBox="0 0 17 17" xmlns="http://www.w3.org/2000/svg">
<path d="M15.5054 7.23584H9.30322V1.03369C9.30322 0.759539 9.19432 0.496616 9.00046 0.302761C8.80661 0.108907 8.54368 0 8.26953 0C7.99538 0 7.73246 0.108907 7.5386 0.302761C7.34475 0.496616 7.23584 0.759539 7.23584 1.03369V7.23584H1.03369C0.759539 7.23584 0.496616 7.34475 0.302761 7.5386C0.108907 7.73246 0 7.99538 0 8.26953C0 8.54368 0.108907 8.80661 0.302761 9.00046C0.496616 9.19432 0.759539 9.30322 1.03369 9.30322H7.23584V15.5054C7.23584 15.7795 7.34475 16.0424 7.5386 16.2363C7.73246 16.4302 7.99538 16.5391 8.26953 16.5391C8.54368 16.5391 8.80661 16.4302 9.00046 16.2363C9.19432 16.0424 9.30322 15.7795 9.30322 15.5054V9.30322H15.5054C15.7795 9.30322 16.0424 9.19432 16.2363 9.00046C16.4302 8.80661 16.5391 8.54368 16.5391 8.26953C16.5391 7.99538 16.4302 7.73246 16.2363 7.5386C16.0424 7.34475 15.7795 7.23584 15.5054 7.23584Z"/>
                </svg>
              </i>
              <span class="label">Continue the story</span>
              <span class="opt-val">Continue the story</span>
            </div>
            <div class="option">
        <input class="s-c top" type="radio" name="promptType" value="link">
        <input class="s-c bottom" type="radio" name="promptType" value="link">
              <i class="fab">
          <svg width="17" height="17" viewBox="0 0 17 17" xmlns="http://www.w3.org/2000/svg">
<path d="M9.58686 6.18936L6.18788 9.58834C6.10823 9.66734 6.04502 9.76132 6.00188 9.86487C5.95873 9.96842 5.93652 10.0795 5.93652 10.1917C5.93652 10.3038 5.95873 10.4149 6.00188 10.5185C6.04502 10.622 6.10823 10.716 6.18788 10.795C6.26687 10.8746 6.36085 10.9378 6.4644 10.981C6.56795 11.0241 6.67902 11.0463 6.7912 11.0463C6.90337 11.0463 7.01444 11.0241 7.11799 10.981C7.22154 10.9378 7.31552 10.8746 7.39452 10.795L10.7935 7.396C10.9535 7.23599 11.0434 7.01897 11.0434 6.79268C11.0434 6.56639 10.9535 6.34937 10.7935 6.18936C10.6335 6.02935 10.4165 5.93945 10.1902 5.93945C9.96389 5.93945 9.74687 6.02935 9.58686 6.18936Z"/>
<path d="M8.72837 13.0808L7.64069 14.1599C7.03009 14.7891 6.20924 15.1715 5.33472 15.2342C4.46021 15.2969 3.59321 15.0355 2.89911 14.4998C2.53225 14.1975 2.23288 13.8217 2.02033 13.3964C1.80779 12.9712 1.6868 12.5062 1.66518 12.0313C1.64355 11.5564 1.72178 11.0823 1.89481 10.6395C2.06783 10.1968 2.3318 9.79524 2.66967 9.46085L3.87631 8.24571C3.95596 8.16672 4.01918 8.07274 4.06232 7.96919C4.10546 7.86564 4.12767 7.75457 4.12767 7.64239C4.12767 7.53022 4.10546 7.41915 4.06232 7.3156C4.01918 7.21205 3.95596 7.11807 3.87631 7.03907C3.79732 6.95943 3.70334 6.89621 3.59979 6.85307C3.49624 6.80993 3.38517 6.78772 3.27299 6.78772C3.16082 6.78772 3.04975 6.80993 2.9462 6.85307C2.84265 6.89621 2.74867 6.95943 2.66967 7.03907L1.5905 8.12675C0.681402 9.00709 0.122632 10.1874 0.017927 11.4485C-0.0867779 12.7097 0.269696 13.966 1.02117 14.9842C1.46718 15.5628 2.03121 16.0399 2.67578 16.3838C3.32036 16.7276 4.03072 16.9304 4.75969 16.9787C5.48866 17.0269 6.21955 16.9194 6.90381 16.6635C7.58806 16.4075 8.21002 16.0089 8.72837 15.4941L9.93501 14.2874C10.095 14.1274 10.1849 13.9104 10.1849 13.6841C10.1849 13.4578 10.095 13.2408 9.93501 13.0808C9.775 12.9208 9.55797 12.8309 9.33169 12.8309C9.1054 12.8309 8.88838 12.9208 8.72837 13.0808Z"/>
<path d="M14.9988 1.03145C13.9736 0.272172 12.707 -0.087931 11.4357 0.018404C10.1643 0.124739 8.97518 0.69024 8.09034 1.60928L7.17261 2.544C7.06772 2.62025 6.98001 2.71768 6.91515 2.82999C6.8503 2.94229 6.80975 3.06695 6.79614 3.19592C6.78252 3.32488 6.79613 3.45527 6.8361 3.57864C6.87607 3.70201 6.9415 3.81561 7.02815 3.91209C7.10715 3.99174 7.20113 4.05495 7.30468 4.09809C7.40823 4.14123 7.5193 4.16344 7.63147 4.16344C7.74365 4.16344 7.85472 4.14123 7.95827 4.09809C8.06182 4.05495 8.1558 3.99174 8.23479 3.91209L9.33946 2.79892C9.94669 2.16698 10.7666 1.78249 11.6407 1.71971C12.5149 1.65694 13.3813 1.92033 14.0726 2.45902C14.4421 2.76137 14.7439 3.13819 14.9581 3.56494C15.1724 3.99169 15.2943 4.45879 15.3159 4.9358C15.3376 5.41282 15.2585 5.88904 15.0838 6.33344C14.9091 6.77784 14.6427 7.18044 14.302 7.51502L13.0953 8.73015C13.0157 8.80915 12.9525 8.90313 12.9093 9.00668C12.8662 9.11023 12.844 9.2213 12.844 9.33347C12.844 9.44565 12.8662 9.55672 12.9093 9.66027C12.9525 9.76382 13.0157 9.8578 13.0953 9.93679C13.1743 10.0164 13.2683 10.0797 13.3719 10.1228C13.4754 10.1659 13.5865 10.1881 13.6987 10.1881C13.8108 10.1881 13.9219 10.1659 14.0255 10.1228C14.129 10.0797 14.223 10.0164 14.302 9.93679L15.5086 8.73015C16.022 8.2119 16.4194 7.59048 16.6745 6.90706C16.9296 6.22363 17.0366 5.49381 16.9884 4.76592C16.9402 4.03803 16.7379 3.32869 16.3949 2.68488C16.0519 2.04107 15.576 1.47748 14.9988 1.03145Z"/>
                </svg>

              </i>
              <span class="label">Link the story to</span>
              <span class="opt-val">Link the story to</span>
            </div>
            <div class="option">
        <input class="s-c top" type="radio" name="promptType" value="list">
        <input class="s-c bottom" type="radio" name="promptType" value="list">
              <i class="fab">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z"/></svg>
              </i>
              <span class="label">Give me a list of</span>
              <span class="opt-val">Give me a list of</span>
            </div>
            <div class="option">
        <input class="s-c top" type="radio" name="promptType" value="describe">
        <input class="s-c bottom" type="radio" name="promptType" value="describe">
              <i class="fab">
          <svg width="17" height="18" viewBox="0 0 17 18" xmlns="http://www.w3.org/2000/svg">
<path d="M3.27215 9.11218C2.34547 9.33367 1.5197 9.8592 0.926624 10.6049C0.33355 11.3506 0.00736017 12.2734 0.000115885 13.2262V16.5409C-0.00133798 16.6084 0.0109011 16.6756 0.0360961 16.7383C0.0612912 16.8011 0.0989207 16.8581 0.146719 16.9059C0.194517 16.9536 0.251495 16.9913 0.314221 17.0165C0.376947 17.0417 0.444123 17.0539 0.511704 17.0525L3.96493 16.9885C4.73641 16.9897 5.49203 16.7694 6.14197 16.3538C6.79191 15.9381 7.30884 15.3446 7.63131 14.6437C7.9622 13.9832 8.09818 13.2421 8.02332 12.5071C7.94846 11.7722 7.66587 11.0737 7.2086 10.4934C6.75133 9.91319 6.13829 9.47514 5.44118 9.23053C4.74408 8.98592 3.99173 8.94487 3.27215 9.11218Z"/>
<path d="M16.2109 0.489885C15.7637 0.137219 15.2007 -0.0353756 14.6327 0.00604302C14.0647 0.0474616 13.5327 0.299896 13.1414 0.713705L6.34151 7.54554C6.24908 7.63927 6.19727 7.76562 6.19727 7.89726C6.19727 8.0289 6.24908 8.15524 6.34151 8.24897L8.73958 10.6577C8.83331 10.7501 8.95966 10.8019 9.09129 10.8019C9.22293 10.8019 9.34928 10.7501 9.44301 10.6577L16.3601 3.76192C16.565 3.55606 16.7271 3.31157 16.8369 3.04263C16.9466 2.7737 17.0019 2.48565 16.9996 2.19518C17.0071 1.86957 16.94 1.54656 16.8033 1.25095C16.6665 0.955337 16.4639 0.694987 16.2109 0.489885Z"/>
                </svg>

              </i>
              <span class="label">Describe</span>
              <span class="opt-val">Describe</span>
            </div>
            <div id="option-bg"></div>
          </div>
        </div>
      </form>
  
      <div id="ContinueContent" style="display: block;">
        <div style="display:flex; margin-top:0px; width:100%; align-items: center; justify-content: center;">
          <p style="padding-right:5px; font-size:16px; font-family:Roboto; color:#8777D9;">with a focus on</p>
          <div>
            <form id="app-cover2">
              <div id="select-box2">
    <input type="checkbox" id="options-view-button2">
                <div id="select-button2" class="brd2">
                  <div id="selected-value2">
                    <span>Select Focus</span>
                  </div>
                  <div id="chevrons2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                  </div>
                </div>
                <div id="options2">
                  <div class="option2">
        <input class="s-c2 top2" type="radio" name="continueFocus" value="any">
        <input class="s-c2 bottom2" type="radio" name="continueFocus" value="any">
                    <i class="fab2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/></svg>
                    </i>
                    <span class="label2">Any Focus</span>
                    <span class="opt-val2">Anything</span>
                  </div>
                  <div class="option2">
        <input class="s-c2 top2" type="radio" name="continueFocus" value="action">
        <input class="s-c2 bottom2" type="radio" name="continueFocus" value="action">
                    <i class="fab2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M320 48a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM125.7 175.5c9.9-9.9 23.4-15.5 37.5-15.5c1.9 0 3.8 .1 5.6 .3L137.6 254c-9.3 28 1.7 58.8 26.8 74.5l86.2 53.9-25.4 88.8c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l28.7-100.4c5.9-20.6-2.6-42.6-20.7-53.9L238 299l30.9-82.4 5.1 12.3C289 264.7 323.9 288 362.7 288H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H362.7c-12.9 0-24.6-7.8-29.5-19.7l-6.3-15c-14.6-35.1-44.1-61.9-80.5-73.1l-48.7-15c-11.1-3.4-22.7-5.2-34.4-5.2c-31 0-60.8 12.3-82.7 34.3L57.4 153.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l23.1-23.1zM91.2 352H32c-17.7 0-32 14.3-32 32s14.3 32 32 32h69.6c19 0 36.2-11.2 43.9-28.5L157 361.6l-9.5-6c-17.5-10.9-30.5-26.8-37.9-44.9L91.2 352z"/></svg>
                    </i>
                    <span class="label2">Action</span>
                    <span class="opt-val2">Action</span>
                  </div>
                  <div class="option2">
        <input class="s-c2 top2" type="radio" name="continueFocus" value="dialogue">
        <input class="s-c2 bottom2" type="radio" name="continueFocus" value="dialogue">
                    <i class="fab2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M112 24c0-13.3-10.7-24-24-24S64 10.7 64 24V96H48C21.5 96 0 117.5 0 144V300.1c0 12.7 5.1 24.9 14.1 33.9l3.9 3.9c9 9 14.1 21.2 14.1 33.9V464c0 26.5 21.5 48 48 48H304c26.5 0 48-21.5 48-48V371.9c0-12.7 5.1-24.9 14.1-33.9l3.9-3.9c9-9 14.1-21.2 14.1-33.9V144c0-26.5-21.5-48-48-48H320c0-17.7-14.3-32-32-32s-32 14.3-32 32H224c0-17.7-14.3-32-32-32s-32 14.3-32 32H112V24zm0 136H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16zm0 64H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/></svg>
                    </i>
                    <span class="label2">Dialogue</span>
                    <span class="opt-val2">Dialogue</span>
                  </div>
                  <div class="option2">
        <input class="s-c2 top2" type="radio" name="continueFocus" value="inner thoughts">
        <input class="s-c2 bottom2" type="radio" name="continueFocus" value="inner thoughts">
                    <i class="fab2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M184 0c30.9 0 56 25.1 56 56V456c0 30.9-25.1 56-56 56c-28.9 0-52.7-21.9-55.7-50.1c-5.2 1.4-10.7 2.1-16.3 2.1c-35.3 0-64-28.7-64-64c0-7.4 1.3-14.6 3.6-21.2C21.4 367.4 0 338.2 0 304c0-31.9 18.7-59.5 45.8-72.3C37.1 220.8 32 207 32 192c0-30.7 21.6-56.3 50.4-62.6C80.8 123.9 80 118 80 112c0-29.9 20.6-55.1 48.3-62.1C131.3 21.9 155.1 0 184 0zM328 0c28.9 0 52.6 21.9 55.7 49.9c27.8 7 48.3 32.1 48.3 62.1c0 6-.8 11.9-2.4 17.4c28.8 6.2 50.4 31.9 50.4 62.6c0 15-5.1 28.8-13.8 39.7C493.3 244.5 512 272.1 512 304c0 34.2-21.4 63.4-51.6 74.8c2.3 6.6 3.6 13.8 3.6 21.2c0 35.3-28.7 64-64 64c-5.6 0-11.1-.7-16.3-2.1c-3 28.2-26.8 50.1-55.7 50.1c-30.9 0-56-25.1-56-56V56c0-30.9 25.1-56 56-56z"/></svg>
                    </i>
                    <span class="label2">Thoughts</span>
                    <span class="opt-val2">Thoughts</span>
                  </div>
                  <div id="option-bg2"></div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div style="display:flex; margin-top:0px; width:100%; align-items: center; justify-content: center;">
          <p style="padding-right:5px; font-size:16px; font-family:Roboto; color:#8777D9;">and</p>
          <div>
            <form id="app-cover3">
              <div id="select-box3">
    <input type="checkbox" id="options-view-button3">
                <div id="select-button3" class="brd3">
                  <div id="selected-value3">
                    <span>Select Tone</span>
                  </div>
                  <div id="chevrons3">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                  </div>
                </div>
                <div id="options3">
                  <div class="option3">
        <input class="s-c3 top3" type="radio" name="continueTone" value="any">
        <input class="s-c3 bottom3" type="radio" name="continueTone" value="any">
                    <i class="fab3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/></svg>
                    </i>
                    <span class="label3">Any Tone</span>
                    <span class="opt-val3">Any</span>
                  </div>
                  <div class="option3">
        <input class="s-c3 top3" type="radio" name="continueTone" value="fearful">
        <input class="s-c3 bottom3" type="radio" name="continueTone" value="fearful">
                    <i class="fab3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM176.4 176a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm128 32a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM256 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/></svg>
                    </i>
                    <span class="label3">Fearful</span>
                    <span class="opt-val3">Fearful</span>
                  </div>
                  <div class="option3">
        <input class="s-c3 top3" type="radio" name="continueTone" value="sarcastic">
        <input class="s-c3 bottom3" type="radio" name="continueTone" value="sarcastic">
                    <i class="fab3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M426.8 14.2C446-5 477.5-4.6 497.1 14.9s20 51 .7 70.3c-6.8 6.8-21.4 12.4-37.4 16.7c-16.3 4.4-34.1 7.5-46.3 9.3c-1.6 .2-3.1 .5-4.6 .6c-4.9 .8-9.1-2.8-9.5-7.4c-.1-.7 0-1.4 .1-2.1c1.6-11.2 4.6-29.6 9-47c.3-1.3 .7-2.6 1-3.9c4.3-15.9 9.8-30.5 16.7-37.4zm-44.7 19c-1.5 4.8-2.9 9.6-4.1 14.3c-4.8 18.9-8 38.5-9.7 50.3c-4 26.8 18.9 49.7 45.7 45.8c11.9-1.6 31.5-4.8 50.4-9.7c4.7-1.2 9.5-2.5 14.3-4.1C534.2 227.5 520.2 353.8 437 437c-83.2 83.2-209.5 97.2-307.2 41.8c1.5-4.8 2.8-9.6 4-14.3c4.8-18.9 8-38.5 9.7-50.3c4-26.8-18.9-49.7-45.7-45.8c-11.9 1.6-31.5 4.8-50.4 9.7c-4.7 1.2-9.5 2.5-14.3 4.1C-22.2 284.5-8.2 158.2 75 75C158.2-8.3 284.5-22.2 382.2 33.2zM51.5 410.1c18.5-5 38.8-8.3 50.9-10c.4-.1 .7-.1 1-.1c5.1-.2 9.2 4.3 8.4 9.6c-1.7 12.1-5 32.4-10 50.9C97.6 476.4 92 491 85.2 497.8C66 517 34.5 516.6 14.9 497.1s-20-51-.7-70.3c6.8-6.8 21.4-12.4 37.4-16.7zM416.9 209c-4.7-11.9-20.8-11-26.8 .3c-19 35.5-45 70.8-77.5 103.3S244.8 371.1 209.3 390c-11.3 6-12.2 22.1-.3 26.8c57.6 22.9 125.8 11 172.3-35.5s58.4-114.8 35.5-172.3zM87.1 285.1c2 2 4.6 3.2 7.3 3.4l56.1 5.1 5.1 56.1c.3 2.8 1.5 5.4 3.4 7.3c6.3 6.3 17.2 3.6 19.8-4.9l29.7-97.4c3.5-11.6-7.3-22.5-19-19L92 265.3c-8.6 2.6-11.3 13.4-4.9 19.8zM265.3 92l-29.7 97.4c-3.5 11.6 7.3 22.5 19 19l97.4-29.7c8.6-2.6 11.3-13.4 4.9-19.8c-2-2-4.6-3.2-7.3-3.4l-56.1-5.1-5.1-56.1c-.2-2.8-1.5-5.4-3.4-7.3c-6.3-6.3-17.2-3.6-19.8 4.9z"/></svg>
                    </i>
                    <span class="label3">Humor</span>
                    <span class="opt-val3">Humor</span>
                  </div>
                  <div class="option3">
        <input class="s-c3 top3" type="radio" name="continueTone" value="furious">
        <input class="s-c3 bottom3" type="radio" name="continueTone" value="furious">
                    <i class="fab3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM338.7 395.9c6.6-5.9 7.1-16 1.2-22.6C323.8 355.4 295.7 336 256 336s-67.8 19.4-83.9 37.3c-5.9 6.6-5.4 16.7 1.2 22.6s16.7 5.4 22.6-1.2c11.7-13 31.6-26.7 60.1-26.7s48.4 13.7 60.1 26.7c5.9 6.6 16 7.1 22.6 1.2zM176.4 272c17.7 0 32-14.3 32-32c0-1.5-.1-3-.3-4.4l10.9 3.6c8.4 2.8 17.4-1.7 20.2-10.1s-1.7-17.4-10.1-20.2l-96-32c-8.4-2.8-17.4 1.7-20.2 10.1s1.7 17.4 10.1 20.2l30.7 10.2c-5.8 5.8-9.3 13.8-9.3 22.6c0 17.7 14.3 32 32 32zm192-32c0-8.9-3.6-17-9.5-22.8l30.2-10.1c8.4-2.8 12.9-11.9 10.1-20.2s-11.9-12.9-20.2-10.1l-96 32c-8.4 2.8-12.9 11.9-10.1 20.2s11.9 12.9 20.2 10.1l11.7-3.9c-.2 1.5-.3 3.1-.3 4.7c0 17.7 14.3 32 32 32s32-14.3 32-32z"/></svg>
                    </i>
                    <span class="label3">Angry</span>
                    <span class="opt-val3">Angry</span>
                  </div>
                  <div class="option3">
        <input class="s-c3 top3" type="radio" name="continueTone" value="sad">
        <input class="s-c3 bottom3" type="radio" name="continueTone" value="sad">
                    <i class="fab3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zm240 80c0-8.8 7.2-16 16-16c45 0 85.6 20.5 115.7 53.1c6 6.5 5.6 16.6-.9 22.6s-16.6 5.6-22.6-.9c-25-27.1-57.4-42.9-92.3-42.9c-8.8 0-16-7.2-16-16zm-80 80c-26.5 0-48-21-48-47c0-20 28.6-60.4 41.6-77.7c3.2-4.4 9.6-4.4 12.8 0C179.6 308.6 208 349 208 369c0 26-21.5 47-48 47zM367.6 208a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zm-192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"/></svg>
                    </i>
                    <span class="label3">Sad</span>
                    <span class="opt-val3">Sad</span>
                  </div>
                  <div class="option3">
        <input class="s-c3 top3" type="radio" name="continueTone" value="happy">
        <input class="s-c3 bottom3" type="radio" name="continueTone" value="happy">
                    <i class="fab3">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM96.8 314.1c-3.8-13.7 7.4-26.1 21.6-26.1H393.6c14.2 0 25.5 12.4 21.6 26.1C396.2 382 332.1 432 256 432s-140.2-50-159.2-117.9zM217.6 212.8l0 0 0 0-.2-.2c-.2-.2-.4-.5-.7-.9c-.6-.8-1.6-2-2.8-3.4c-2.5-2.8-6-6.6-10.2-10.3c-8.8-7.8-18.8-14-27.7-14s-18.9 6.2-27.7 14c-4.2 3.7-7.7 7.5-10.2 10.3c-1.2 1.4-2.2 2.6-2.8 3.4c-.3 .4-.6 .7-.7 .9l-.2 .2 0 0 0 0 0 0c-2.1 2.8-5.7 3.9-8.9 2.8s-5.5-4.1-5.5-7.6c0-17.9 6.7-35.6 16.6-48.8c9.8-13 23.9-23.2 39.4-23.2s29.6 10.2 39.4 23.2c9.9 13.2 16.6 30.9 16.6 48.8c0 3.4-2.2 6.5-5.5 7.6s-6.9 0-8.9-2.8l0 0 0 0zm160 0l0 0-.2-.2c-.2-.2-.4-.5-.7-.9c-.6-.8-1.6-2-2.8-3.4c-2.5-2.8-6-6.6-10.2-10.3c-8.8-7.8-18.8-14-27.7-14s-18.9 6.2-27.7 14c-4.2 3.7-7.7 7.5-10.2 10.3c-1.2 1.4-2.2 2.6-2.8 3.4c-.3 .4-.6 .7-.7 .9l-.2 .2 0 0 0 0 0 0c-2.1 2.8-5.7 3.9-8.9 2.8s-5.5-4.1-5.5-7.6c0-17.9 6.7-35.6 16.6-48.8c9.8-13 23.9-23.2 39.4-23.2s29.6 10.2 39.4 23.2c9.9 13.2 16.6 30.9 16.6 48.8c0 3.4-2.2 6.5-5.5 7.6s-6.9 0-8.9-2.8l0 0 0 0 0 0z"/></svg>
                    </i>
                    <span class="label3">Happy</span>
                    <span class="opt-val3">Happy</span>
                  </div>
                  <div id="option-bg3"></div>
                </div>
              </div>
            </form>
          </div>
          <p style="padding-left:5px; font-size:16px; font-family:Roboto; color:#8777D9;">undertone.</p>
        </div>
      </div>

      <div id="LinkContent" style="display: none;">
        <textarea style="width:90%; margin-left:10px; margin-top:10px; height:75px; resize: none; border-radius:5px; border-color: #D2D0DC; border-width:2px; font-family:Roboto,Arial; padding:5px" placeholder="Describe future plot point/event, max 300 words..." id="linkText" rows="4" cols="50"></textarea>
      </div>
  
      <div id="ListContent" style="display: none;">
        <textarea style="width:90%; margin-left:10px; margin-top:5px; height:20px; resize: none; border-radius:5px; border-color: #D2D0DC; border-width:2px; font-family:Roboto,Arial; padding:5px" placeholder="Monsters" id="listTopic" rows="4" cols="50"></textarea>
    
        <p style="font-size:16px; color: #9747FF; margin-left:90px; margin-right:auto; margin-top: 3px; margin-bottom:2px">One might find in</p>
  
        <textarea style="width:90%; margin-left:10px; margin-top:0px; height:20px; resize: none; border-radius:5px; border-color: #D2D0DC; border-width:2px; font-family:Roboto,Arial; padding:5px" placeholder="A Crypt" id="listContext" rows="4" cols="50"></textarea>
      </div>

      <div id="DescribeContent" style="display: none;">
        <textarea style="width:90%; margin-left:10px; margin-top:5px; height:20px; resize: none; border-radius:5px; border-color: #D2D0DC; border-width:2px; font-family:Roboto,Arial; padding:5px" placeholder="The Knight | The Monster" id="describeTopic" rows="4" cols="50"></textarea>
    
        <div style="display:flex; margin-top:0px; width:100%; align-items: center; justify-content: center;">
          <p style="padding-right:5px; font-size:16px; font-family:Roboto; color:#8777D9;">in terms of</p>
          <div>
            <form id="app-cover4">
              <div id="select-box4">
    <input type="checkbox" id="options-view-button4">
                <div id="select-button4" class="brd4">
                  <div id="selected-value4">
                    <span>Select Focus</span>
                  </div>
                  <div id="chevrons4">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M201.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 338.7 54.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"/></svg>
                  </div>
                </div>
                <div id="options4">
                  <div class="option4">
        <input class="s-c4 top4" type="radio" name="describeStyle" value="any">
        <input class="s-c4 bottom4" type="radio" name="describeStyle" value="any">
                    <i class="fab4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/></svg>
                    </i>
                    <span class="label4">Any Focus</span>
                    <span class="opt-val4">Anything</span>
                  </div>
                  <div class="option4">
        <input class="s-c4 top4" type="radio" name="describeStyle" value="sight">
        <input class="s-c4 bottom4" type="radio" name="describeStyle" value="sight">
                    <i class="fab4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z"/></svg>
                    </i>
                    <span class="label4">Sight</span>
                    <span class="opt-val4">Sight</span>
                  </div>
                  <div class="option4">
        <input class="s-c4 top4" type="radio" name="describeStyle" value="sound">
        <input class="s-c4 bottom4" type="radio" name="describeStyle" value="sound">
                    <i class="fab4">
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 80C149.9 80 62.4 159.4 49.6 262c9.4-3.8 19.6-6 30.4-6c26.5 0 48 21.5 48 48V432c0 26.5-21.5 48-48 48c-44.2 0-80-35.8-80-80V384 336 288C0 146.6 114.6 32 256 32s256 114.6 256 256v48 48 16c0 44.2-35.8 80-80 80c-26.5 0-48-21.5-48-48V304c0-26.5 21.5-48 48-48c10.8 0 21 2.1 30.4 6C449.6 159.4 362.1 80 256 80z"/></svg>
                    </i>
                    <span class="label4">Sound</span>
                    <span class="opt-val4">Sound</span>
                  </div>
                  <div class="option4">
        <input class="s-c4 top4" type="radio" name="describeStyle" value="smell">
        <input class="s-c4 bottom4" type="radio" name="describeStyle" value="smell">
                    <i class="fab4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M288 32c0 17.7 14.3 32 32 32h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H352c53 0 96-43 96-96s-43-96-96-96H320c-17.7 0-32 14.3-32 32zm64 352c0 17.7 14.3 32 32 32h32c53 0 96-43 96-96s-43-96-96-96H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H384c-17.7 0-32 14.3-32 32zM128 512h32c53 0 96-43 96-96s-43-96-96-96H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H160c17.7 0 32 14.3 32 32s-14.3 32-32 32H128c-17.7 0-32 14.3-32 32s14.3 32 32 32z"/></svg>
                    </i>
                    <span class="label4">Smell</span>
                    <span class="opt-val4">Smell</span>
                  </div>
                  <div class="option4">
        <input class="s-c4 top4" type="radio" name="describeStyle" value="taste">
        <input class="s-c4 bottom4" type="radio" name="describeStyle" value="taste">
                    <i class="fab4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M160 265.2c0 8.5-3.4 16.6-9.4 22.6l-26.8 26.8c-12.3 12.3-32.5 11.4-49.4 7.2C69.8 320.6 65 320 60 320c-33.1 0-60 26.9-60 60s26.9 60 60 60c6.3 0 12 5.7 12 12c0 33.1 26.9 60 60 60s60-26.9 60-60c0-5-.6-9.8-1.8-14.5c-4.2-16.9-5.2-37.1 7.2-49.4l26.8-26.8c6-6 14.1-9.4 22.6-9.4H336c6.3 0 12.4-.3 18.5-1c11.9-1.2 16.4-15.5 10.8-26c-8.5-15.8-13.3-33.8-13.3-53c0-61.9 50.1-112 112-112c8 0 15.7 .8 23.2 2.4c11.7 2.5 24.1-5.9 22-17.6C494.5 62.5 422.5 0 336 0C238.8 0 160 78.8 160 176v89.2z"/></svg>
                    </i>
                    <span class="label4">Taste</span>
                    <span class="opt-val4">Taste</span>
                  </div>
                  <div class="option4">
        <input class="s-c4 top4" type="radio" name="describeStyle" value="touch">
        <input class="s-c4 bottom4" type="radio" name="describeStyle" value="touch">
                    <i class="fab4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V240c0 8.8-7.2 16-16 16s-16-7.2-16-16V64c0-17.7-14.3-32-32-32s-32 14.3-32 32V336c0 1.5 0 3.1 .1 4.6L67.6 283c-16-15.2-41.3-14.6-56.6 1.4s-14.6 41.3 1.4 56.6L124.8 448c43.1 41.1 100.4 64 160 64H304c97.2 0 176-78.8 176-176V128c0-17.7-14.3-32-32-32s-32 14.3-32 32V240c0 8.8-7.2 16-16 16s-16-7.2-16-16V64c0-17.7-14.3-32-32-32s-32 14.3-32 32V240c0 8.8-7.2 16-16 16s-16-7.2-16-16V32z"/></svg>
                    </i>
                    <span class="label4">Touch</span>
                    <span class="opt-val4">Touch</span>
                  </div>
                  <div id="option-bg4"></div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    <div id="generatePromptButton" style="width:125px; height:35px; background-color: #9747FF; border-radius: 10px; margin-left:auto; margin-right:auto; margin-top:20px; text-align:center; align-content: center; vertical-align: middle; line-height:35px; color:white; font-family: Roboto, Arial; font-weight:bold; box-shadow: 1px 2px 3px -2px rgba(0,0,0,0.59); font-size:16px; cursor:pointer;">Give me Ideas!</div>
    <p style="font-size:10px; color: #B4B4B4; margin-left:30px; margin-right:auto; margin-top: 3px">*Continues based on last 400 words at end of document*</p>
  </div>
  </div>
</div>`
var ideaSettingsStyles = {
basicUi:ideaSettingsUi
}