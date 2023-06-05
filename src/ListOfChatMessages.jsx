import React from "react";
import ChatMessage from "./ChatMessages";
import { useParams} from "react-router-dom";
import TextBox from "./TextBox";
import { useState, useEffect, useContext } from "react";
import {UserContext} from "./UserContext";
import {ConnectionContext} from "./ConnectionContext";
import { io } from 'socket.io-client';
import { useNavigate, useLocation} from "react-router-dom";
import FileUploadPage from "./FileUploader";
import { HubConnectionBuilder } from '@microsoft/signalr';
import keyManager from "./keyManager";
import { saveAs } from 'file-saver';
import Toggle from './Toggle';
import  { useRef } from 'react';
import ChatComponent from "./ChatComponent";



function ListOfChatMessages({listOfChatMessages}){
  
  let [text, setText] = useState("")
  let [changeText, setChangeText] = useState(false);
  const {state} = useLocation();
  const {keys} = state;
  let params  = useParams();
  let roomid=params.roomid
  const navigate = useNavigate();
  let {name,setName}=useContext(UserContext);
  let {connection,setConnection}=useContext(ConnectionContext);
  let[loading,setLoading]=useState(false);
  let [listOfMessages,setListOfMessages] =useState([])
  let [messageID,setMessageID]=useState(1)
  // let messageID = 1;

  let keymanager = new keyManager(keys)
  
  async function handleDownload(id){
    const url = "http://77.33.131.226:3000/api/databaseapi/"+id

    let result = await fetch(url, {
      method: "GET" // default, so we can ignore
  })
    .then(result => result.json())
    
    let decrypted =  await keymanager
    .decryptFileWithAES(
      {iv: result.iv,
        body : result.fileData
      }
      )
      console.log("decrypted: " + JSON.stringify(result))
      var blob = new Blob([decrypted], { type: "application/pdf" });

    saveAs(blob, result.fileName)
    
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
  // Setting of the structure of the message object
  let msgID = await connection.invoke("GetMessageId")
  // messageID = msgID
  setMessageID(msgID)
  console.log("msgID: " + msgID)
  let textCont = text
  // let textCont = "holder"
  let today = new Date();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  let messageToSend;
  let encryptedBody = await keymanager.encryptDataWithAESKey(textCont)
  console.log(encryptedBody)
  if(isFile){
    messageToSend= { 
      fileId      :fileData.id, 
      textContent:fileData.name,
      author           :name ,  
      isMessageFromUser:true,
      messageId        :msgID ,
      timestamp        : time
    }
  } else{
     messageToSend= { 
      fileId: "message",
      textContent      :textCont, 
      encrypted: encryptedBody,
      author           :name ,  
      isMessageFromUser:true,
      messageId        :msgID,
      timestamp        : time
    }
  }
  setText("")
  // setMessageID(key + "a")
    // Setting values of the message object
    setListOfMessages(function (x) {
      const temporaryMsgArray = [...x];
      temporaryMsgArray.push(messageToSend)
      return temporaryMsgArray  
    } );
  // Encrypting the message for the receivers
  let encryptedMessage = await keymanager.encryptDataWithAESKey(messageToSend);
  // Send encrypted message to the server
  await connection.invoke("SendMessage", encryptedMessage)
  
}
// async function handleSendMessageAction(userMessage){
//   // other code
//   await connection.invoke("SendMessage", userMessage)
// }

useEffect(() => {
  if (connection){
  connection.on("ReceiveMessage", rsvMsg)
  //Runs only on the first render
  }
}, []);


  // connection.on("GetRoomId", function (messageId) {
  //   try {
  //     const msgID = messageId
  //     messageID = msgID
  //     // setMessageID(messageId)
  //     // messageID = messageId
  //     console.log("messageID: " + messageID)
  //     connection.off("GetRoomId")
  //   } catch (error) {
  //     console.log(error)
  //   }  
  // }
  // )

  // connection.on("ReceiveMessage",
  //     function (message) {
  //       // ... other code
  //       // display message
  //       connection.off("ReceiveMessage")
  // })

      

  async function rsvMsg(user, encryptedMsg, messageId) {
    // messageID = messageId
      setMessageID(messageId)
      
      // Decrypting the message received from the server
      let decryptedMsg = await keymanager.decryptMessageWithAES(encryptedMsg)
      let jsonMessage = JSON.parse(decryptedMsg)
      // Setting values of the message object
      let today = new Date();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      let receivedMessage = { 
        encrypted:encryptedMsg,
        fileId: jsonMessage.fileId,
        textContent   : jsonMessage.textContent, 
        author    : user ,  
        isMessageFromUser:false,
        messageId :messageId,
        timestamp :  time}
        console.log("3")
        
        // Adding the messages to current client's screen  
        setListOfMessages(function (x) {
          const temporaryMsgArray = [...x];
          temporaryMsgArray.push(receivedMessage)
          return temporaryMsgArray  
        } )

        // await connection.off("ReceiveMessage")
    // }



  // Invoked from servers sides whenever someone else sends a message
  
  

     
      // )
      
      
    }




const handleChange = () => {
  console.log(changeText)
  return setChangeText(!changeText);
};


console.log(changeText)
return (
  <>
    <div className="flex mb-0 ">
      <div className="w-1/10">
        <div>
          <button onClick={handleChange}>
            Toggle text representation: 
          </button>
          {changeText ? " Encrypted" : " Plaintext" }
        </div>
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={leaveRoom}
        >
          Leave room
        </button>
      </div>
    </div>

    <p className="text-3xl text-center">
      Hey {name}
      <br />
      Welcome to room {roomid}
    </p>

    <div className="grid grid-row-5 gap-5" >
   
      <ChatComponent listOfChatMessages={listOfMessages} handleDownload={handleDownload} changeText={changeText}/>
      
  <div Name = "test" class="
  grid grid-cols-8 gap-4 height: 5vh flex-grow: 0
  flex max-h-full overflow-y-auto overflow-x-auto flex-grow
  ">
  <textarea
    class=" col-span-6 flex-grow: 0
    rounded-[7px] border border-blue-gray-200  
    bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-
    gray-700 outline outline-0 transition-all placeholder-shown:border 
    placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-
    gray-200 focus:border-2 focus:border-pink-500 
    focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
  placeholder=" "  value={text} onChange={e => setText(e.target.value)}> 
  </textarea>
  <div class="grid grid-rows-5">
  <div></div>
  <button class = " bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded row-span-3 " 
  type="button" onClick={() => handleSubmit()} >Send <br></br>message </button>
  {/* type="button" onClick={() => handleSubmit(false)}>Send message </button> */}
  </div>
  </div>
  <FileUploadPage messageId={messageID}keys={keys}room={roomid} handleSubmit={handleSubmit}></FileUploadPage>
  </div>
  </>
  )
}

export default ListOfChatMessages;