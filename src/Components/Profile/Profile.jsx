import {collection, doc, getDoc, getDocs, query, updateDoc, where} from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { auth, fireStoreDb } from '../../firebase.config'
import { useNavigate } from 'react-router-dom'
import { Button, FormControl, InputLabel, MenuItem, Paper, Select, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import SelectComponent from '../SelectComponent/SelectComponent'
import { useMyContext } from '../../context/context'
import './Profile.css'





const Profile = () => {
    const[loggedAdminDetails , setLoggedAdminDetails] = useState();
    const[allUserDetails , setAllUsersDetails] = useState([])
    const useMyContextData = useMyContext();
    const{authorisedFieldValue} = useMyContextData ;
    const[isAdminValue, setIsAdminValue] = useState('')

    useEffect(()=> {
      fetchLoggedAdminDetails();
      fetchAllUsersDetails() ;
    } , [])

    const fetchLoggedAdminDetails = () =>{
        auth.onAuthStateChanged(async(user)=>{
           console.log(user)
          
           const docRef = doc(fireStoreDb, "Users", localStorage.getItem('adminEmployeeId'));
           const docSnap = await getDoc(docRef);
           if (docSnap.exists()) {
            setLoggedAdminDetails(docSnap.data())
            console.log(docSnap.data())
           } else {
               console.log('no data')
           }
        })
    }

    const fetchAllUsersDetails = async() => {

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
                setAllUsersDetails(tempfetchedUser)   
            }
        catch(error){
            console.log(error.message)
        }
    }

    const handleSubmit = async(user) =>{
     try{
        await updateDoc(doc(fireStoreDb, "Users", user.employeeId), {
          ...user,
          isAuthorisedField : authorisedFieldValue,
          isAdmin:isAdminValue
        })
     }
     catch(err)
     {
      console.log(err)
     }

     fetchLoggedAdminDetails();
     fetchAllUsersDetails();
    }
    

    const navigate = useNavigate()

    const handleLogout = async() => {
       try{
        // await auth.signOut();
        navigate('/login')
       }
       catch(error){
        console.log(error.message)
       }

    }

    const handleChange = (e) => {
       setIsAdminValue(e.target.value)
    }

    console.log(allUserDetails)

  return (

  <div className="main-profile-container">
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
                  <TableCell>MakeAdmin</TableCell>
                  <TableCell>isAdmin</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {allUserDetails.map((user) => (
                  <TableRow key={user.employeeId}>
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
                    <TableCell>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel id="demo-simple-select-label">Select Option</InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={isAdminValue}
                            onChange={handleChange}
                            label="Select AuthorisedField"
                          >
                            <MenuItem value={'true'}>True</MenuItem>
                            <MenuItem value={'false'}>False</MenuItem>
                          </Select>
                        </FormControl>
                    </TableCell>
                    <TableCell>{user.isAdmin}</TableCell>
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