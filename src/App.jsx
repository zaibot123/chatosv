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

function App() {

  return(

    <div className="root">
<Routes>
<Route path="/"     element={<JoinRoom />} />
<Route path="/chat/:roomid" element={<ListOfChatMessages />} /> 
<Route path="/chat"     element={<ListOfChatMessages />} />
</Routes>
 </div>
  )
}

export default App
