"use client";

import React from "react";
import EditIcon from "@mui/icons-material/Edit";
import { ListItemIcon, MenuItem } from "@mui/material";
import Link from "next/link";

const EditAction = ({ href }) => {
  if (!href) return null;

  return (
    <MenuItem
      component={Link}
      href={href}
      sx={{ display: "flex", alignItems: "center", gap: 1 }}
    >
      <ListItemIcon>
        <EditIcon fontSize="small" />
      </ListItemIcon>
      Edit
    </MenuItem>
  );
};

export default EditAction;