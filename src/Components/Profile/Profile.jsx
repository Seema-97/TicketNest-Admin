import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { auth, fireStoreDb } from '../../firebase.config'
import { useNavigate } from 'react-router-dom'
import { Button, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import SelectComponent from '../SelectComponent/SelectComponent'
import { useMyContext } from '../../context/context'
import './Profile.css'





const Profile = () => {
  const [loggedAdminDetails, setLoggedAdminDetails] = useState();
  const [allUserDetails, setAllUsersDetails] = useState([])
  const useMyContextData = useMyContext();
  // const { authorisedFieldValue } = useMyContextData;
  const [isAdminValue, setIsAdminValue] = useState('');
  const [authorisedFieldValue, setAuthorisedFieldValue] = useState("");
  const [editId, setEditId] = useState("");

  useEffect(() => {
    fetchLoggedAdminDetails();
    fetchAllUsersDetails();
  }, [])

  const fetchLoggedAdminDetails = () => {
    auth.onAuthStateChanged(async (user) => {
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

  const fetchAllUsersDetails = async () => {

    try {
      // const docRef = query(collection(fireStoreDb, "Users"),
      //                where("isAuthorisedField", '==', "pending"))
      const docRef = collection(fireStoreDb, 'Users')
      const fetchedDoc = await getDocs(docRef);

      const tempfetchedUser = []
      fetchedDoc.forEach((doc) => {
        tempfetchedUser.push(doc.data())
      }
      )
      setAllUsersDetails(tempfetchedUser)
    }
    catch (error) {
      console.log(error.message)
    }
  }

  const handleSubmit = async (user) => {
    try {
      await updateDoc(doc(fireStoreDb, "Users", user.employeeId), {
        ...user,
        isAuthorisedField: authorisedFieldValue,
        isAdmin: isAdminValue
      })
    }
    catch (err) {
      console.log(err)
    }

    fetchLoggedAdminDetails();
    fetchAllUsersDetails();
  }


  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      // await auth.signOut();
      navigate('/login')
    }
    catch (error) {
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

      <table className="table table-stripped">
        <thead>
          <tr>
            <td>EmployeeId</td>
            <td>Firstname</td>
            <td>Lastname</td>
            <td>Approval Status</td>
            <td>MakeApproval</td>
            <td>MakeAdmin</td>
            <td>isAdmin</td>
            <td>Update</td>
          </tr>
        </thead>
        <tbody>
          {allUserDetails.map((user) => (
            <tr key={user.employeeId}>
              <td>{user.employeeId}</td>
              <td>{user.firstname}</td>
              <td>{user.lastname}</td>
              <td>
                <Typography sx={{
                  width: '50%', textAlign: 'center', padding: '12px', borderRadius: '12px', backgroundColor: (() => {
                    switch (user.isAuthorisedField) {
                      case 'pending': return 'lightblue';
                      case 'approved': return 'lightgreen';
                      case 'blocked': return 'lightred';
                      default: return 'transparent'
                    }
                  })()
                }}>
                  {user.isAuthorisedField}</Typography>
              </td>
              <td>
                <select disabled={!(editId === user.employeeId)} name="authorisedFieldValue" value={(authorisedFieldValue == "" && editId === user.employeeId) ? authorisedFieldValue : user.isAuthorisedField} onChange={e => setAuthorisedFieldValue(e.target.value)} className="form-control form-control-sm">
                  <option value="">Choose Status</option>
                  <option value={'approved'}>Approve</option>
                  <option value={'blocked'}>Block</option>
                </select>

              </td>
              <td>
                <select
                  disabled={!(editId === user.employeeId)}
                  name="isAdmin"
                  value={(isAdminValue == "" && editId === user.employeeId) ? isAdminValue : user.isAdmin} onChange={handleChange}
                  className="form-control form-control-sm"
                >
                  <option value="">Choose Status</option>
                  <option value={'true'}>true</option>
                  <option value={'false'}>false</option>
                </select>
              </td>
              <td>{user.isAdmin}</td>
              <td>
                <input type="checkbox" name="editId" onChange={e => setEditId(e.target.value)} value={user.employeeId} />
              </td>
              <td><Button variant="contained" onClick={() => { handleSubmit(user) }}>Submit</Button></td>
            </tr>
          ))}
        </tbody>
      </table>


      {/* <TableContainer component={Paper} sx={{ maxWidth: 1250 }}>
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
              <TableCell>Update</TableCell>
              <TableCell>Submit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allUserDetails.map((user) => (
              <TableRow key={user.employeeId}>
                <TableCell>{user.employeeId}</TableCell>
                <TableCell>{user.firstname}</TableCell>
                <TableCell>{user.lastname}</TableCell>
                <TableCell></TableCell>
                <TableCell><SelectComponent isAuthorisedField={user.isAuthorisedField} /></TableCell>
                <TableCell>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="demo-simple-select-label">Select Option</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      // value={isAdminValue}
                      defaultValue={user.isAdmin !== undefined ? user.isAdmin : isAdminValue}
                      onChange={handleChange}
                      label="Select AuthorisedField"
                    >
                      <MenuItem value={'true'}>True</MenuItem>
                      <MenuItem value={'false'}>False</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>{user.isAdmin}</TableCell>
                <TableCell>
                  <input type="checkbox" name="EditId" onChange={e => setEditId(e.target.value)} value={user.employeeId} />
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}

    </div>
  )
}

export default Profile

// 80004437, 123456