

"use client";

import React, { useCallback, useMemo } from "react";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper";
import DeleteAction from "@/components/Application/Admin/DeleteAction";
import EditAction from "@/components/Application/Admin/EditAction";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { DT_CATEGORY_COLUMN } from "@/lib/column";
import { columnConfig } from "@/lib/helperFunction";

import {
  ADMIN_CATEGORY_ADD,
  ADMIN_CATEGORY_EDIT,
  ADMIN_CATEGORY_SHOW,
  ADMIN_DASHBOARD,
  ADMIN_TRASH,
} from "@/routes/AdminPanelRoute";

const CategoryPage = () => {
  const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: "Home" },
    { href: ADMIN_CATEGORY_SHOW, label: "Category" },
  ];

  // ✅ Add createdAt + updatedAt columns and ensure other necessary configurations are passed
  const columns = useMemo(() => {
    return columnConfig(DT_CATEGORY_COLUMN, true, true, false);
  }, []);

  const action = useCallback((row, deleteType, handleDelete) => {
    return [
      <EditAction
        key={`edit-${row.original._id}`}
        href={ADMIN_CATEGORY_EDIT(row.original._id)}
      />,
      <DeleteAction
        key={`delete-${row.original._id}`}
        handleDelete={handleDelete}
        row={row}
        deleteType={deleteType}
      />,
    ];
  }, []);

  return (
    <div>
      <BreadCrumb breadCrumbData={breadcrumbData} />

      <Card className="pt-3 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-lg">Show Category</h4>

            {/* Button to add new category */}
            <Button asChild>
              <Link href={ADMIN_CATEGORY_ADD}>
                <FiPlus className="mr-1" />
                New Category
              </Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="px-0">
          {/* Table Wrapper for displaying categories */}
          <DatatableWrapper
            queryKey="category-data"
            fetchUrl="/api/category"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint="/api/category/export"
            deleteEndpoint="/api/category/delete"
            deleteType="SD"
            trashview={`${ADMIN_TRASH}?trashof=category`}
            createAction={action}
            emptyStateMessage="No categories available" // Optional: Add message when there are no categories
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryPage;