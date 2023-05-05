import React from "react";
import ChatMessage from "./ChatMessages";
import { useParams } from "react-router-dom";
import TextBox from "./TextBox";
import { useState, useEffect, useContext } from "react";
import {UserContext} from "./UserContext";
import {ConnectionContext} from "./ConnectionContext";
import { io } from 'socket.io-client';
import { useNavigate, useLocation} from "react-router-dom";
import FileUploadPage from "./FileUploader";
import { HubConnectionBuilder } from '@microsoft/signalr';



function ListOfChatMessages({listOfChatMessages, roomName}){

let [text, setText] = useState("")
const {state} = useLocation();
const {keys} = state;
let params  = useParams();
let roomid=params.roomid
const navigate = useNavigate();
//const socket= io('http://localhost:4000/'+roomid);
let {name,setName}=useContext(UserContext);
let {connection,setConnection}=useContext(ConnectionContext);
let[loading,setLoading]=useState(false);
let [list,setList] =useState([])
let [key,setKey]=useState(5)



const incrementCount = () => {
    console.log({name})
    console.log(key)
    // Update state with incremented value
    setKey(key + 1);
  };
  
function leaveRoom(){
  if(connection){
    connection.stop();
    navigate("/");
  }
  navigate("/");
  }


async function handleSubmit(){

  //makeAndSendJoinRequest(id,e);
  let today = new Date();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  let newmessage= { message: text, author:name ,  isMessageFromUser:true,messageID:key,timestamp:  time}
  var newArray=list
  incrementCount();
 // socket.emit(newmessage)
  newArray.push(newmessage)
  let encryptedMessage=await window.crypto.subtle.encrypt(AesCbcParams, keymanager.AESKey, newmessage.message)
  connection.invoke("SendMessage", encryptedMessage).catch(function (err) {
    console.log(err)
  })
  setList(newArray);
}


if (connection){
  connection.on("ReceiveMessage",
  function (user, message) {
  let today = new Date();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  let newmessage= { message: message, author:user ,  isMessageFromUser:false,messageID:key,timestamp:  time}
  var newArray=[]
list.forEach(element => {
newArray.push(element)
  });
  incrementCount();
  newArray.push(newmessage)
  setList(newArray);
})
}


  /*
connection.on("ReceiveMessage",
function (user, message) {
console.log(message)
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
let newmessage= { message: message, author:author ,  isMessageFromUser:false,messageID:key,timestamp: time}
var newArray=list
incrementCount();
newArray.push(newmessage)
console.log("Trying to set List")
setList(newArray)
console.log("List set")

});
*/



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
    <FileUploadPage keyManager={keys}></FileUploadPage>
</>
)

}

export default ListOfChatMessages;