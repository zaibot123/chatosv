import React from "react";
import './App.css'

import { useState,useContext,useRef } from "react";
import { useNavigate } from "react-router-dom";
import {UserContext} from './UserContext'
import {ConnectionContext} from './ConnectionContext'
import { HubConnectionBuilder } from '@microsoft/signalr';
import {
  createSignalRContext, // SignalR
  createWebSocketContext, // WebSocket
  createSocketIoContext, // Socket.io
  JsonHubProtocol,
  HubConnectionState,
  LogLevel
} from "react-signalr";
import keyManager from "./keyManager";



function JoinRoom(){



let [nameState,setNameState]=useState("")
let [connectionState,setConnectionState]=useState("")
let [id, setID] = useState("")
const navigate = useNavigate();
const [roomID, setRoomID] = useState();
let {name, setName} = useContext(UserContext)
let {connection, setConnection} = useContext(ConnectionContext)
const [ chat, setChat ] = useState([]);
const latestChat = useRef(null);
latestChat.current = chat;
var keymanager= new keyManager()


const makeAndSendCreateRoomRequest= async () => {



  console.log(keymanager.GenerateAESKey())
  console.log(keymanager.generateRSAKeyPair())



  var connectionToCreate = new HubConnectionBuilder().withUrl("http://localhost:100/chatHub").build();
  connectionToCreate.start().then(function ()
  {
    setConnection(connectionToCreate);
    connectionToCreate.invoke("CreateRoom", name)
  }).catch(function (err) {
    console.log(err)
    })
};

function join(name,id){
  var connectionToJoin = new HubConnectionBuilder().withUrl("http://localhost:100/chatHub")
  connectionToJoin.start().then(function ()
  {

    try {
      setConnection(connectionToJoin);
      connectionToJoin.invoke("JoinRoom", name, id)
      navigate("/chat/"+id)
    } catch (error) {
      navigate("/404/"+id)    
    }
  }
  )

}

if (connection){
  console.log("2")
    connection.on("ReceiveGroupName",
    function (roomID) {
    console.log("roomID")
    setRoomID(roomID)
    setName(name)
    console.log(roomID)
    navigate("/chat/"+roomID)
  })
  } 



return (
    <>
    <div class="flex mb-0">
  <div class="w-1/4 bg-blue-500 h-12">
  <h1 class="flex items-center text-5xl font-extrabold dark:text-white">funchat </h1>
  </div>
  <div class="w-3/4 bg-blue-700 h-12">
    
    
  </div>
</div>



<form className="bg-blue-300 shadow-md rounded px-100 pt-3 pb-8 mb-0 display:block z-0z-">
  
      <label>Name:
      <input
        type="name"
        placeholder="enter your name"
        className="me-2"
        aria-label="name" 
        value={nameState}
        onChange={e => setNameState(e.target.value)}
      />
      </label>

</form>

  


<form className="bg-blue-300 shadow-md rounded px-80 pt-6 pb-8 mb-4 display:block z-10z-40">
  
      <label>Room Code:
      <input
        type="id"
        placeholder=""
        className="me-2"
        aria-label="id" 
        value={id}
        onChange={e => setID(e.target.value)}
      />
      </label>

<button type="button"  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"onClick={()=> join(nameState,id)}>
  Join room!
</button>
<br></br>

<button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"onClick={()=>makeAndSendCreateRoomRequest(name)}>
 Dont have a room? Create one here!
</button>
</form>


    </>


  )
}

export default JoinRoom;    