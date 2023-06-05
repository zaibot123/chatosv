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
import { connect } from "socket.io-client";

var keymanager= new keyManager("1","2","3","4", "5");


function JoinRoom(){
  
  

  let [nameState,setNameState]=useState("")
  let [connectionState,setConnectionState]=useState("")
  let [id, setID] = useState("")
  const navigate = useNavigate();
  const [roomID, setRoomID] = useState();
  let {name, setName} = useContext(UserContext)
  let {connection, setConnection} = useContext(ConnectionContext)
  
  
  // To send a notification for SignalR backend to create a room
  //  and add the participant 
  async function makeAndSendCreateRoomRequest() {
    setName(nameState)
   await keymanager.GenerateAESKey();
    
    var connectionToCreate = new HubConnectionBuilder().withUrl("http://localhost:100/chatHub").withAutomaticReconnect().build();
    await connectionToCreate.start()
    .then(function ()
    {
      setConnection(connectionToCreate);
      connectionToCreate.invoke("CreateRoom", nameState)
    }).catch(function (err) {
      console.log(err)
    })
    
  };

  
  
  
  
  
  // To send a notification for SignalR backend to join participant to a room
  async function join(user,id){
    await keymanager.generatePublicKey();
    setNameState(user)
    if (nameState==="") {
      nameState = "Anon"
    }
    setName(nameState)
    setRoomID(id)
    var connectionToJoin = new HubConnectionBuilder().withUrl("http://localhost:100/chatHub").withAutomaticReconnect().build();
    await connectionToJoin.start()
    
    .then(async function() {
      setConnection(connectionToJoin);
      await connectionToJoin.invoke("JoinRoom", nameState, id, keymanager.publicKeyAsString);
    }
    )
  }
  
  
  // All the methods called by the SignalR backend when 
  // communicating via sockets. 
  if (connection){
    connection.onreconnected(connectionId => {
    connection.invoke("JoinRoom", name, roomID, keymanager.publicKeyAsString);
  });
  
  // Receive the generated room id
  connection.on("ReceiveGroupName",
  function (roomID) {
    setRoomID(roomID)
    navigate("/chat/"+roomID, {state:{keys:keymanager}})
  }
  )
  
  // 
  connection.on("SendKey",
  async (publicKey) => {
    let encryptedAES = await keymanager.importRsaKey(publicKey);
    let encryptedAESkey=  await keymanager.encryptAESKeyWithPublicKey(encryptedAES);
    return encryptedAESkey;
  }
  )
  
  connection.on("ReceiveKey",
  async function (encryptedAESKey){
    await keymanager.decrpytAESKey(encryptedAESKey)
    navigate("/chat/"+id, {state:{keys:keymanager}})
  }
  )
} 



return (
    <>
    <div class=" gap-y-10 gap-x-10 ">
    <div class="flex mb-0 ">
  <div class="w-2/5 bg-blue-500 h-12">
  <h1 class="flex items-center text-5xl font-extrabold dark:text-white">funchat </h1>
  </div>
  <div class="w-3/5 bg-blue-700 h-12">
    
    
  </div>
</div>



<form className="  bg-blue-300 shadow-md rounded px-100 pt-3 pb-8 mb-0 display:block z-0z- ">
  
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

  


<form className="bg-blue-300 shadow-md rounded px-100 pt-3 pb-8 mb-0  display:block z-0z-  ">
  
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

<button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"onClick={()=>makeAndSendCreateRoomRequest()}>
 Dont have a room? Create one here!
</button>
</form>
        </div>


    </>


  )
}

export default JoinRoom;    