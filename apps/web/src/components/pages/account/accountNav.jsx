import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";

const pages = ["users", "apikeys", "integrations"];

const AccountNav = () => {
  return (
    <Toolbar>
      {pages.map((page) => (
        <Button
          key={page}
          sx={{
            color: "black",
            display: "block",
            borderBottom: 2,
            borderRadius: 0,
            borderColor: "white",
            ":hover": {
              bgcolor: "white",
              color: "black",
              borderBottom: 2,
              borderRadius: 0,
            },
          }}
          href={`/account/${page}`}
        >
          {page}
        </Button>
      ))}
    </Toolbar>
  );
};

export default AccountNav;
