const typingForm = document.querySelector(".typing-form");
const chatList= document.querySelector(".chat-list")
let userMessage=null;

const createMessageElement = (content,...classes)=>{
    const div=document.createElement("div");
    div.classList.add("message",...classes);
    div.innerHTML=content
    return div;

}

const showloadingAnimation = ()=>{
    const htmlElement=`
      <div class="message-content">
                <img src="/images/gemini-logo.png" alt="Gemini AI Image" class="avatar">
                <p class="text"></p>
                <div class="loading-indicator">
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                </div>
                <span class="icon material-symbols-rounded">
                content_copy
            </span>
     </div> `
const outGoingMessageDiv= createMessageElement(htmlElement,"incoming","loading");
chatList.appendChild(outGoingMessageDiv);
}

const handleOutgoingChat=()=>{
    userMessage=typingForm.querySelector(".typing-input").value.trim();
    if(!userMessage) return;
    console.log(userMessage)
    const htmlElement=`
             <div class="message-content">
                <img src="/images/user-logo.jpg" class="avatar" alt="User Image">
                <p class="text">
                ${userMessage}
                </p>
            </div> `
    const outGoingMessageDiv= createMessageElement(htmlElement,"outgoing");
    chatList.appendChild(outGoingMessageDiv);
    typingForm.reset();
    setTimeout(showloadingAnimation,500);
}

typingForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    handleOutgoingChat();
})