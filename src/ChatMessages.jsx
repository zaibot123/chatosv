import React from "react";
import './App.css'
import { useState } from "react";


function ChatMessage({showEncryptedMessage,message,file=false,handleDownload}){
    let [change, setChange] = useState(showEncryptedMessage);

    if (message.fileId != "message" )
    {
        console.log("test: " + message.fileId)
      return (
        <div className>
            AJAJAJAJ
    <div className={`${message.isMessageFromUser? "text-right": "text-left"}`}>
	<div className={`${message.isMessageFromUser? "bg-teal-400 p-5 rounded-3xl my-6" : "bg-green-400 p-5 rounded-3xl my-6 "} space-y-20`}>
        <button onClick={()=>handleDownload(message.fileId)}>Download {showEncryptedMessage? message.encrypted: message.textContent}</button>

        </div>
    {message.author}, {message.timestamp}
 </div>
   </div>

      )
    }
    else{
    return(

    <div className>
    <div className={`${message.isMessageFromUser? "text-right": "text-left"}`}>
	<div className={`${message.isMessageFromUser? "bg-teal-400 p-5 rounded-3xl my-6" : "bg-green-400 p-5 rounded-3xl my-6 "} space-y-20`}>
    {showEncryptedMessage? "encrypted message" + message.encrypted.body + " \n v:" + message.encrypted.iv: message.textContent}

        </div>
    {message.author}, {message.timestamp}
</div>  
</div>
    )
    }
}
export default ChatMessage;


