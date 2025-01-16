const typingForm = document.querySelector(".typing-form");
const chatList= document.querySelector(".chat-list")
let userMessage=null;
const GEMINI_API_KEY="AIzaSyCWatYgtuQ82vqaiMziZyN3EoUKvEA2BR8"
const API_URL=`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const generateAPIResponse= async (incomingMessageDiv)=>{
    const textElement=incomingMessageDiv.querySelector(".text");
    try {
        const response= await fetch(API_URL,{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({
                contents:[{
                    parts:[{text:userMessage}],
                }]
            })
        });
        const data= await response.json();
        const apiResponse=data?.candidates[0].content.parts[0].text;
        textElement.innerText=apiResponse;
    } catch (error) {
        console.log(error)
    }
    finally{
        incomingMessageDiv.classList.remove("loading");
    }
}


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
const inComingMessageDiv= createMessageElement(htmlElement,"incoming","loading");
chatList.appendChild(inComingMessageDiv);
generateAPIResponse(inComingMessageDiv);
}

const handleOutgoingChat=()=>{
    userMessage=typingForm.querySelector(".typing-input").value.trim();
    if(!userMessage) return;
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