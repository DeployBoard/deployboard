import { useState } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Tooltip from "@mui/material/Tooltip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { tzConvert } from "tz-convert";
import DeleteApiKey from "./deleteApiKey";

const ApiKeyRow = ({ keyData }) => {
  const [showKeyID, setShowKeyID] = useState(false);
  const [copyOpen, setCopyOpen] = useState(false);

  const securedKey = "**************************" + keyData._id.substr(-3);

  const toggleKeyID = () => {
    setShowKeyID(!showKeyID);
  };

  return (
    <TableRow
      hover
      key={keyData._id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell align="left">
        {showKeyID ? keyData._id : securedKey}
        <IconButton
          size="small"
          onClick={toggleKeyID}
          sx={{
            ml: ".5rem",
            transform: "scale(.75)",
            "&:hover": {
              background: "none",
            },
          }}
        >
          {showKeyID ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </IconButton>
        <ClickAwayListener
          onClickAway={() => {
            setCopyOpen(false);
          }}
        >
          <Tooltip
            arrow
            PopperProps={{
              disablePortal: true,
            }}
            onClose={() => {
              setCopyOpen(false);
            }}
            open={copyOpen}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            placement="top"
            title="Copied to clipboard!"
          >
            <IconButton
              size="small"
              onClick={() => {
                setCopyOpen(true);
                navigator.clipboard.writeText(keyData._id);
              }}
              sx={{
                transform: "scale(.75)",
                "&:hover": {
                  background: "none",
                },
              }}
            >
              <ContentCopyIcon />
            </IconButton>
          </Tooltip>
        </ClickAwayListener>
      </TableCell>
      <TableCell align="right">{keyData.name}</TableCell>
      <TableCell align="right">{keyData.role}</TableCell>
      <TableCell align="right">{`${keyData.enabled}`}</TableCell>
      <TableCell align="right">{tzConvert(keyData.createdAt)}</TableCell>
      <TableCell align="right">{tzConvert(keyData.updatedAt)}</TableCell>
      <TableCell align="right">
        <DeleteApiKey keyData={keyData} />
      </TableCell>
    </TableRow>
  );
};

export default ApiKeyRow;
