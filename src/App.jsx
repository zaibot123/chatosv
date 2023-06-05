import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import JoinRoom from './JoinRoom'
import { 
  Routes, Route, Link, NavLink, useParams, Outlet
} from "react-router-dom";
import ChatMessage from './ChatMessages'
import ListOfChatMessages from './ListOfChatMessages'
import keyManager from './keyManager'
import NotFound from './NotFound.jsx'
import {UserContext} from './UserContext'
import {ConnectionContext} from './ConnectionContext'



function App() {
  const[name,setName]=useState("Anon")
  const[connection,setConnection]=useState();
  return(

    <div className="root">
  <UserContext.Provider value={{name,setName}}>
  <ConnectionContext.Provider value={{connection,setConnection}}>
<Routes>
<Route path="/"     element={<JoinRoom />} />
<Route path="/chat/:roomid" element={<ListOfChatMessages />} /> 
<Route path="/chat"     element={<ListOfChatMessages />} />
<Route path ="/404" element={<NotFound/>}></Route>
</Routes>
</ConnectionContext.Provider>
</UserContext.Provider>
 </div>
  )
}

export default App
