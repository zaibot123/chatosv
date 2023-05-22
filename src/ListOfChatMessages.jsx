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
  // let [messageID,setMessageID]=useState(0)
  let messageID = 1;

  useEffect(() => {
    // Update the document title using the browser API
    console.log("!!")
  });

//   const scrollRef = useRef();

// useEffect(() => {
//   scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
// }, [listOfMessages]);

  // let keymanager = new keyManager(keys.publicKey, keys.privateKey, keys.AESKey, keys.publicKeyAsString, keys.AESKeyExported)
  let keymanager = new keyManager(keys)
  
  async function handleDownload(id){
    const url = "http://77.33.131.228:3000/api/databaseapi/"+id

    let result = await fetch(url, {
      method: "GET" // default, so we can ignore
  })
    .then(result => result.json())
  //  let  BA=    utf8Encode.encode(result.fileData);
  // let  fileByteArray=    utf8Encode.encode(decryptedResult.data);
  // let utf8Encode = new TextEncoder();
  // let  fileByteArray=    utf8Encode.encode(result);
    
    let decrypted =  await keymanager
    .decryptFileWithAES(
      {iv: result.iv,
        body : result.fileData
      }
      )
      // let json = JSON.parse(decrypted)
      // var blob = new Blob([decrypted], { type: result.extension });
      console.log("decrypted: " + JSON.stringify(result))
      var blob = new Blob([decrypted], { type: "application/pdf" });

    saveAs(blob, result.fileName)
    // let decMsg = keymanager.ab2str(decrypted)
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
  // Setting of the structure of the message object
  let today = new Date();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  let messageToSend;
  let encryptedBody = await keymanager.encryptDataWithAESKey(text)
  console.log(encryptedBody)
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
     messageToSend= { 
      fileId: "message",
      textContent      :text, 
      encrypted: encryptedBody,
      // textContent      :"text", 
      author           :name ,  
      isMessageFromUser:true,
      messageId        :messageID +1 ,
      timestamp        : time
    }
  }
  // setMessageID(key + "a")
    // Setting values of the message object
    setListOfMessages(function (x) {
      const temporaryMsgArray = [...x];
      temporaryMsgArray.push(messageToSend)
      return temporaryMsgArray  
    } );
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

  connection.on("GetRoomId", function (messageId) {
    try {
      const msgID = messageId
      // messageID = msgID
      messageID = messageId
      console.log("messageID: " + messageID)
      connection.off("GetRoomId")
    } catch (error) {
      console.log(error)
    }  
  }
  )


  // Invoked from servers sides whenever someone else sends a message

  connection.on("ReceiveMessage",

    async function (user, encryptedMsg, messageId) {
      try {
        messageID = messageId
        console.log("message" + messageId)
        // setMessageID(messageId)

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
          
          // Adding the messages to current client's screen  
          // const temporaryMsgArray = [...listOfMessages];
          // temporaryMsgArray.push(receivedMessage)
          // setListOfMessages(temporaryMsgArray);
          setListOfMessages(function (x) {
            const temporaryMsgArray = [...x];
            temporaryMsgArray.push(receivedMessage)
            return temporaryMsgArray  
          } );
          console.log("length: " + listOfMessages.length)
          
        } catch (error) {
          console.log(error)
        }  
        connection.off("ReceiveMessage")
      }
      )

      
    }

const handleChange = () => {
  console.log(changeText)
  console.log("!!!")
  return setChangeText(!changeText);
};


console.log(changeText)
return (
  <>
    <div className="flex mb-0">
      <div className="w-1/10">
        <div>
          <button onClick={handleChange}>
            Toggle text representation
          </button>
          {changeText ? "Plaintext" : "Encrypted"}
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

    <div className="grid grid-row-4">
    <div className="flex flex-row h-screen height: 50vh">
        <div className="grid-row-span 2 w-1/5 flex max-h-full overflow-y-auto flex-col flex-grow bg-purple-50">
      <ChatComponent listOfChatMessages={listOfMessages} handleDownload={handleDownload} changeText={changeText}/>
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