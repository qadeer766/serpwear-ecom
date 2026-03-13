"use client";

import React from "react";
import { ListItemIcon, MenuItem } from "@mui/material";
import Link from "next/link";
import { RemoveRedEye } from "@mui/icons-material";

const ViewAction = ({ href }) => {
  if (!href) return null;

  return (
    <MenuItem
      component={Link}
      href={href}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <ListItemIcon>
        <RemoveRedEye fontSize="small" />
      </ListItemIcon>
      View
    </MenuItem>
  );
};

export default ViewAction;