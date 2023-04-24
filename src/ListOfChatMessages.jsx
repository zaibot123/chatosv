import React from "react";
import ChatMessage from "./ChatMessages";
import { useParams } from "react-router-dom";
import TextBox from "./TextBox";
useParams


function ListOfChatMessages({listOfChatMessages, roomName}){
let params  = useParams();
let roomid=params.roomid


const listt=[ 
    { message: 'Own message', author: "Tobias", isMessageFromUser:true, messageID:1,timestamp:"13:54"},
    { message: 'Received Message 1', author: "Mads",  isMessageFromUser:false,messageID:2,timestamp:"14:08"},
    { message: 'Received Message 2', author: "Kata",  isMessageFromUser:false,messageID:3,timestamp:"15:55"}
]

return(
<>
<p className="text-center">Welcome to room {roomid}</p>
{listt.map(x => <ChatMessage message={x} key={x.messageID}/>)}
<TextBox></TextBox>
</>
)

}

export default ListOfChatMessages;