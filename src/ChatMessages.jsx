import React from "react";
import './App.css'


function ChatMessage({message}){
    return(
    <div className>
    <div className={`${message.isMessageFromUser? "text-right": "text-left"}`}>
	<div className={`${message.isMessageFromUser? "bg-teal-400 p-5 rounded-3xl my-6" : "bg-green-400 p-5 rounded-3xl my-6 "} space-y-20`}>
		{message.textContent}
        </div>
    {message.author}, {message.timestamp}
</div>
</div>
    )
}
export default ChatMessage;