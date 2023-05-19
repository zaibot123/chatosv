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
    <s></s>
   await keymanager.GenerateAESKey();
    
    
    
    var connectionToCreate = new HubConnectionBuilder().withUrl("http://localhost:100/chatHub").build();
    await connectionToCreate.start()
    .then(function ()
    {
      setConnection(connectionToCreate);
      connectionToCreate.invoke("CreateRoom", name)
    }).catch(function (err) {
      console.log(err)
    })
    
  };

  
  
  
  
  
  // To send a notification for SignalR backend to join participant to a room
  async function join(name,id){
    await keymanager.generatePublicKey();
    var connectionToJoin = new HubConnectionBuilder().withUrl("http://localhost:100/chatHub").build();
    await connectionToJoin.start()
    .then(async function() {
      setConnection(connectionToJoin);
      await connectionToJoin.invoke("JoinRoom", name, id, keymanager.publicKeyAsString);
      // navigate("/chat/"+id, {state:{keys:keymanager}})
    }
    )
    

    /*
    
    .then(function ()
    
    {
      setConnection(connectionToJoin);
      
      try {
      // setConnection(connectionToJoin);
      connectionToJoin.invoke("JoinRoom", name, id, keymanager.publicKey);
      navigate("/chat/"+id, {state:{keys:keymanager}})
    } catch (error) {
      console.log(error)
      navigate("/404/")    
    }
  }
  )
  */

}


// All the methods called by the SignalR backend when 
// communicating via sockets. 
if (connection){

    // Receive the generated room id
    connection.on("ReceiveGroupName",
    function (roomID) {
    setRoomID(roomID)
    setName(name)
    navigate("/chat/"+roomID, {state:{keys:keymanager}})
  }
  )

  // 
   connection.on("SendKey",
   async (publicKey) => {
    let encryptedAES = await keymanager.importRsaKey(publicKey);
    let encryptedAESkey=  await keymanager.encryptAESKeyWithPublicKey(encryptedAES);
    return encryptedAESkey;

  //  let promise = new Promise((resolve, reject) => {
  //       setTimeout(() => {
  //           resolve(encryptedAESkey);
  //       }, 100);
  //   });
  //   return promise; 
  }
   )
   
   connection.on("ReceiveKey",
   async function (encryptedAESKey){
    // set the encrypted symmetric key
    await keymanager.decrpytAESKey(encryptedAESKey)
    navigate("/chat/"+id, {state:{keys:keymanager}})


    // console.log("private key: " + keymanager.privateKey)
    // keymanager.AESKey = encryptedAESKey;
    // keymanager.AESKey(encryptedAESKey);
   }
   )





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

<button type="button"  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"onClick={()=> preJoin()}>
 PRE Join room!
</button>
<br></br>

<button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"onClick={()=>makeAndSendCreateRoomRequest()}>
 Dont have a room? Create one here!
</button>
</form>


    </>


  )
}

export default JoinRoom;    