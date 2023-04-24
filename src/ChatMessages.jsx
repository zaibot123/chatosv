import React from "react";
import './App.css'

function ChatMessage({message}){
    console.log(message.isMessageFromUser)
    return(
    <div className>
      
    <div className={`${message.isMessageFromUser? "text-right": "text-left"}`}>
	<div className={`${message.isMessageFromUser? "bg-teal-400 p-5 rounded-3xl my-6" : "bg-green-400 p-5 rounded-3xl my-6 "} space-y-20`}>
		{message.message}
	</div>
    
</div>
</div>

    )
}
export default ChatMessage;