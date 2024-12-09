// import React, { useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useMyContext } from '../../context/context';

const SelectComponent = ({
  // eslint-disable-next-line react/prop-types
  isAuthorisedField
}) => {
  console.log(isAuthorisedField);

  const useMyContextData = useMyContext();
  const { authorisedFieldValue, setAuthorisedFieldValue } = useMyContextData

  const handleChange = (event) => {
    setAuthorisedFieldValue(event.target.value);
  };

  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel id="demo-simple-select-label">Select Option</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={isAuthorisedField || authorisedFieldValue}
        defaultValue={isAuthorisedField !== "pending" ? isAuthorisedField : ""}
        onChange={handleChange}
        label="Select AuthorisedField"
      >
        <MenuItem value={'approved'}>Approve</MenuItem>
        <MenuItem value={'blocked'}>Block</MenuItem>
        {/* <MenuItem value={'pending'}>Pending</MenuItem> */}
      </Select>
    </FormControl>
  );
};

export default SelectComponent;
