"use client";

import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { ListItemIcon, MenuItem } from "@mui/material";

const DeleteAction = ({ handleDelete, row, deleteType = "SD" }) => {
  const handleClick = (e) => {
    e.stopPropagation();

    if (!row?.original?._id || typeof handleDelete !== "function") return;

    handleDelete([row.original._id], deleteType);
  };

  return (
    <MenuItem
      onClick={handleClick}
      sx={{
        color: "error.main",
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <ListItemIcon sx={{ color: "error.main" }}>
        <DeleteIcon fontSize="small" />
      </ListItemIcon>
      Delete
    </MenuItem>
  );
};

export default DeleteAction;