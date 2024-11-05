import {collection, doc, getDoc, getDocs, query, updateDoc, where} from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { auth, fireStoreDb } from '../../firebase.config'
import { useNavigate } from 'react-router-dom'
import { Button, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import SelectComponent from '../SelectComponent/SelectComponent'
import { useMyContext } from '../../context/context'
import './Profile.css'





const Profile = () => {
    const[loggedAdminDetails , setLoggedAdminDetails] = useState();
    const[pendingApprovalUsers , setPendingApprovalUsers] = useState([])
    const useMyContextData = useMyContext();
    const{authorisedFieldValue} = useMyContextData

    useEffect(()=> {
      fetchLoggedAdminDetails();
      fetchApprovalPendingData() ;
    } , [])

    const fetchLoggedAdminDetails = () =>{
        auth.onAuthStateChanged(async(user)=>{
           console.log(user)
          
           const docRef = doc(fireStoreDb, "Admins", localStorage.getItem('adminEmployeeId'));
           const docSnap = await getDoc(docRef);
           if (docSnap.exists()) {
            setLoggedAdminDetails(docSnap.data())
            console.log(docSnap.data())
           } else {
               console.log('no data')
           }
        })
    }

    const fetchApprovalPendingData = async() => {

        try{
                // const docRef = query(collection(fireStoreDb, "Users"),
                //                where("isAuthorisedField", '==', "pending"))
                const docRef = collection(fireStoreDb , 'Users')
                const fetchedDoc = await getDocs(docRef);
            
                 const tempfetchedUser = []
                    fetchedDoc.forEach((doc) =>
                        {
                            tempfetchedUser.push(doc.data())
                        }                
                )
                setPendingApprovalUsers(tempfetchedUser)   
            }
        catch(error){
            console.log(error.message)
        }
    }

    const handleSubmit = async(user) =>{
     try{
        await updateDoc(doc(fireStoreDb, "Users", user.employeeId), {
          ...user,
          isAuthorisedField : authorisedFieldValue
        })
     }
     catch(err)
     {
      console.log(err)
     }
    }
    

    const navigate = useNavigate()

    const handleLogout = async() => {
       try{
        await auth.signOut();
        navigate('/login')
       }
       catch(error){
        console.log(error.message)
       }

    }

  return (

  <div className="main-container">
      <div>
        <p>Welcome {loggedAdminDetails && loggedAdminDetails.firstname} to admin portal</p> 
       <button onClick={handleLogout}>LogOut</button>
      </div>


      <TableContainer component={Paper} sx={{ maxWidth: 1250 }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell>EmployeeId</TableCell>
                  <TableCell>Firstname</TableCell>
                  <TableCell>Lastname</TableCell>
                  <TableCell>Approval Status</TableCell>
                  <TableCell>MakeApproval</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingApprovalUsers.map((user) => (
                  <TableRow key={user.id}>
                      <TableCell>{user.employeeId}</TableCell>
                    <TableCell>{user.firstname}</TableCell>
                    <TableCell>{user.lastname}</TableCell>
                    <TableCell><Typography sx={{width:'50%',textAlign:'center',padding:'12px',borderRadius:'12px',backgroundColor:(()=>{
                      switch(user.isAuthorisedField){
                        case 'pending' : return 'lightblue';
                        case 'approved' : return 'lightgreen' ;
                        case 'blocked' : return 'lightred';
                        default : return 'transparent'
                      }
                    })()}}>
                    {user.isAuthorisedField}</Typography></TableCell>
                    <TableCell><SelectComponent/></TableCell>
                    <TableCell><Button variant="contained" onClick={()=> {handleSubmit(user)}}>Submit</Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </TableContainer>
 
  </div>
  )
}

export default Profile