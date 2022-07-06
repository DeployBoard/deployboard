import { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

const CustomFilter = ({ label, options, selected, onSelect }) => {
  const [value, setValue] = useState(selected);
  return (
    <Autocomplete
      id="tags-outlined"
      options={options}
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
        onSelect(newValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          // placeholder="Filter..."
          size="small"
        />
      )}
    />
  );
};

export default CustomFilter;
