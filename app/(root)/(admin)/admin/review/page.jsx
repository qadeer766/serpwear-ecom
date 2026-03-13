"use client";

import React, { useCallback } from "react";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper";
import DeleteAction from "@/components/Application/Admin/DeleteAction";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DT_REVIEW_COLUMN } from "@/lib/column";
import { columnConfig } from "@/lib/helperFunction";

import {
  ADMIN_DASHBOARD,
  ADMIN_TRASH,
  ADMIN_REVIEW_SHOW,
} from "@/routes/AdminPanelRoute";

const breadCrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: "Home",
  },
  {
    href: ADMIN_REVIEW_SHOW,
    label: "Review",
  },
];

const ShowReview = () => {
  const columns = columnConfig(DT_REVIEW_COLUMN);

  const action = useCallback((row, deleteType, handleDelete) => {
    return [
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
      <BreadCrumb breadcrumbData={breadCrumbData} />

      <Card className="pt-3 rounded shadow-sm">
        <CardHeader className="pt-3 px-3 border-b">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold">Reviews</h4>
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <DatatableWrapper
            queryKey="review-data"
            fetchUrl="/api/review"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint="/api/review/export"
            deleteEndpoint="/api/review/delete"
            deleteType="SD"
            trashview={`${ADMIN_TRASH}?trashof=review`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowReview;