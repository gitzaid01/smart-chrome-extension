console.log("Content script loaded");

function grabTextFromPage() {
    // This function grabs all text from the page
    console.log("Grabbing text from page", document.body.innerText);
    // You can modify this to grab specific elements or text as needed
    return document.body.innerText;
    
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse)=>{
    if(message.type==="PAGE_TEXT"){
       const text = grabTextFromPage()
       sendResponse({text})
         console.log("Sent text to background script");
    }
    return true;
});
 
