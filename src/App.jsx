import { useState } from 'react'

import SignUp from './Components/SignUp/SignUp'
import { Route, Routes } from 'react-router-dom'
import Login from './Components/Login/Login'
import Profile from './Components/Profile/Profile'

function App() {
  return (
    <>
     <Routes>
      <Route path='/' element={<SignUp/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/profile' element={<Profile />}/>
     </Routes>
    </>
  )
}

export default App
