import React from "react";
import ChatMessage from "./ChatMessages";


function ListOfChatMessages({listOfChatMessages, roomName}){

const listt=[ 
    { message: 'Own message', user: 3, isMessageFromUser:true, messageID:1},
    { message: 'Received Message 1', user: 2,  isMessageFromUser:false,messageID:2},
    { message: 'Received Message 2', user: 2,  isMessageFromUser:false,messageID:3}
]

return(
<>
<p class="text-center">Messages for roomName</p>
{listt.map(x => <ChatMessage message={x} key={x.messageID}/>)}
</>
)

}

export default ListOfChatMessages;