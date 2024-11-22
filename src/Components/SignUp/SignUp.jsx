
import React, { useState } from 'react'
import './SignUP.css'
import loginImg from '../../images/login-vector.png'
import { useNavigate } from 'react-router-dom'
import { auth, fireStoreDb} from '../../firebase.config'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import {doc,setDoc } from 'firebase/firestore'


const SignUp = () => {

  const[userInput , setUserInput] = useState({
      firstname : '' ,
      lastname : '',
      employeeId:'',
      password: '',
  })

  
  const handleChange = (e) => {
    const{name , value} = e.target
    setUserInput((prev )=> {
      return {
        ...prev,
        [name] : value
      }

    })
  }

  const provider = new GoogleAuthProvider();
  const navigate = useNavigate()

  const handleSignUP = async(e) => {
     e.preventDefault()
     
    try{

           const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Store Client details in Firestore
            await setDoc(doc(fireStoreDb, "Users", userInput.employeeId), {
              firstname : userInput.firstname,
              lastname : userInput.lastname,
              email: user.email,
              uid: user.uid,
              employeeId: userInput.employeeId,
              password : userInput.password,
            });

            console.log('User signed up successfully');
            navigate('/login');
  } catch (error) {
      console.error('Sign up failed:', error.message);
      alert('Sign up failed. Please try again.');
  }


  }

  return ( <>

    <div className="main-container">
      <form className='sub-container'>
  
        <div className='login-img-container row'>
            <img src={loginImg} alt="" width={500}/>
        </div>

        <div className='form-container row'>
           <h1 className='signup-heading'>Sign Up to TicketNest-Admin</h1>
           <div className='input-container '>
            <input className="text-field" type='text' placeholder='First Name' name='firstname' onChange={handleChange}/>
            <input className="text-field" type='text' placeholder='Last Name' name='lastname' onChange={handleChange}/>
            <input className="text-field" type='email' placeholder='Employee Id' name='employeeId' onChange={handleChange}/>
            <input className="text-field" type='password' placeholder='Password' name='password' onChange={handleChange}/>
            <button className='sign-up-btn' onClick={handleSignUP}>Sign-up with Google</button>        
            <div style={{alignSelf:'flex-end'}}>
              Already Registered<a href='/login' style={{cursor:'pointer'}} className='login-link'>Login</a>
            </div>
          </div>
        </div>
          
    </form>
    </div>
    </>
  )
}

export default SignUp