"use client";

import React, { useMemo } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";

import { darkTheme, lightTheme } from "@/lib/materialTheme";
import { useTheme as useNextTheme } from "next-themes";
import DataTable from "./Datatable";

const DatatableWrapper = ({
  queryKey,
  fetchUrl,
  columnsConfig,
  initialPageSize = 10,
  exportEndpoint,
  deleteType,
  trashview,
  createAction,
  deleteEndpoint,
}) => {
  const { resolvedTheme } = useNextTheme();

  // ✅ Safe theme selection
  const muiTheme = useMemo(() => {
    return resolvedTheme === "dark" ? darkTheme : lightTheme;
  }, [resolvedTheme]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <DataTable
        queryKey={queryKey}
        fetchUrl={fetchUrl}
        columnsConfig={columnsConfig}
        initialPageSize={initialPageSize}
        exportEndpoint={exportEndpoint}
        deleteType={deleteType}
        trashview={trashview}
        createAction={createAction}
        deleteEndpoint={deleteEndpoint}
      />
    </ThemeProvider>
  );
};

export default DatatableWrapper;