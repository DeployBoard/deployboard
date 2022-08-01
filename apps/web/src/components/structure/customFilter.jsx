import { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";

const CustomFilter = ({ label, options, selected, onSelect, loading }) => {
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
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          size="small"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress
                    color="inherit"
                    size={20}
                    sx={{ mr: "2rem" }}
                  />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default CustomFilter;
