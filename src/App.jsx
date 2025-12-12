import { useState, useEffect } from "react";
import "./App.css";
import { logo } from "./assets"; // Adjust the path as necessary
import { Copy, Check } from "lucide-react";


function App() {
  const [currentUrl, setCurrentUrl] = useState("");
  const [currentDomain, setCurrentDomain] = useState("");
  const [isSecure, setIsSecure] = useState(true);
  const [copyUrl, setCopyUrl] = useState(false);
  const [copyUrl1, setCopyUrl1] = useState(false);
  const [pageText, setPageText] = useState("");
  useEffect(() => {
    // Check if running in a Chrome extension environment
    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs && tabs.length > 0) {
          const activeTab = tabs[0];
          setCurrentUrl(activeTab.url);

          try {
            const urlObject = new URL(activeTab.url);
            setCurrentDomain(urlObject.hostname);
            setIsSecure(urlObject.protocol === "https:");
          } catch (e) {
            console.error("Invalid URL:", e);
            setCurrentDomain("N/A");
            setIsSecure(false);
          }
        }
      });
    } else {
    }
  }, []); // Empty dependency array ensures this runs once on component mount

useEffect(()=>{
if(typeof chrome!=="undefined" && chrome.tabs){
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs.length > 0) {
      const activeTab = tabs[0];
      chrome.tabs.sendMessage(
        activeTab.id,
        { type: "PAGE_TEXT" },
        (response) => {
          if (response && response.text) {
            setPageText(response.text);
            console.log("Received text from content script");
          } else {
            console.log("No response or text from content script");
          }
        }
      );
    }
  });

}

  
},[])






  return (
    <div className="  flex flex-col  bg-neutral-950">
      <div className=" shadow-xl p-3 px-6 w-[350px]   ">
        <header>
          <img src={logo} alt="" width={100} height={70} />
        </header>
        <div className="mt-5 p-3 flex justify-center rounded-lg bg-blue-900/10 backdrop-blur-2xl shadow-lg border border-white/20">
          <p className="text-sm text-white font-medium drop-shadow ">
            Manage cookies and check site info
          </p>
        </div>

        {/* URL and Domain Info */}
        <div className="mt-3 mb-4 rounded-lg  backdrop-blur-md shadow-md  text-sm">
          <div className=" flex items-center mb-2 p-2 ">
            <img
              src={`https://www.google.com/s2/favicons?domain=${currentDomain}&sz=64`}
              alt=""
              className="w-6 h-6 mr-2 rounded-full"
            />
           

            <div className="flex  items-start   w-full overflow-hidden justify-between">
              <div className="flex flex-col   items-start    w-[76%] overflow-hidden">
              <span className="text-gray-200 text-sm truncate">
                {currentDomain || "example.com"}
              </span>
              
                <span className="text-gray-200 text-xs truncate ">
                {currentUrl || "https://example.com"}
              </span>
             
              </div>
               <button onClick={() => {
                  navigator.clipboard.writeText(currentUrl);
                  setCopyUrl(true);
                  setTimeout(() => setCopyUrl(false), 2000);
                }} className=" flex items-center mt-1   justify-center rounded-lg bg-indigo-600 text-white text-sm font-medium shadow-md hover:bg-indigo-700 transition  ">
{copyUrl ? <Check className="w-4 h-4" />: <Copy className="w-4 h-4"  />}
              </button>
            </div>
          </div>

          <div className=" shadow-md rounded-2xl p-4  ">
  <div className="border-b border-amber-200 pb-2 mb-3">
    <h2 className="text-xl font-extrabold text-left ">Site Info </h2>
  </div>

  <button onClick={() => {
                  navigator.clipboard.writeText(pageText);
                  setCopyUrl1(true);
                  setTimeout(() => setCopyUrl1(false), 2000);
                }} className=" flex items-center mt-1   justify-center rounded-lg bg-indigo-600 text-white text-sm font-medium shadow-md hover:bg-indigo-700 transition  ">
{copyUrl1 ? <Check className="w-4 h-4" />: <Copy className="w-4 h-4"  />}
              </button>
  <div className="text-white leading-relaxed  text-left ">
    {pageText}
  </div>
</div>

          

          {/* Security status */}
          <div>
            <span
              className={`font-semibold ${
                isSecure ? "text-green-400" : "text-red-400"
              }`}
            >
              {isSecure ? "✅ Secure Connection" : "⚠️ Insecure Connection"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
