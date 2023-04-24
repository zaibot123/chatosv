import React from "react";
import './App.css'
import { useState } from "react";



function JoinRoom(){
let [id, setID] = useState("")

const makeAndSendJoinRequest = async (roomID) => {
const url='http://localhost:5001/'+roomID+'/join'
console.log(url)
alert(roomID)
const jsonBody={
    room:roomID,
    user:"Tobias"
}

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
  console.log(response1)
if (response1.status===200){
    //reroute to website/chat/room
    //aquire key from host
}
}

const makeAndSendCreateRoomRequest= async () => {
    console.log("NSS")
    const response1 = await fetch('http://localhost:5001/createRoom',
    {
        Method: 'POST',
        Headers: {
          Accept: 'application.json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"user": "tobias"}),
        Cache: 'default'
      });
      console.log(response1)
    if (response1.status===200){
        //reroute to website/chat/room
        //aquire key from host
    }
}
    


return (
    <>
    <div>
    <header className='px-4 py-2 bg-blue-700'>
    <img src="src\1d00702e4fe12b215e26cd44d2e4fd6f.png" width="100" alt="SecretChat" />
</header>
</div>
<div>
<form className="bg-blue-300 shadow-md rounded px-80 pt-6 pb-8 mb-4 display:block">
      <label>Room Code:
      <input
                             type="id"
                             placeholder=""
                             className="me-2"
                             aria-label="id" 
                             value={id}
                             onChange={e => setID(e.target.value)}
      />
<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"onClick={()=>makeAndSendJoinRequest(id)}>
  Join room!

</button>
<br></br>

<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"onClick={()=>makeAndSendCreateRoomRequest()}>
 Dont have a room? Create one here!
</button>
</label>
</form>
</div>


    </>


  )
}
export default JoinRoom;    