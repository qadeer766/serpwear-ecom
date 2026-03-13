"use client";

import React, { useState, useMemo } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import {
  MaterialReactTable,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  useMaterialReactTable,
} from "material-react-table";

import Link from "next/link";

import RecyclingIcon from "@mui/icons-material/Recycling";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import SaveAltIcon from "@mui/icons-material/SaveAlt";

import useDeleteMutation from "@/hooks/useDeleteMutation";
import ButtonLoading from "../ButtonLoading";
import { showToast } from "@/lib/showToast";

import { download, generateCsv, mkConfig } from "export-to-csv";

const DataTable = ({
  queryKey,
  fetchUrl,
  columnsConfig,
  initialPageSize = 10,
  exportEndpoint,
  deleteType = "SD",
  trashview,
  createAction,
  deleteEndpoint,
}) => {
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

  const [rowSelection, setRowSelection] = useState({});
  const [exportLoading, setExportLoading] = useState(false);

  const deleteMutation = deleteEndpoint
    ? useDeleteMutation(queryKey, deleteEndpoint)
    : null;

  // ================= DELETE =================
  const handleDelete = (ids, type) => {
    if (!deleteMutation) return;

    const confirmDelete =
      type === "PD"
        ? confirm("Permanently delete selected items?")
        : confirm("Move selected items to trash?");

    if (confirmDelete) {
      deleteMutation.mutate({ ids, deleteType: type });
      setRowSelection({});
    }
  };

  // ================= EXPORT =================
  const handleExport = async (selectedRows) => {
    try {
      setExportLoading(true);

      const csvConfig = mkConfig({
        fieldSeparator: ",",
        useKeysAsHeaders: true,
        filename: "export-data",
      });

      let exportData = [];

      if (Object.keys(rowSelection).length > 0) {
        exportData = selectedRows.map((row) => row.original);
      } else if (exportEndpoint) {
        const { data } = await axios.get(exportEndpoint);
        if (!data.success) throw new Error(data.message);
        exportData = data.data;
      }

      const csv = generateCsv(csvConfig)(exportData);
      download(csvConfig)(csv);
    } catch (error) {
      showToast("error", error?.message || "Export failed");
    } finally {
      setExportLoading(false);
    }
  };

  // ================= FETCH =================
  const query = useQuery({
    queryKey: [
      queryKey,
      { columnFilters, globalFilter, pagination, sorting, deleteType },
    ],
    queryFn: async () => {
      const params = {
        start: pagination.pageIndex * pagination.pageSize,
        size: pagination.pageSize,
        filters: JSON.stringify(columnFilters),
        globalFilter,
        sorting: JSON.stringify(sorting),
        deleteType,
      };

      const { data } = await axios.get(fetchUrl, { params });
      if (!data.success) throw new Error(data.message);

      return data;
    },
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });

  const {
    data = { data: [], meta: {} },
    isLoading,
    isRefetching,
    isError,
  } = query;

  // ================= TABLE =================
  const table = useMaterialReactTable({
    columns: columnsConfig,
    data: data.data || [],

    enableRowSelection: true,
    enableStickyHeader: true,
    enableStickyFooter: true,

    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,

    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,

    rowCount: data.meta?.totalRowCount ?? 0,

    getRowId: (row) => row._id,

    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      sorting,
      rowSelection,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
    },

    // ======= TOP TOOLBAR =======
    renderTopToolbarCustomActions: ({ table }) => (
      <Tooltip title="Export">
        <div>
          <ButtonLoading
            loading={exportLoading}
            onClick={() =>
              handleExport(table.getSelectedRowModel().rows)
            }
          >
            <SaveAltIcon /> Export
          </ButtonLoading>
        </div>
      </Tooltip>
    ),

    // ======= INTERNAL TOOLBAR =======
    renderToolbarInternalActions: ({ table }) => (
      <>
        <MRT_ToggleGlobalFilterButton table={table} />
        <MRT_ShowHideColumnsButton table={table} />
        <MRT_ToggleFullScreenButton table={table} />
        <MRT_ToggleDensePaddingButton table={table} />

        {deleteType !== "PD" && trashview && (
          <Tooltip title="Recycle Bin">
            <Link href={trashview}>
              <IconButton>
                <RecyclingIcon />
              </IconButton>
            </Link>
          </Tooltip>
        )}

        {deleteMutation && table.getIsSomeRowsSelected() && (
          <>
            {deleteType === "SD" && (
              <Tooltip title="Move to Trash">
                <IconButton
                  onClick={() =>
                    handleDelete(Object.keys(rowSelection), "SD")
                  }
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}

            {deleteType === "PD" && (
              <>
                <Tooltip title="Restore">
                  <IconButton
                    onClick={() =>
                      handleDelete(Object.keys(rowSelection), "RSD")
                    }
                  >
                    <RestoreFromTrashIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete Permanently">
                  <IconButton
                    onClick={() =>
                      handleDelete(Object.keys(rowSelection), "PD")
                    }
                  >
                    <DeleteForeverIcon />
                  </IconButton>
                </Tooltip>
              </>
            )}
          </>
        )}
      </>
    ),

    enableRowActions: !!createAction,
    positionActionsColumn: "last",
    renderRowActionMenuItems:
      createAction &&
      (({ row }) => createAction(row, deleteType, handleDelete)),
  });

  return <MaterialReactTable table={table} />;
};

export default DataTable;