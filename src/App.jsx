import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import JoinRoom from './joinRoom'
import { 
  Routes, Route, Link, NavLink, useParams, Outlet
} from "react-router-dom";
import ChatMessage from './ChatMessages'
import ListOfChatMessages from './ListOfChatMessages'
import keyManager from './keyManager'
import NotFound from './NotFound.jsx'

function App() {

  return(

    <div className="root">
<Routes>
<Route path="/"     element={<JoinRoom />} />
<Route path="/chat/:roomid" element={<ListOfChatMessages />} /> 
<Route path="/chat"     element={<ListOfChatMessages />} />
<Route path ="/404" element={<NotFound/>}></Route>
</Routes>
 </div>
  )
}

export default App
