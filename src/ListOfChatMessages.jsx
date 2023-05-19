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


function ListOfChatMessages({listOfChatMessages}){
  
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
  // let [key,setKey]=useState(0)
  // let [messageID,setMessageID]=useState(0)
  // let [messageID2,setMessageID2]=useState(0)
  let messageID = 0;
  let key = 0;

  // let keymanager = new keyManager(keys.publicKey, keys.privateKey, keys.AESKey, keys.publicKeyAsString, keys.AESKeyExported)
  let keymanager = new keyManager(keys)
  
  async function handleDownload(id){
    console.log("handleDownload id: " + id)
    const url = "http://77.33.131.228:3000/api/databaseapi/"+id

    let result = await fetch(url, {
      method: "GET" // default, so we can ignore
  })
    .then(result => result.json())
  //  let  BA=    utf8Encode.encode(result.fileData);
  console.log("decrypt" + await keymanager
    // .decryptFileWithAES(
    .decryptFileWithAES(
      result
      )+"decrypted")
  // let  fileByteArray=    utf8Encode.encode(decryptedResult.data);
  // let utf8Encode = new TextEncoder();
  // let  fileByteArray=    utf8Encode.encode(result);
  console.log("after")
  console.log(result)
    
    let decrypted =  await keymanager
    .decryptFileWithAES(
      {iv: result.iv,
        body : result.fileData
      }
      )


    console.log("decrypted: " + decrypted)
    // let decMsg = keymanager.ab2str(decrypted)
    let decMsg = decrypted
    console.log("DECRYPTED: " + decMsg)
  //  var blob = new Blob([fileByteArray], { type: decrypted.extention });
  // saveAs(blob, 'test'+decryptedResult.extension)
    
  }

// necessary to have a unique key for each message

function leaveRoom(){
  if(connection){
    connection.stop();
    navigate("/");
  }
  navigate("/");
  }


async function handleSubmit(isFile=false,fileData=""){
  // incrementClientMsgId();
console.log("HANDLE SUBMIT")
  // Setting of the structure of the message object
  let today = new Date();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  let messageToSend;
  if(isFile){
    messageToSend= { 
      fileId      :fileData.id, 
      textContent:fileData.name,
      // isFile:true,
      // textContent      :encrypted, 
      author           :name ,  
      isMessageFromUser:true,
      messageId        :messageID ,
      timestamp        : time
    }
  } else{
    console.log("SEND A MESSAGE, NOT A FILE FFS")
     messageToSend= { 
      fileId: "message",
      textContent      :text, 
      // textContent      :"text", 
      author           :name ,  
      isMessageFromUser:true,
      messageId        :messageID ,
      timestamp        : time
    }
  }
  // setMessageID(key + "a")
    // Setting values of the message object
  var temporaryMsgArray = listOfMessages
  temporaryMsgArray.push(messageToSend)
  setListOfMessages(temporaryMsgArray);
  
  // Encrypting the message for the receivers
  // Send encrypted message to the server
  let encryptedMessage = await keymanager.encryptDataWithAESKey(messageToSend);
  await connection.invoke("SendMessage", encryptedMessage)
  // await connection.off("SendMessage")
  // await connection.invoke("SendMessage", messageToSend)
  // console.log("Sending encrypted msg: " + encryptedMessage)
    
  .catch(function (err) {
    console.log(err)
  })
}

if (connection){
  console.log("if connection")

  connection.on("GetRoomId", function (messageId) {
    try {
      const msgID = messageId
      messageID = messageId
    // setMessageID(msgID)
    // setMessageID2(msgID)
    // console.log("messageID: " + messageID)
    // console.log("messageID2: " + messageID2)
    // console.log("messageId: " + messageId)
    // console.log("msgID: " + msgID)
    } catch (error) {
      console.log(error)
    }  
  }

  
  )

  // Invoked from servers sides whenever someone else sends a message
  connection.on("ReceiveMessage",
  async function (user, encryptedMsg, messageId) {
    try {
      console.log("RECEIVEDMESSAGE_ " + messageId)
      console.log("2RECEIVEDMESSAGE_ " + messageId)
      messageID = messageId
      // setMessageID(messageId)
      key = messageId;
      // setKey(messageId)
      // Decrypting the message received from the server
      let decryptedMsg = await keymanager.decryptMessageWithAES(encryptedMsg)
      let jsonMessage = JSON.parse(decryptedMsg)
      console.log(JSON.stringify(jsonMessage))
      // Setting values of the message object
      let today = new Date();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      console.log("id: " + JSON.stringify(jsonMessage.fileId))
      let receivedMessage = { 
        fileId: jsonMessage.fileId,
        textContent   : jsonMessage.textContent, 
        author    :user ,  
        isMessageFromUser:false,
        messageId :messageId,
        timestamp :  time}
        
        // Adding the messages to current client's screen  
        var temporaryMsgArray =[]
        await listOfMessages.forEach(element => {
          temporaryMsgArray.push(element)
        });
        await temporaryMsgArray.push(receivedMessage)
        await setListOfMessages(temporaryMsgArray);
        
      } catch (error) {
        console.log(error)
      }  
    })








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
<div class = "grid grid-row-4" >
  
  <div class=" flex flex-row h-screen	height: 50vh">
  <div class=" grid-row-span 2 w-1/5 flex max-h-full overflow-y-auto flex-col flex-grow bg-purple-50  ">

  {listOfMessages.map(x => <ChatMessage handleDownload={handleDownload} message={x} key={x.messageID}/>)}
  </div>
  </div>
  <div class="flex grow flex-grow: 1 grid grid-cols-7 gap-4">
          <textarea
          class=" col-span-6 peer h-1/2 min-h-[100px] w-full resize-none 
            rounded-[7px] border border-blue-gray-200 border-t-transparent 
            bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-
            gray-700 outline outline-0 transition-all placeholder-shown:border 
            placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-
            gray-200 focus:border-2 focus:border-pink-500 focus:border-t-transparent 
            focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
          placeholder=" "  value={text} onChange={e => setText(e.target.value)}> 
        </textarea>
      <div class="grid grid-rows-3">
        <div></div>
          <button class = "flex bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded " 
                  type="button" onClick={() => handleSubmit()} >Send message </button>
                  {/* type="button" onClick={() => handleSubmit(false)}>Send message </button> */}
      </div>
      </div>
      <FileUploadPage messageId={messageID}keys={keys}room={roomid} handleSubmit={handleSubmit}></FileUploadPage>
  </div>
</>
)

}

export default ListOfChatMessages;