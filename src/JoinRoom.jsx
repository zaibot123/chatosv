import React from "react";
import './App.css'
import { useState,useContext,useRef } from "react";
import { useNavigate } from "react-router-dom";
import {UserContext} from './UserContext'
import { HubConnectionBuilder } from '@microsoft/signalr';
import {
  createSignalRContext, // SignalR
  createWebSocketContext, // WebSocket
  createSocketIoContext, // Socket.io
} from "react-signalr";


function JoinRoom(roomID,e){



let [nameState,setNameState]=useState("")
let [id, setID] = useState("")
const navigate = useNavigate();
const [messages, setMessage] = useState([]);
let {name, setName} = useContext(UserContext)
const [ connection, setConnection ] = useState(null);
const [ chat, setChat ] = useState([]);
const latestChat = useRef(null);
latestChat.current = chat;


const makeAndSendCreateRoomRequest= async () => {
    var room_nr=Math.floor(Math.random() * 101000);
    //on client for now, server should respond with room ID
    setName(nameState);
    try {
    const response1 = await fetch('http://localhost:5001/createRoom',
    {
        Method: 'POST',
        Headers: {
          Accept: 'application.json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"user": name}),
        Cache: 'default'
      });
    
      console.log(response1)
      
    if (response1.status===200){
        //reroute to created room
        //aquire key from host
    }
  }
    catch (error) {
      navigate("/chat/"+room_nr);
      setName(nameState);

    }

};

function join(name,id){
  setName(name)
  navigate("/chat/"+id)

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

<button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"onClick={()=>makeAndSendCreateRoomRequest()}>
 Dont have a room? Create one here!
</button>
</form>


    </>


  )
}

export default JoinRoom;    