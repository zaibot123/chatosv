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
import keyManager from "./keyManager";


function ListOfChatMessages({listOfChatMessages, roomName}){
  
  let [text, setText] = useState("")
  const {state} = useLocation();
  const {keys} = state;
  let params  = useParams();
  let roomid=params.roomid
  const navigate = useNavigate();
  let {name,setName}=useContext(UserContext);
  let {connection,setConnection}=useContext(ConnectionContext);
  let[loading,setLoading]=useState(false);
  let [listOfMessages,setListOfMessages] =useState([])
  let [key,setKey]=useState(0)

  // let keymanager = new keyManager(keys.publicKey, keys.privateKey, keys.AESKey, keys.publicKeyAsString, keys.AESKeyExported)
  let keymanager = new keyManager(keys)
  

// necessary to have a unique key for each message
const incrementClientMsgId = () => {
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
  incrementClientMsgId();

  // Setting of the structure of the message object
  let today = new Date();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  let messageToSend= { 
    textContent      :text, 
    author           :name ,  
    isMessageFromUser:true,
    messageID        :key + "a",
    timestamp        : time
  }

    // Setting values of the message object
  var temporaryMsgArray = listOfMessages
  temporaryMsgArray.push(messageToSend)
  setListOfMessages(temporaryMsgArray);
  
  // Encrypting the message for the receivers
  let encryptedMessage = await keymanager.encryptDataWithAESKey(messageToSend);
  
  // Send encrypted message to the server
  connection.invoke("SendMessage", encryptedMessage)
    .catch(function (err) {
      console.log(err)
    })
}

if (connection){
  // Invoked from servers sides whenever someone else sends a message
  connection.on("ReceiveMessage",
  async function (user, encryptedMsg, messageId) {
    try {
    
    
    setKey(messageId)
    // Decrypting the message received from the server
    let decryptedMsg = await keymanager.decryptMessageWithAES(encryptedMsg)
    let jsonMessage = JSON.parse(decryptedMsg)
    console.log(JSON.stringify(jsonMessage))
    // Setting values of the message object
    let today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let receivedMessage = { 
      textContent   : jsonMessage.textContent, 
        author    :user ,  
        isMessageFromUser:false,
        messageID :messageId,
        timestamp :  time}

    // Adding the messages to current client's screen  
    var temporaryMsgArray =[]
    listOfMessages.forEach(element => {
      temporaryMsgArray.push(element)
    });
    temporaryMsgArray.push(receivedMessage)
    setListOfMessages(temporaryMsgArray);
  
  } catch (error) {
    console.log(error)
  }  
})
}

/* 
async function encryptDataWithAESKey(key,plainText) {
  
  let plainTextAB = keymanager.str2ab(JSON.stringify(plainText))
  
  let  iv = window.crypto.getRandomValues(new Uint8Array(16));
  let encrypteText = await window.crypto.subtle.encrypt(
    {
      name: "AES-CBC",
      iv: iv,
    },
    key, 
    plainTextAB 
    )
    .catch(function (err) {
      console.error(err);
    });
    let encryptedDataWithPlainIV={iv:keymanager.ab2str(iv),body:keymanager.ab2str(encrypteText)}
  return encryptedDataWithPlainIV
}
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
{listOfMessages.map(x => <ChatMessage message={x} key={x.messageID}/>)}

<div>
      <form >
        <textarea value={text} onChange={e => setText(e.target.value)} />
        <button type="button" onClick={handleSubmit}>Print Text </button>
      </form>
    </div>
    <FileUploadPage keys={keys}room={roomName}handleSubmit={handleSubmit}></FileUploadPage>
</>
)

}

export default ListOfChatMessages;