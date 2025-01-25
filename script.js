const typingForm = document.querySelector(".typing-form");
const chatList= document.querySelector(".chat-list");
const toggleThemeButton=document.querySelector("#toggle-theme-button");
const deleteButton=document.querySelector("#delete-button");
const suggestions=document.querySelectorAll(".suggestion-list .suggestion");
const GEMINI_API_KEY="AIzaSyCWatYgtuQ82vqaiMziZyN3EoUKvEA2BR8"
const API_URL=`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
let userMessage=null;

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
        if(!response.ok) throw new Error(data.error.message);
        const apiResponse=data?.candidates[0].content.parts[0].text;
        showTypingEffect(apiResponse,textElement);
    } catch (error) {
        textElement.innerText=error.message;
        textElement.classList.add("error");
    }
    finally{
        incomingMessageDiv.classList.remove("loading");
    }
}

const loadLocalStorageData= ()=>{
    const savedChats=localStorage.getItem("savedChats");
    const isLightMode=(localStorage.getItem("themeColor")=== "light_mode");
    document.body.classList.toggle("light_mode",isLightMode);
    toggleThemeButton.innerText= isLightMode ? "dark_mode" : "light_mode";
    chatList.innerHTML=savedChats || "";
    document.body.classList.toggle("hide-header",savedChats);

}
loadLocalStorageData();

const createMessageElement = (content,...classes)=>{
    const div=document.createElement("div");
    div.classList.add("message",...classes);
    div.innerHTML=content;
    return div;

}
const showTypingEffect= (text,textElement)=>{
    const words=text.split(' ');
    let currentWordIndex=0;

    const typingInterval=setInterval(()=>{
        textElement.innerText+=(currentWordIndex===0 ? '':' ')+words[currentWordIndex]
        currentWordIndex++;
        if(currentWordIndex===words.length){
            clearInterval(typingInterval);
            localStorage.setItem("savedChats",chatList.innerHTML)
        }
    },75);
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
             
    </div> 
    <span class="icon material-symbols-rounded" onclick="copyMessage(this)">
        content_copy
    </span>`
const inComingMessageDiv= createMessageElement(htmlElement,"incoming","loading");
chatList.appendChild(inComingMessageDiv);
generateAPIResponse(inComingMessageDiv);
}

const handleOutgoingChat=()=>{
    userMessage=typingForm.querySelector(".typing-input").value.trim() || userMessage;
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
    document.body.classList.add("hide-header");
    setTimeout(showloadingAnimation,500);
    
}
const copyMessage=(copyIcon)=>{
    const messageText = copyIcon.parentElement.querySelector(".text").innerText;
    navigator.clipboard.writeText(messageText);
    copyIcon.innerText="done";
    setTimeout(()=>copyIcon.innerText="content_copy",1000);

}

typingForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    handleOutgoingChat();
})

toggleThemeButton.addEventListener("click",()=>{
   const isLightMode= document.body.classList.toggle("light_mode");
   localStorage.setItem("themeColor", isLightMode ? "light_mode" : "dark_mode");
   toggleThemeButton.innerText= isLightMode ? "dark_mode" : "light_mode";
})

deleteButton.addEventListener("click",()=>{
    if(confirm("Are you sure you want to delete all mesages?")){
        localStorage.removeItem("savedChats");
        loadLocalStorageData();
    }
});

suggestions.forEach(suggestion => {
    suggestion.addEventListener("click",()=>{
        userMessage = suggestion.querySelector(".text").innerText;
        handleOutgoingChat();
    })
});