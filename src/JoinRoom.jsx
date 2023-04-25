import React from "react";
import './App.css'
import { useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import {UserContext} from './UserContext'


function JoinRoom(roomID,e){

let [nameState,setNameState]=useState("")
let [id, setID] = useState("")
const navigate = useNavigate();
let {name, setName} = useContext(UserContext)


const makeAndSendJoinRequest = async (roomID) => {
setName(nameState);
const url='http://localhost:5001/'+roomID+'/join'
console.log(url)
alert(roomID)
const jsonBody={
    room:roomID,
    user:name
}
try {
let response1 = await fetch(url,
{
    Method: "POST",
    Headers: {
      Accept: 'application.json',
      'Content-Type': 'application/json'
    },
    Body: jsonBody,
    Cache: 'default'
  });

  if (response1.status===200){
    navigate("/chat/"+roomID);
    //make socketToRoom
  }

}
catch (error) {
  alert(name+"just joined " + roomID)
  navigate("/404/");
}

}

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

    }
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
        onChange={e => setID()}
      />
      </label>

<button type="button"  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"onClick={(e)=>makeAndSendJoinRequest(id,e) }>
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