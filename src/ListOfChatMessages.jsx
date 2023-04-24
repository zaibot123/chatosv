import React from "react";
import ChatMessage from "./ChatMessages";
import { useParams } from "react-router-dom";
import TextBox from "./TextBox";
import { useState, useEffect, useContext } from "react";
import {UserContext} from "./UserContext";


function ListOfChatMessages({listOfChatMessages, roomName}){
let [text, setText] = useState("")
let {name,setName}=useContext(UserContext);
let [list,setList] =useState([
    { message: 'Own message', author: "Tobias", isMessageFromUser:true, messageID:1,timestamp:"13:54"},
    { message: 'Received Message 1', author: "Mads",  isMessageFromUser:false,messageID:2,timestamp:"14:08"},
    { message: 'Received Message 2', author: "Kata",  isMessageFromUser:false,messageID:3,timestamp:"15:55"}
])
let [key,setKey]=useState(5)
useEffect(() => {

  },[text]);
const incrementCount = () => {
    console.log({name})
    console.log(key)
    // Update state with incremented value
    setKey(key + 1);
  };
  

function handleSubmit(){ 
    if(text){}
    let newmessage= { message: text, author:name ,  isMessageFromUser:true,messageID:key,timestamp:"15:55"}
    var newArray=list
    incrementCount();
    newArray.push(newmessage)
    setList(newArray);
}


let params  = useParams();
let roomid=params.roomid



return(
<>
<p className="text-center">Hey {name}

Welcome to room {roomid}</p>
{list.map(x => <ChatMessage message={x} key={x.messageID}/>)}
<div>
      <form >
        <textarea value={text} onChange={e => setText(e.target.value)} />
        <button type="button" onClick={handleSubmit}>Print Text </button>
      </form>
    </div>
</>
)

}

export default ListOfChatMessages;