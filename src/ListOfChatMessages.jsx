import React from "react";
import ChatMessage from "./ChatMessages";
import { useParams } from "react-router-dom";
import TextBox from "./TextBox";
import { useState, useEffect, useContext } from "react";
import {UserContext} from "./UserContext";
import { io } from 'socket.io-client';
import { useNavigate } from "react-router-dom";




function ListOfChatMessages({listOfChatMessages, roomName}){
let [text, setText] = useState("")
let params  = useParams();
let roomid=params.roomid
const navigate = useNavigate();
//const socket= io('http://localhost:4000/'+roomid);
let {name,setName}=useContext(UserContext);
let [list,setList] =useState([
    { message: 'Own message', author: "Tobias", isMessageFromUser:true, messageID:1,timestamp:"13:54"},
    { message: 'Received Message 1', author: "Mads",  isMessageFromUser:false,messageID:2,timestamp:"14:08"},
    { message: 'Received Message 2', author: "Kata",  isMessageFromUser:false,messageID:3,timestamp:"15:55"}
])
let [key,setKey]=useState(5)
useEffect(() => {
//socket.on("receive_message",(data) =>{setText(data)}); 

  },[text]);
const incrementCount = () => {
    console.log({name})
    console.log(key)
    // Update state with incremented value
    setKey(key + 1);
  };
  
function leaveRoom(){
   // socket.emit("Leaving,"+name)
  //  socket.close();
    navigate("/");
  }

function handleSubmitRealCase(){ 

    let newmessage= { message: text, author:name ,  isMessageFromUser:true,messageID:key,timestamp:"15:55"}
    socket.emit(newmessage)
    setList(newArray);
}

function handleSubmit(){
  let today = new Date();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  let newmessage= { message: text, author:name ,  isMessageFromUser:true,messageID:key,timestamp:  time}
  var newArray=list
  incrementCount();
 // socket.emit(newmessage)
  newArray.push(newmessage)
  setList(newArray);
}




return(
<>
<div class="flex mb-0">
  <div class="w-1/10">
  <button type="button"  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"onClick={(e)=>leaveRoom() }>
  Leave room
</button>
  </div>
  </div>
  <div class="">
    </div>
    
<p className="text-3xl text-center">Hey {name}
<br></br>
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