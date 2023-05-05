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
var keymanager= new keyManager()


 async function makeAndSendCreateRoomRequest() {



  await keymanager.GenerateAESKey()
  await keymanager.generateRSAKeyPair()

  var connectionToCreate = new HubConnectionBuilder().withUrl("http://localhost:100/chatHub").build();
  connectionToCreate.start().then(function ()
  {
    setConnection(connectionToCreate);
    connectionToCreate.invoke("CreateRoom", name)
  }).catch(function (err) {
    console.log(err)
    })
};

async function join(name,id){
  // await keymanager.generateRSAKeyPair();
  
  var connectionToJoin = new HubConnectionBuilder().withUrl("http://localhost:100/chatHub").build();
  connectionToJoin.start().then(function ()
  {
    
    try {
      setConnection(connectionToJoin);
      // console.log("public key: " + JSON.stringify(keymanager.publicKey))
      // connectionToJoin.invoke("JoinRoom", name, id, JSON.stringify(keymanager.publicKey))
      connectionToJoin.invoke("JoinRoom", name, id, "key")
      navigate("/chat/"+id, {state:{keys:keymanager}})
    } catch (error) {
      console.log(error)
      navigate("/404/")    
    }
  }
  )

}



if (connection){
    connection.on("ReceiveGroupName",
    function (roomID) {
    console.log("roomID")
    setRoomID(roomID)
    setName(name)
    console.log(roomID)
    navigate("/chat/"+roomID, {state:{keys:keymanager}})
  }
  )

   connection.on("SendKey",
   
   async (publicKey) => {
    // let RsaObject= new window.crypto.subtle.RsaHashedImportParams("RSASSA-PKCS1-v1_5", "SHA-256")
    // let publicKeyArrayBuffer=keymanager.str2ab(publicKey)
    // let publicKeyObject=importKey("spki", publicKeyArrayBuffer, RsaObject, true, encrypt)
    // let encryptedAES = await window.crypto.subtle.encrypt(
    //   {
    //     name: "RSA-OAEP",
    //   },
      
    //   // publicKeyObject,
    //   publicKeyObject,
    //   keymanager.AESKey
    // );

  
    // let encryptedAES=  keymanager.encryptAESKeyWithPublicKey(publicKey)
    console.log(JSON.stringify(encryptedAES))
  
  
   let promise = new Promise((resolve, reject) => {
        setTimeout(() => {
            // resolve(JSON.stringify(encryptedAES));
            resolve(encryptedAES);
        }, 100);
    });
    return promise; 
  
  }
    
    // async function (publicKey){
    //  let encryptedAES=keymanager.encryptAESKeyWithPublicKey(publicKey)
   )
   
   connection.on("ReceiveKey",
   function (encryptedAESKey){
    // set the encrypted symmetric key
  keymanager.AESKey(encryptedAESKey)
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

<button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"onClick={()=>makeAndSendCreateRoomRequest(name)}>
 Dont have a room? Create one here!
</button>
</form>


    </>


  )
}

export default JoinRoom;    